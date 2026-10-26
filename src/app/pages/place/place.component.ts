import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { WeatherService } from '../../core/services/weather.service';
import { WeatherStateService } from '../../core/services/weather-state.service';
import { City, DailyForecast, HourForecast, MapPlace, ResortWeather, WikiSummary } from '../../core/models/weather.model';
import { dateFromString, formatTemp, iconUrl } from '../../core/utils/format';
import { wmoToIcon, wmoToKey } from '../../core/utils/weather-codes';

// ძებნით ნაპოვნი ადგილის (ქალაქი, სოფელი) გვერდი: აღწერა Wikipedia-დან, ამინდი და პროგნოზი Open-Meteo-დან.
// ადგილი ლინკიდან მოდის: /place?name=...&region=...&lat=...&lon=...
@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  // საერთო ბარათები, საათობრივი და 7 დღის სტილები კურორტის გვერდიდან
  styleUrls: ['../resort-detail/resort-detail.component.css', './place.component.css']
})
export class PlaceComponent implements OnInit, OnDestroy {
  place?: City;
  current?: ResortWeather;
  hours: HourForecast[] = [];
  days: DailyForecast[] = [];
  elevation?: number;
  summary: WikiSummary | null = null;
  mapPlace: MapPlace | null = null;

  loadingCurrent = true;
  loadingForecast = true;
  currentFailed = false;
  forecastFailed = false;

  private paramsSub?: Subscription;
  private langSub?: Subscription;
  private summarySub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weatherService: WeatherService,
    private translate: TranslateService,
    private weatherState: WeatherStateService
  ) {
    weatherState.theme = 'theme-default';
  }

  ngOnInit(): void {
    // subscribe და არა snapshot: ამ გვერდიდან ახალი ძებნისას კომპონენტი თავიდან არ იქმნება
    this.paramsSub = this.route.queryParamMap.subscribe(params => {
      const lat = parseFloat(params.get('lat') || '');
      const lon = parseFloat(params.get('lon') || '');
      // არასწორი ლინკი → მთავარ გვერდზე
      if (isNaN(lat) || isNaN(lon)) {
        this.router.navigate(['/']);
        return;
      }

      this.load({
        name: params.get('name') || '',
        region: params.get('region') || '',
        country: params.get('country') || '',
        countryCode: params.get('code') || '',
        lat,
        lon
      });
    });

    // ენის შეცვლისას აღწერა ახალ ენაზე ჩაიტვირთოს
    this.langSub = this.translate.onLangChange.subscribe(() => this.loadSummary());
  }

  ngOnDestroy(): void {
    this.paramsSub?.unsubscribe();
    this.langSub?.unsubscribe();
    this.summarySub?.unsubscribe();
  }

  private load(place: City) {
    this.place = place;
    this.current = undefined;
    this.hours = [];
    this.days = [];
    this.elevation = undefined;
    this.loadingCurrent = true;
    this.loadingForecast = true;
    this.currentFailed = false;
    this.forecastFailed = false;
    this.updateMapPlace();
    this.loadSummary();

    // თუ ამასობაში სხვა ადგილი მოძებნეს, ძველ პასუხს აღარ ვიყენებთ
    this.weatherService.getPlaceWeather(place.lat, place.lon).subscribe({
      next: data => {
        if (this.place !== place) return;
        this.current = data;
        this.loadingCurrent = false;
        this.weatherState.theme = this.themeFor(data);
        this.updateMapPlace();
      },
      error: () => {
        if (this.place !== place) return;
        this.currentFailed = true;
        this.loadingCurrent = false;
        this.updateMapPlace();
      }
    });

    this.weatherService.getPlaceForecast(place.lat, place.lon).subscribe({
      next: data => {
        if (this.place !== place) return;
        this.hours = data.hours;
        this.days = data.days;
        this.elevation = data.elevation;
        this.loadingForecast = false;
      },
      error: () => {
        if (this.place !== place) return;
        this.forecastFailed = true;
        this.loadingForecast = false;
      }
    });
  }

  private loadSummary() {
    if (!this.place) return;
    // წინა მოთხოვნას ვაუქმებთ, რომ ძველი ადგილის ან ძველი ენის აღწერა არ გამოჩნდეს
    this.summarySub?.unsubscribe();
    this.summary = null;
    const { name, lat, lon } = this.place;
    this.summarySub = this.weatherService.getPlaceSummary(name, lat, lon, this.translate.currentLang)
      .subscribe(summary => this.summary = summary);
  }

  private updateMapPlace() {
    if (!this.place) return;
    this.mapPlace = {
      name: this.place.name,
      subtitle: this.place.region,
      lat: this.place.lat,
      lon: this.place.lon,
      temp: this.current?.temp,
      icon: this.current ? wmoToIcon(this.current.weatherCode, this.current.isDay) : undefined,
      failed: this.currentFailed
    };
  }

  // ფონი ახლანდელი ამინდის მიხედვით (იგივე თემები, რაც ქალაქის გვერდზე)
  private themeFor(weather: ResortWeather): string {
    if (!weather.isDay) return 'theme-night';
    const key = wmoToKey(weather.weatherCode);
    if (key === 'clear' || key === 'mainlyClear') return 'theme-sunny';
    if (key === 'snow' || key === 'snowShowers') return 'theme-snowy';
    if (key === 'drizzle' || key === 'rain' || key === 'showers' || key === 'thunderstorm') return 'theme-rainy';
    return 'theme-cloudy';
  }

  // სათაურისთვის: "იმერეთი, საქართველო", "England, United Kingdom" (ცარიელ ნაწილებს ვტოვებთ)
  get location(): string {
    return [this.place?.region, this.place?.country].filter(Boolean).join(', ');
  }

  // "დეტალური პროგნოზი" → ქალაქის გვერდი (OpenWeatherMap, 5 დღე)
  get cityParams() {
    const p = this.place!;
    return { name: p.name, region: p.region, country: p.country, code: p.countryCode, lat: p.lat, lon: p.lon };
  }

  formatTemp(temp: number) { return formatTemp(temp); }
  weatherKey(code: number) { return wmoToKey(code); }
  icon(code: number, isDay: boolean) { return iconUrl(wmoToIcon(code, isDay)); }
  date(day: DailyForecast) { return dateFromString(day.date); }
}

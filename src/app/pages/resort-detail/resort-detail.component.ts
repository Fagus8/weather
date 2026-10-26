import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { WeatherService } from '../../core/services/weather.service';
import { WeatherStateService } from '../../core/services/weather-state.service';
import { DailyForecast, HourForecast, Language, MapPlace, Resort, ResortWeather } from '../../core/models/weather.model';
import { RESORTS } from '../../data/resorts';
import { dateFromString, formatTemp, iconUrl } from '../../core/utils/format';
import { wmoToIcon, wmoToKey } from '../../core/utils/weather-codes';

@Component({
  selector: 'app-resort-detail',
  templateUrl: './resort-detail.component.html',
  styleUrls: ['./resort-detail.component.css']
})
export class ResortDetailComponent implements OnInit, OnDestroy {
  resort?: Resort;
  current?: ResortWeather;
  hours: HourForecast[] = [];
  days: DailyForecast[] = [];
  mapPlace: MapPlace | null = null;
  private langSub?: Subscription;
  private paramSub?: Subscription;

  loadingCurrent = true;
  loadingForecast = true;
  currentFailed = false;
  forecastFailed = false;

  constructor(
    private route: ActivatedRoute,
    private weatherService: WeatherService,
    private translate: TranslateService,
    weatherState: WeatherStateService
  ) {
    weatherState.theme = 'theme-resorts';
  }

  ngOnInit(): void {
    // რუკის ფანჯარაში კურორტის სახელი ენის შეცვლისას განახლდეს
    this.langSub = this.translate.onLangChange.subscribe(() => this.updateMapPlace());

    // URL-იდან id-ს ვიღებთ, მაგ. /resort/gudauri → "gudauri".
    // subscribe და არა snapshot: ძებნით ერთი კურორტიდან მეორეზე გადასვლისას გვერდი თავიდან არ იქმნება
    this.paramSub = this.route.paramMap.subscribe(params => this.load(params.get('id')));
  }

  private load(id: string | null) {
    this.resort = RESORTS.find(r => r.id === id);
    this.current = undefined;
    this.hours = [];
    this.days = [];
    this.loadingCurrent = true;
    this.loadingForecast = true;
    this.currentFailed = false;
    this.forecastFailed = false;
    if (!this.resort) return;

    const resort = this.resort;
    this.updateMapPlace();

    // თუ ამასობაში სხვა კურორტზე გადავიდნენ, ძველ პასუხს აღარ ვიყენებთ
    this.weatherService.getResortWeather(resort).subscribe({
      next: data => {
        if (this.resort !== resort) return;
        this.current = data;
        this.loadingCurrent = false;
        this.updateMapPlace();
      },
      error: () => {
        if (this.resort !== resort) return;
        this.currentFailed = true;
        this.loadingCurrent = false;
        this.updateMapPlace();
      }
    });

    this.weatherService.getResortForecast(resort).subscribe({
      next: data => {
        if (this.resort !== resort) return;
        this.hours = data.hours;
        this.days = data.days;
        this.loadingForecast = false;
      },
      error: () => {
        if (this.resort !== resort) return;
        this.forecastFailed = true;
        this.loadingForecast = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.paramSub?.unsubscribe();
  }

  updateMapPlace() {
    if (!this.resort) return;
    this.mapPlace = {
      name: this.resort.name[this.lang],
      subtitle: this.resort.region[this.lang],
      lat: this.resort.lat,
      lon: this.resort.lon,
      temp: this.current?.temp,
      icon: this.current ? wmoToIcon(this.current.weatherCode, this.current.isDay) : undefined,
      failed: this.currentFailed
    };
  }

  get lang(): Language {
    return this.translate.currentLang as Language;
  }

  formatTemp(temp: number) { return formatTemp(temp); }
  weatherKey(code: number) { return wmoToKey(code); }
  icon(code: number, isDay: boolean) { return iconUrl(wmoToIcon(code, isDay)); }
  date(day: DailyForecast) { return dateFromString(day.date); }
}

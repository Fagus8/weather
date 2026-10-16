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
    // URL-იდან id-ს ვიღებთ, მაგ. /resort/gudauri → "gudauri"
    const id = this.route.snapshot.paramMap.get('id');
    this.resort = RESORTS.find(r => r.id === id);
    if (!this.resort) return;

    // რუკის ფანჯარაში კურორტის სახელი ენის შეცვლისას განახლდეს
    this.updateMapPlace();
    this.langSub = this.translate.onLangChange.subscribe(() => this.updateMapPlace());

    this.weatherService.getResortWeather(this.resort).subscribe({
      next: data => {
        this.current = data;
        this.loadingCurrent = false;
        this.updateMapPlace();
      },
      error: () => {
        this.currentFailed = true;
        this.loadingCurrent = false;
        this.updateMapPlace();
      }
    });

    this.weatherService.getResortForecast(this.resort).subscribe({
      next: data => {
        this.hours = data.hours;
        this.days = data.days;
        this.loadingForecast = false;
      },
      error: () => {
        this.forecastFailed = true;
        this.loadingForecast = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
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

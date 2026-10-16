import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { WeatherService } from '../../core/services/weather.service';
import { WeatherStateService } from '../../core/services/weather-state.service';
import { City, CurrentWeather, DayForecast, MapPlace, WeatherForecast } from '../../core/models/weather.model';
import { dateFromString, flagUrl, formatTemp, formatTime, iconUrl, toLocalDate } from '../../core/utils/format';
import { owmToKey } from '../../core/utils/weather-codes';

// ნებისმიერი ქალაქის ამინდი (OpenWeatherMap). ქალაქი URL-დან მოდის: /city?name=...&lat=...&lon=...
@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit, OnDestroy {
  selectedCity: City | null = null;
  current: CurrentWeather | null = null;
  days: DayForecast[] = [];
  mapPlace: MapPlace | null = null;
  timezone = 0;
  localTime = '';
  localDate = new Date();
  todayDate = ''; // ქალაქის დღევანდელი თარიღი, მაგ. "2026-10-16"
  loading = false;
  errorMessage = ''; // თარგმანის გასაღები, მაგ. STATUS.NO_INTERNET

  darkMode = false;
  private paramsSub!: Subscription;

  popularCities: City[] = [
    { name: 'Tbilisi', region: '', country: 'Georgia', countryCode: 'GE', lat: 41.6914, lon: 44.8341 },
    { name: 'London', region: 'England', country: 'United Kingdom', countryCode: 'GB', lat: 51.5085, lon: -0.1257 },
    { name: 'New York', region: 'New York', country: 'United States', countryCode: 'US', lat: 40.7143, lon: -74.006 },
    { name: 'Tokyo', region: 'Tokyo', country: 'Japan', countryCode: 'JP', lat: 35.6895, lon: 139.6917 },
    { name: 'Paris', region: 'Île-de-France', country: 'France', countryCode: 'FR', lat: 48.8534, lon: 2.3488 }
  ];

  constructor(
    private weatherService: WeatherService,
    private weatherState: WeatherStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.darkMode = this.weatherState.darkMode;

    // URL-ის პარამეტრები იცვლება, როცა ჰედერის ძებნიდან ახალ ქალაქს ვირჩევთ,
    // ამიტომ subscribe-ს ვაკეთებთ და არა snapshot-ს
    this.paramsSub = this.route.queryParamMap.subscribe(params => {
      if (params.get('lat') && params.get('lon')) {
        this.loadWeather({
          name: params.get('name') || '',
          region: params.get('region') || '',
          country: params.get('country') || '',
          countryCode: params.get('code') || '',
          lat: Number(params.get('lat')),
          lon: Number(params.get('lon'))
        });
      } else {
        // პარამეტრების გარეშე ბოლო ქალაქს ან თბილისს ვაჩვენებთ
        this.loadWeather(this.weatherState.lastCity || this.popularCities[0]);
      }
    });
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
  }

  loadWeather(city: City) {
    this.loading = true;
    this.errorMessage = '';

    // forkJoin ორივე მოთხოვნას ერთად აგზავნის და ელოდება, სანამ ორივე დასრულდება
    forkJoin({
      current: this.weatherService.getCurrentWeather(city.lat, city.lon),
      forecast: this.weatherService.getForecast(city.lat, city.lon)
    }).subscribe({
      next: data => {
        this.selectedCity = city;
        this.current = data.current;
        this.timezone = data.current.timezone;
        this.days = this.groupByDays(data.forecast.list);
        this.mapPlace = {
          name: city.name,
          subtitle: city.region,
          lat: city.lat,
          lon: city.lon,
          temp: data.current.main.temp,
          icon: data.current.weather[0].icon
        };

        const now = Math.floor(Date.now() / 1000);
        this.localTime = formatTime(now, this.timezone);
        this.localDate = toLocalDate(now, this.timezone);
        // გვიან საღამოს პროგნოზი უკვე ხვალიდან იწყება, ამიტომ "დღეს"-ს თარიღით ვამოწმებთ
        this.todayDate = this.localDate.toISOString().slice(0, 10);

        this.weatherState.lastCity = city;
        this.updateTheme();
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = this.getErrorKey(err);
      }
    });
  }

  // 3-საათიან ჩანაწერებს დღეების მიხედვით ვაჯგუფებთ (ქალაქის ადგილობრივი დროით)
  groupByDays(list: WeatherForecast[]): DayForecast[] {
    const days: DayForecast[] = [];

    for (const item of list) {
      const localDate = toLocalDate(item.dt, this.timezone);
      const date = localDate.toISOString().slice(0, 10);

      let day = days.find(d => d.date === date);
      if (!day) {
        day = { date: date, hours: [], min: item.main.temp_min, max: item.main.temp_max, icon: item.weather[0].icon };
        days.push(day);
      }

      day.hours.push(item);
      day.min = Math.min(day.min, item.main.temp_min);
      day.max = Math.max(day.max, item.main.temp_max);

      // დღის აიქონად შუადღის ამინდს ვიღებთ
      const hour = localDate.getUTCHours();
      if (hour >= 12 && hour < 15) {
        day.icon = item.weather[0].icon;
      }
    }

    return days.slice(0, 5);
  }

  openDay(day: DayForecast) {
    this.weatherState.saveDay(day.hours, this.selectedCity?.name || '', this.timezone);
    this.router.navigate(['/detail']);
  }

  // სწრაფი ღილაკები იგივე გზით მუშაობს, რაც ძებნა: URL-ს ვცვლით
  openCity(city: City) {
    this.router.navigate(['/city'], {
      queryParams: { name: city.name, region: city.region, country: city.country, code: city.countryCode, lat: city.lat, lon: city.lon }
    });
  }

  getErrorKey(err: HttpErrorResponse): string {
    if (err.status === 0) return 'STATUS.NO_INTERNET';
    if (err.status === 401) return 'STATUS.BAD_KEY';
    if (err.status === 404) return 'STATUS.NOTHING_FOUND';
    return 'STATUS.UNKNOWN';
  }

  changeMode() {
    this.darkMode = !this.darkMode;
    this.weatherState.darkMode = this.darkMode;
    this.updateTheme();
  }

  // ფონის ფერი ამინდის მიხედვით
  updateTheme() {
    let theme = 'theme-default';
    if (this.darkMode) {
      theme = 'theme-dark';
    } else if (this.current) {
      const main = this.current.weather[0].main;
      if (this.current.weather[0].icon.endsWith('n')) theme = 'theme-night';
      else if (main === 'Clear') theme = 'theme-sunny';
      else if (main === 'Rain' || main === 'Drizzle' || main === 'Thunderstorm') theme = 'theme-rainy';
      else if (main === 'Snow') theme = 'theme-snowy';
      else theme = 'theme-cloudy';
    }
    this.weatherState.theme = theme;
  }

  // ---------- template-ის დამხმარეები ----------

  formatTemp(temp: number) { return formatTemp(temp); }
  iconUrl(icon: string, size?: string) { return iconUrl(icon, size); }
  flagUrl(code: string) { return flagUrl(code); }
  weatherKey(id: number) { return owmToKey(id); }
  dayIndex(day: DayForecast) { return dateFromString(day.date).getUTCDay(); }
}

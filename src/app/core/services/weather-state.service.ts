import { Injectable } from '@angular/core';
import { City, WeatherForecast } from '../models/weather.model';

// აქ ვინახავთ მონაცემებს, რომლებიც გვერდებს შორის უნდა გადავიდეს
@Injectable({
  providedIn: 'root'
})
export class WeatherStateService {
  // ქალაქის გვერდზე დაბრუნებისას ბოლო ქალაქი და რეჟიმი რომ არ დაიკარგოს
  lastCity: City | null = null;
  darkMode = false;
  theme = 'theme-resorts';

  // არჩეული დღის საათობრივი პროგნოზი Detail გვერდისთვის
  dayHours: WeatherForecast[] = [];
  cityName = '';
  timezone = 0;

  saveDay(hours: WeatherForecast[], cityName: string, timezone: number) {
    this.dayHours = hours;
    this.cityName = cityName;
    this.timezone = timezone;
  }
}

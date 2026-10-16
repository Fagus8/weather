import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherStateService } from '../../core/services/weather-state.service';
import { WeatherForecast } from '../../core/models/weather.model';
import { formatTemp, formatTime, iconUrl, toLocalDate } from '../../core/utils/format';
import { owmToKey } from '../../core/utils/weather-codes';

// ქალაქის ერთი დღის საათობრივი პროგნოზი
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  hours: WeatherForecast[] = [];
  cityName = '';
  day = new Date();
  timezone = 0;

  constructor(
    private weatherState: WeatherStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // მონაცემების წამოღება სერვისიდან
    this.hours = this.weatherState.dayHours;
    this.cityName = this.weatherState.cityName;
    this.timezone = this.weatherState.timezone;

    // უსაფრთხოების შემოწმება: თუ მონაცემები არ არის (მაგალითად რეფრეშის დროს),
    // მომხმარებელი ავტომატურად ბრუნდება ქალაქის გვერდზე
    if (!this.hours || this.hours.length === 0) {
      this.backToCity();
      return;
    }

    this.day = toLocalDate(this.hours[0].dt, this.timezone);
  }

  backToCity(): void {
    this.router.navigate(['/city']);
  }

  formatTime(unixTime: number) { return formatTime(unixTime, this.timezone); }
  formatTemp(temp: number) { return formatTemp(temp); }
  iconUrl(icon: string) { return iconUrl(icon); }
  weatherKey(id: number) { return owmToKey(id); }
}

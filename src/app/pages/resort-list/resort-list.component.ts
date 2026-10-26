import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../core/services/weather.service';
import { WeatherStateService } from '../../core/services/weather-state.service';
import { Resort, ResortWeather } from '../../core/models/weather.model';
import { RESORTS } from '../../data/resorts';

@Component({
  selector: 'app-resort-list',
  templateUrl: './resort-list.component.html',
  styleUrls: ['./resort-list.component.css']
})
export class ResortListComponent implements OnInit {
  activeTab: 'all' | 'mountain' | 'sea' = 'all';
  mountainResorts: Resort[] = RESORTS.filter(r => r.type === 'mountain');
  seaResorts: Resort[] = RESORTS.filter(r => r.type === 'sea');

  // ამინდი და შეცდომები კურორტის id-ის მიხედვით, მაგ. weather['gudauri']
  weather: { [id: string]: ResortWeather } = {};
  failed: { [id: string]: boolean } = {};

  constructor(
    private weatherService: WeatherService,
    weatherState: WeatherStateService
  ) {
    // კურორტების გვერდს თავისი ფონი აქვს (constructor-ში ვაყენებთ, ngOnInit-ში Angular შეცდომას აგდებს)
    weatherState.theme = 'theme-resorts';
  }

  ngOnInit(): void {
    // თითო კურორტს ცალკე ვტვირთავთ, რომ ერთის შეცდომამ დანარჩენი ბარათები არ გააფუჭოს
    for (const resort of RESORTS) {
      this.weatherService.getResortWeather(resort).subscribe({
        next: data => this.weather[resort.id] = data,
        error: () => this.failed[resort.id] = true
      });
    }
  }
}

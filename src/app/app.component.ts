import { Component } from '@angular/core';
import { WeatherStateService } from './core/services/weather-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'skyresort';

  // public, რომ template-მა ფონის თემა (weatherState.theme) წაიკითხოს
  constructor(public weatherState: WeatherStateService) {}
}

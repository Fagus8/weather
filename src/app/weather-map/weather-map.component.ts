import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-weather-map',
  templateUrl: './weather-map.component.html',
  styleUrls: ['./weather-map.component.css']
})
export class WeatherMapComponent implements OnInit, OnChanges {
  map!: L.Map;
  @Input() lons: number = 0;
  @Input() lats: number = 0;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.map && this.lats !== 0 && this.lons !== 0) {
      this.map.setView([this.lats, this.lons], 11); // Set zoom to 11
    } else if (!this.map && this.lats !== 0 && this.lons !== 0) {
      this.initMap();
    }
  }

  private initMap(): void {
    if (!this.map) { // Check if the map has already been initialized
      this.map = L.map('map', {
        center: [this.lats, this.lons],
        zoom: 11 
      }); 

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
  
      // Replace 'YOUR_APP_ID' with your actual OpenWeatherMap API key
      L.tileLayer('http://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?date=1552861800&opacity=0.9&fill_bound=true&palette=0:FF0000;10:00FF00;20:0000FF&appid=c607623c986675b958ae21c1797edb6c', {
        attribution: '© OpenWeatherMap'
      }).addTo(this.map);
    }

  }
}

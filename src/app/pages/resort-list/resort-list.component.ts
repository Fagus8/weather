import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherService } from '../../core/services/weather.service';
import { WeatherStateService } from '../../core/services/weather-state.service';
import { City, MapPlace, Resort, ResortWeather } from '../../core/models/weather.model';
import { wmoToIcon } from '../../core/utils/weather-codes';
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

  // ძებნით ნაპოვნი ადგილი რუკისთვის
  mapPlace: MapPlace | null = null;
  private foundPlace: City | null = null;

  constructor(
    private weatherService: WeatherService,
    private router: Router,
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

  // ძებნაში ადგილი აირჩიეს → რუკაზე ვაჩვენებთ და მის ამინდს ვტვირთავთ
  onPlaceSelected(place: City) {
    this.foundPlace = place;
    this.mapPlace = { name: place.name, subtitle: place.region, lat: place.lat, lon: place.lon };

    this.weatherService.getPlaceWeather(place.lat, place.lon).subscribe({
      next: data => {
        // თუ ამასობაში სხვა ადგილი მოძებნეს, ძველ პასუხს აღარ ვიყენებთ
        if (this.foundPlace !== place) return;
        // ახალ ობიექტს ვქმნით, რომ რუკის ngOnChanges-მა ცვლილება დაინახოს
        this.mapPlace = { ...this.mapPlace!, temp: data.temp, icon: wmoToIcon(data.weatherCode, data.isDay) };
      },
      error: () => {
        if (this.foundPlace !== place) return;
        this.mapPlace = { ...this.mapPlace!, failed: true };
      }
    });
  }

  // "დეტალური პროგნოზი" → ქალაქის გვერდი
  openDetails() {
    const place = this.foundPlace;
    if (!place) return;
    this.router.navigate(['/city'], {
      queryParams: { name: place.name, region: place.region, country: place.country, code: place.countryCode, lat: place.lat, lon: place.lon }
    });
  }
}

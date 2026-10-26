import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { MapPlace } from '../../../core/models/weather.model';
import { formatTemp, iconUrl } from '../../../core/utils/format';
import { environment } from '../../../../environments/environment';

// მთელი საქართველო (სამხრეთ-დასავლეთი და ჩრდილო-აღმოსავლეთი კუთხეები)
const GEORGIA_BOUNDS: L.LatLngBoundsExpression = [[41.05, 40.0], [43.6, 46.75]];

// Leaflet-ის სტანდარტული მარკერის სურათები (src/assets/leaflet-ში დევს)
const markerIcon = L.icon({
  iconUrl: 'assets/leaflet/marker-icon.png',
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// რუკა ადგილის საჩვენებლად (OpenStreetMap, API key არ სჭირდება)
@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css']
})
export class LocationMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapBox') mapBox!: ElementRef;
  @Input() place: MapPlace | null = null;
  @Input() small = false;            // პატარა რუკა კურორტის გვერდზე
  @Input() temperatureLayer = false; // OpenWeatherMap-ის ტემპერატურის ფენა რუკაზე

  private map?: L.Map;
  private marker?: L.Marker;
  private langSub?: Subscription;

  constructor(private translate: TranslateService) {}

  // რუკას ვქმნით მხოლოდ მაშინ, როცა HTML უკვე გამოჩნდა გვერდზე
  ngAfterViewInit(): void {
    this.map = L.map(this.mapBox.nativeElement);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);

    // ტემპერატურის ფერადი ფენა OpenStreetMap-ის თავზე. OpenWeatherMap-ის ფილები დიდ ზუმზე
    // არ არსებობს, ამიტომ maxNativeZoom-ით Leaflet 9-ე ზუმის ფილებს ადიდებს
    if (this.temperatureLayer) {
      L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${environment.openWeatherApiKey}`, {
        attribution: '© OpenWeatherMap',
        maxNativeZoom: 9,
        maxZoom: 18,
        opacity: 0.8
      }).addTo(this.map);
    }

    if (this.place) {
      this.showPlace(false);
    } else {
      this.map.fitBounds(GEORGIA_BOUNDS);
    }

    // ენის შეცვლისას ფანჯრის ტექსტიც ითარგმნოს
    this.langSub = this.translate.onLangChange.subscribe(() => this.updatePopup());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map || !changes['place'] || !this.place) return;

    // ახალი ადგილი → რუკა იქ გადადის; იგივე ადგილი (მაგ. ამინდი ჩაიტვირთა) → მხოლოდ ფანჯარა ახლდება
    const old: MapPlace | null = changes['place'].previousValue;
    if (!old || old.lat !== this.place.lat || old.lon !== this.place.lon) {
      this.showPlace(true);
    } else {
      this.updatePopup();
    }
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.map?.remove();
  }

  private showPlace(animate: boolean) {
    if (!this.map || !this.place) return;
    const position: L.LatLngExpression = [this.place.lat, this.place.lon];

    // ძველი მარკერი იშლება, რომ რუკაზე ყოველთვის ერთი იყოს
    this.marker?.remove();
    this.marker = L.marker(position, { icon: markerIcon }).addTo(this.map);
    this.marker.bindPopup(this.createPopup());

    // ტემპერატურის რუკაზე ცოტა შორიდან ვუყურებთ, რომ ირგვლივ ტემპერატურაც ჩანდეს
    const zoom = this.temperatureLayer ? 9 : this.small ? 11 : 12;

    if (animate) {
      // გლუვი გადაფრენა; ფანჯარას ვხსნით, როცა რუკა გაჩერდება
      this.map.flyTo(position, zoom, { duration: 1.5 });
      this.map.once('moveend', () => this.marker?.openPopup());
    } else {
      this.map.setView(position, zoom);
    }
  }

  private updatePopup() {
    this.marker?.setPopupContent(this.createPopup());
  }

  // ფანჯრის HTML. ტექსტს textContent-ით ვწერთ, რომ API-დან მოსული სახელი HTML-ად არ წაიკითხოს
  private createPopup(): HTMLElement {
    const place = this.place!;
    const box = document.createElement('div');
    box.className = 'map-popup';

    const title = document.createElement('b');
    title.textContent = place.name;
    box.appendChild(title);

    if (place.subtitle) {
      const subtitle = document.createElement('div');
      subtitle.className = 'map-popup-subtitle';
      subtitle.textContent = place.subtitle;
      box.appendChild(subtitle);
    }

    const weather = document.createElement('div');
    weather.className = 'map-popup-weather';
    if (place.failed) {
      weather.textContent = this.translate.instant('STATUS.LOAD_ERROR');
    } else if (place.temp === undefined || !place.icon) {
      weather.textContent = this.translate.instant('STATUS.LOADING');
    } else {
      const img = document.createElement('img');
      img.src = iconUrl(place.icon);
      const temp = document.createElement('span');
      temp.textContent = formatTemp(place.temp);
      weather.append(img, temp);
    }
    box.appendChild(weather);

    return box;
  }
}

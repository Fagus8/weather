import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainService } from '../main.service';
import { CountryService } from '../country/country.component'; // დარწმუნდი რომ აქ დევს

// ინტერფეისები
interface WeatherForecast {
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

interface WeatherInfo {
  city: {
    name: string;
    coord?: { lat: number; lon: number };
    country?: string;
  };
  list: WeatherForecast[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  weatherInfo: WeatherInfo = { 
    city: { name: '', coord: undefined, country: undefined }, 
    list: [] 
  };
  
  country: string = "";
  language: string = 'en';
  mode: string = 'light-mode';
  
  dayArr: WeatherForecast[][] = [];
  obj: { min: number, max: number }[] = [];
  arrC: any[] = [];
  filteredCountries: any[] = [];

  constructor(
    private mainService: MainService, 
    private http: HttpClient, 
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    // ქვეყნების მონაცემების წამოღება
    this.countryService.fetchCountryData().subscribe({
      next: (data: any) => {
        this.arrC = data.data || data;
      },
      error: (err: any) => console.error('Error fetching countries:', err)
    });
  }

  liveSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm) {
      this.filteredCountries = this.arrC.filter((c: any) => 
        c.name.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredCountries = [];
    }
  }

  selectCountry(inputEl: HTMLInputElement) {
    this.country = inputEl.value;
    if (!this.country) return;

    const apiKey = 'c607623c986675b958ae21c1797edb6c';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.country}&lang=${this.language}&units=metric&appid=${apiKey}`;

    this.http.get<WeatherInfo>(url).subscribe({
      next: (data: WeatherInfo) => {
        this.weatherInfo = data;
        this.processForecast(data.list);
      },
      error: (err: any) => alert('City not found!')
    });
  }

  processForecast(list: WeatherForecast[]) {
    this.dayArr = [];
    this.obj = [];
    
    const uniqueDates = [...new Set(list.map(item => item.dt_txt.split(' ')[0]))].slice(0, 6);
    
    uniqueDates.forEach(date => {
      const dayData = list.filter(item => item.dt_txt.startsWith(date));
      this.dayArr.push(dayData);
      
      const temps = dayData.map(d => d.main.temp);
      this.obj.push({
        min: Math.round(Math.min(...temps)),
        max: Math.round(Math.max(...temps))
      });
    });
  }

  formatDates(dt_txt: string): string {
    const d = new Date(dt_txt);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  changeMode() {
    this.mode = this.mode === 'light-mode' ? 'dark-mode' : 'light-mode';
  }

  onTrClicked(index: string) {
    const idx = parseInt(index);
    if (this.dayArr[idx]) {
      this.mainService.storeNewObjData(this.dayArr[idx]);
    }
  }

  changeLanguages(event: any): void {
    this.language = event.target.value;
    const inputEl = document.getElementById('country') as HTMLInputElement;
    if (inputEl?.value) this.selectCountry(inputEl);
  }
}
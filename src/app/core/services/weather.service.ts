import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, retry } from 'rxjs';
import { environment } from '../../../environments/environment';
import { City, CurrentWeather, DailyForecast, HourForecast, Resort, ResortWeather, WeatherInfo } from '../models/weather.model';

// geocoding API ქართულ და რუსულ ასოებს ვერ ეძებს, ამიტომ ძებნამდე ლათინურად გადაგვყავს:
// "ბაკურიანი" → "bakuriani", "Бакуриани" → "bakuriani"
const letters: { [letter: string]: string } = {
  // ქართული
  'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z', 'თ': 't', 'ი': 'i',
  'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',
  'ტ': 't', 'უ': 'u', 'ფ': 'p', 'ქ': 'k', 'ღ': 'gh', 'ყ': 'q', 'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts',
  'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h',
  // რუსული
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z',
  'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
  'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
};

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) { }

  // ---------- ნებისმიერი ქალაქი (OpenWeatherMap) ----------

  getCurrentWeather(lat: number, lon: number): Observable<CurrentWeather> {
    const url = `${environment.openWeatherApiUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${environment.openWeatherApiKey}`;
    return this.http.get<CurrentWeather>(url);
  }

  getForecast(lat: number, lon: number): Observable<WeatherInfo> {
    const url = `${environment.openWeatherApiUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${environment.openWeatherApiKey}`;
    return this.http.get<WeatherInfo>(url);
  }

  // ადგილების ძებნა მხოლოდ საქართველოში (countryCode=GE).
  // Open-Meteo ka/en/ru ენებს უჭერს მხარს, ამიტომ სახელი არჩეულ ენაზე მოვა
  searchPlaces(text: string, lang: string): Observable<City[]> {
    const name = encodeURIComponent(this.toLatin(text));
    const url = `${environment.geocodingApiUrl}/search?name=${name}&count=6&language=${lang}&countryCode=GE`;

    // API-ს პასუხს ჩვენს City ფორმატში გადავაკეთებთ
    return this.http.get<any>(url).pipe(
      map(data => (data.results || []).map((item: any) => ({
        name: item.name,
        region: item.admin1 || '',
        country: item.country || '',
        countryCode: item.country_code || '',
        lat: item.latitude,
        lon: item.longitude
      })))
    );
  }

  private toLatin(text: string): string {
    // toLowerCase, რომ დიდი რუსული ასოებიც ("Б") იპოვოს
    return text.toLowerCase().split('').map(letter => letters[letter] ?? letter).join('');
  }

  // ---------- კურორტები და რუკა (Open-Meteo) ----------
  // OpenWeatherMap-ის უფასო ვერსია 7 დღის პროგნოზს, თოვლს და წყლის ტემპერატურას არ იძლევა,
  // ამიტომ კურორტებისთვის Open-Meteo-ს ვიყენებთ

  // ახლანდელი ამინდი კოორდინატებით (კურორტის ბარათი და რუკის ფანჯარა)
  getPlaceWeather(lat: number, lon: number): Observable<ResortWeather> {
    const url = `${environment.openMeteoApiUrl}/forecast?latitude=${lat}&longitude=${lon}`
      + '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day,wind_speed_10m,snow_depth'
      + '&daily=precipitation_sum&forecast_days=1&timezone=auto&wind_speed_unit=ms';

    return this.http.get<any>(url).pipe(
      retry(1), // ინტერნეტის მცირე შეფერხებისას ერთხელ კიდევ ვცდით
      map(data => ({
        temp: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day === 1,
        wind: data.current.wind_speed_10m,
        snowDepth: Math.round((data.current.snow_depth || 0) * 100), // მეტრი → სმ
        precipitation: data.daily.precipitation_sum[0] || 0,
        waterTemp: null as number | null
      }))
    );
  }

  getResortWeather(resort: Resort): Observable<ResortWeather> {
    const weather$ = this.getPlaceWeather(resort.lat, resort.lon);

    if (resort.type === 'mountain') {
      return weather$;
    }

    // ზღვის კურორტზე წყლის ტემპერატურასაც ვითხოვთ (Marine API).
    // თუ ის ვერ ჩაიტვირთა, ბარათი მაინც უნდა გამოჩნდეს, ამიტომ შეცდომისას null-ს ვაბრუნებთ
    const waterUrl = `${environment.marineApiUrl}/marine?latitude=${resort.lat}&longitude=${resort.lon}&current=sea_surface_temperature`;
    const water$ = this.http.get<any>(waterUrl).pipe(
      map(data => data.current.sea_surface_temperature as number | null),
      catchError(() => of(null))
    );

    return forkJoin({ weather: weather$, water: water$ }).pipe(
      map(result => ({ ...result.weather, waterTemp: result.water }))
    );
  }

  // დღევანდელი საათობრივი და 7 დღის პროგნოზი
  getResortForecast(resort: Resort): Observable<{ hours: HourForecast[], days: DailyForecast[] }> {
    const url = `${environment.openMeteoApiUrl}/forecast?latitude=${resort.lat}&longitude=${resort.lon}`
      + '&current=is_day'
      + '&hourly=temperature_2m,weather_code,is_day,wind_speed_10m'
      + '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum'
      + '&forecast_days=7&timezone=auto&wind_speed_unit=ms';

    return this.http.get<any>(url).pipe(
      retry(1), // ინტერნეტის მცირე შეფერხებისას ერთხელ კიდევ ვცდით
      map(data => {
        // timezone=auto-ს გამო დრო უკვე ადგილობრივია, მაგ. "2026-10-16T18:00"
        const today = data.daily.time[0];
        const nowHour = data.current.time.slice(0, 13); // "2026-10-16T18"

        const hours: HourForecast[] = [];
        data.hourly.time.forEach((time: string, i: number) => {
          // მხოლოდ დღევანდელი საათები, ახლანდელი საათიდან დაწყებული
          if (time.startsWith(today) && time.slice(0, 13) >= nowHour) {
            hours.push({
              time: time.slice(11, 16),
              temp: data.hourly.temperature_2m[i],
              weatherCode: data.hourly.weather_code[i],
              isDay: data.hourly.is_day[i] === 1,
              wind: data.hourly.wind_speed_10m[i]
            });
          }
        });

        const days: DailyForecast[] = data.daily.time.map((date: string, i: number) => ({
          date: date,
          min: data.daily.temperature_2m_min[i],
          max: data.daily.temperature_2m_max[i],
          weatherCode: data.daily.weather_code[i],
          precipitation: data.daily.precipitation_sum[i]
        }));

        return { hours, days };
      })
    );
  }
}

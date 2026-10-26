import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, retry, switchMap, throwError, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { City, CurrentWeather, DailyForecast, HourForecast, Language, PlaceForecast, Resort, ResortWeather, WeatherInfo, WikiSummary } from '../models/weather.model';
import { RESORTS } from '../../data/resorts';

// სახელების შესადარებლად ყველა ენიდან ლათინურად გადაგვყავს (კურორტების ძებნა, დუბლიკატები):
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

// საქართველოს საზღვრები Photon-ისთვის: დასავლეთი,სამხრეთი,აღმოსავლეთი,ჩრდილოეთი
const GEORGIA_BBOX = '40.0,41.05,46.75,43.6';

// OpenStreetMap-ის place ტიპები, რომლებიც ძებნაში გვინდა (რეგიონები და მუნიციპალიტეტები არა)
const PLACE_TYPES = ['city', 'town', 'village', 'hamlet', 'suburb', 'neighbourhood', 'quarter', 'locality', 'isolated_dwelling'];

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

  // ადგილების ძებნა მთელ მსოფლიოში. Open-Meteo სახელს language-ში მითითებულ ენაზე ეძებს
  // (+ ლათინურად): "Берлин" მხოლოდ language=ru-თი იძებნება, "პარიზი" - language=ka-თი.
  // ამიტომ ენას ჩაწერილი ასოებით ვირჩევთ, ლათინურზე კი ინტერფეისის ენას ვტოვებთ.
  // სახელი იმავე ენაზე მოდის, მაგ. ქართულ ინტერფეისზე "London" → "ლონდონი"
  searchPlaces(text: string, lang: string): Observable<City[]> {
    const searchLang = /[ა-ჰ]/.test(text) ? 'ka' : /[а-яё]/i.test(text) ? 'ru' : lang;
    const url = `${environment.geocodingApiUrl}/search?name=${encodeURIComponent(text)}&count=10&language=${searchLang}`;

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

  // საქართველოს სოფლებისთვის: Photon (OpenStreetMap) სიტყვის დასაწყისითაც პოულობს ("წყნ" → წყნეთი)
  // და ბევრ ქართულ სოფელს იცნობს, რომელიც Open-Meteo-ში არ არის. მსოფლიოსთვის არ გამოგვადგა:
  // მახლობელ სოფლებს ანიჭებს უპირატესობას ("Берлин" → სოფელი უკრაინაში), ამიტომ მხოლოდ საქართველოშია.
  // ენებიდან მხოლოდ ინგლისურს იცნობს; lang=default-ით სახელი ქართულად მოდის
  // (მის გარეშე ბრაუზერის ენას იყენებს და ქართულ საიტზე ინგლისურ სახელებს აბრუნებს)
  searchOsmPlaces(text: string, lang: string): Observable<City[]> {
    const url = `${environment.photonApiUrl}/?q=${encodeURIComponent(text)}&limit=15&osm_tag=place`
      + `&bbox=${GEORGIA_BBOX}&lang=${lang === 'en' ? 'en' : 'default'}`;
    const query = this.searchKey(text);

    return this.http.get<any>(url).pipe(
      map(data => (data.features || [])
        .filter((item: any) => item.properties.countrycode === 'GE' && PLACE_TYPES.includes(item.properties.osm_value))
        // Photon მსგავს სახელებსაც აბრუნებს ("Kutaisi" → Kumisi), ასეთებს ვტოვებთ გარეთ
        .filter((item: any) => this.searchKey(item.properties.name || '').includes(query))
        .map((item: any) => ({
          name: item.properties.name,
          region: item.properties.state || item.properties.county || '',
          country: item.properties.country || '',
          countryCode: 'GE',
          lat: item.geometry.coordinates[1],
          lon: item.geometry.coordinates[0]
        })))
    );
  }

  // ჩვენი სიის კურორტები, რომელთა სახელიც (ნებისმიერ ენაზე) ტექსტს შეიცავს
  findResorts(text: string, lang: string): City[] {
    const query = this.toLatin(text.trim());
    if (query.length < 2) return [];

    const language = (['ka', 'en', 'ru'].includes(lang) ? lang : 'ka') as Language;
    return RESORTS
      .filter(resort => Object.values(resort.name).some(name => this.toLatin(name).includes(query)))
      .map(resort => ({
        name: resort.name[language],
        region: resort.region[language],
        country: '',
        countryCode: 'GE',
        lat: resort.lat,
        lon: resort.lon,
        resortId: resort.id
      }));
  }

  // ლაივ სერჩი: ჯერ ჩვენი კურორტები, მერე საქართველოს ადგილები, მერე დანარჩენი მსოფლიო
  searchAll(text: string, lang: string): Observable<City[]> {
    const resorts = this.findResorts(text, lang);
    // თითო API-ს შეცდომა (ან 6 წამზე მეტი ლოდინი) null-ად გადავაქციოთ, რომ მეორის შედეგი არ დაიკარგოს
    const osm$ = this.searchOsmPlaces(text, lang).pipe(timeout(6000), catchError(() => of(null)));
    const openMeteo$ = this.searchPlaces(text, lang).pipe(timeout(6000), catchError(() => of(null)));

    return forkJoin([osm$, openMeteo$]).pipe(
      switchMap(([osm, openMeteo]) => {
        if (osm === null && openMeteo === null && resorts.length === 0) {
          return throwError(() => new Error('search failed'));
        }
        // ერთი და იგივე ადგილი ორჯერ რომ არ გამოჩნდეს (ორივე API-დან ან კურორტადაც).
        // სახელებს searchKey-ით ვადარებთ, რომ "Sighnaghi" და "სიღნაღი" ერთად ჩაითვალოს
        // Photon რუსულ სახელებს არ იძლევა, ამიტომ რუსულ ინტერფეისზე Open-Meteo-ს შედეგები წინ არის
        const places = lang === 'ru' ? [...(openMeteo || []), ...(osm || [])] : [...(osm || []), ...(openMeteo || [])];
        const result: City[] = [...resorts];
        for (const place of places) {
          const duplicate = result.some(other =>
            Math.abs(other.lat - place.lat) < 0.05 && Math.abs(other.lon - place.lon) < 0.05
            && (!!other.resortId || this.searchKey(other.name) === this.searchKey(place.name)));
          if (!duplicate) result.push(place);
        }
        // საქართველოს ადგილები წინ, საზღვარგარეთის - უკან (თითო ჯგუფში API-ს რიგი რჩება)
        const georgian = result.filter(place => place.resortId || place.countryCode === 'GE');
        const foreign = result.filter(place => !place.resortId && place.countryCode !== 'GE');
        return of([...georgian, ...foreign].slice(0, 10));
      })
    );
  }

  // სახელების შესადარებლად: ლათინურად და იმ ასოების გარეშე, რომლებსაც სხვადასხვანაირად წერენ
  // ("ყ" → q თუ k, "ღ" → gh თუ g, აპოსტროფები "Ts’q’net’i"-ში). "წყნეთი" და "Tskneti" → "tskneti"
  private searchKey(text: string): string {
    return this.toLatin(text)
      .replace(/['’ʼ`]/g, '')
      .replace(/q/g, 'k')
      .replace(/kh/g, 'k')
      .replace(/gh/g, 'g');
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
  getResortForecast(resort: Resort): Observable<PlaceForecast> {
    return this.getPlaceForecast(resort.lat, resort.lon);
  }

  // იგივე ნებისმიერი ადგილისთვის კოორდინატებით (ძებნით ნაპოვნი ადგილის გვერდი)
  getPlaceForecast(lat: number, lon: number): Observable<PlaceForecast> {
    const url = `${environment.openMeteoApiUrl}/forecast?latitude=${lat}&longitude=${lon}`
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

        return { hours, days, elevation: Math.round(data.elevation) };
      })
    );
  }

  // ---------- ადგილის აღწერა (Wikipedia) ----------

  // სტატიის მოკლე აღწერა არჩეულ ენაზე. თუ ასეთი სტატია არ არის, ინგლისურ Wikipedia-ში
  // ადგილის კოორდინატებთან ახლოს მდებარე სტატიას ვეძებთ, რომლის სახელიც ემთხვევა.
  // ვერაფერი ვიპოვეთ → null (გვერდი აღწერის ბლოკს უბრალოდ არ აჩვენებს)
  getPlaceSummary(name: string, lat: number, lon: number, lang: string): Observable<WikiSummary | null> {
    // ჯერ იგივე სახელით (ლათინური სახელები, მაგ. "London"), მერე კოორდინატებით
    const nearby$ = this.findEnglishTitle(name, lat, lon).pipe(
      switchMap(title => title ? this.getWikiSummary(title, 'en', lat, lon) : of(null))
    );
    const fromEnglish$ = lang === 'en' ? nearby$ : this.getWikiSummary(name, 'en', lat, lon).pipe(
      switchMap(summary => summary ? of(summary) : nearby$)
    );

    // სახელი სხვა ენაზეა, ვიდრე ინტერფეისი (მაგ. ქართულ საიტზე "Нью-Йорк"): იმ ენის სტატიიდან
    // ვიგებთ, რა ჰქვია სტატიას ჩვენს ენაზე ("Нью-Йорк" → "ნიუ-იორკი")
    const nameLang = /[ა-ჰ]/.test(name) ? 'ka' : /[а-яё]/i.test(name) ? 'ru' : null;
    const translated$ = !nameLang || nameLang === lang ? fromEnglish$ : this.translateTitle(name, nameLang, lang).pipe(
      switchMap(title => title ? this.getWikiSummary(title, lang, lat, lon) : of(null)),
      switchMap(summary => summary ? of(summary) : fromEnglish$)
    );

    return this.getWikiSummary(name, lang, lat, lon).pipe(
      switchMap(summary => summary ? of(summary) : translated$),
      catchError(() => of(null))
    );
  }

  // სტატიის სახელი სხვა ენის Wikipedia-ში (ენათაშორისი ბმულით)
  private translateTitle(title: string, fromLang: string, toLang: string): Observable<string | null> {
    const url = `https://${fromLang}.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1`
      + `&prop=langlinks&lllang=${toLang}&titles=${encodeURIComponent(title)}`;

    return this.http.get<any>(url).pipe(
      map(data => {
        const page: any = Object.values(data.query?.pages || {})[0];
        return page?.langlinks?.[0]?.['*'] ?? null;
      }),
      catchError(() => of(null))
    );
  }

  private getWikiSummary(title: string, lang: string, lat: number, lon: number): Observable<WikiSummary | null> {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

    return this.http.get<any>(url).pipe(
      map(data => {
        // გაურკვეველი სახელის გვერდი ("X შეიძლება ნიშნავდეს...") აღწერა არ არის
        if (data.type !== 'standard' || !data.extract) return null;
        // იგივე სახელის სხვა ადგილი (მაგ. სხვა ქვეყანაში) რომ არ ვაჩვენოთ
        if (data.coordinates && (Math.abs(data.coordinates.lat - lat) > 0.3 || Math.abs(data.coordinates.lon - lon) > 0.3)) {
          return null;
        }
        return {
          title: data.title,
          text: data.extract,
          image: data.thumbnail?.source,
          url: data.content_urls.desktop.page
        };
      }),
      catchError(() => of(null)) // 404 - ასეთი სტატია არ არსებობს
    );
  }

  // ინგლისური სტატიის სახელი: ადგილის გარშემო 10 კმ-ში არსებული სტატიებიდან ის, რომლის
  // სახელიც ჩვენს სახელს ემთხვევა ("წყნეთი" → "Tskneti")
  private findEnglishTitle(name: string, lat: number, lon: number): Observable<string | null> {
    const url = 'https://en.wikipedia.org/w/api.php?action=query&list=geosearch&format=json&origin=*'
      + `&gscoord=${lat}|${lon}&gsradius=10000&gslimit=50`;
    const key = this.searchKey(name);

    return this.http.get<any>(url).pipe(
      map(data => {
        const pages: any[] = data.query?.geosearch || [];
        const page = pages.find(p => this.searchKey(p.title.split(',')[0]) === key);
        return page ? page.title as string : null;
      }),
      catchError(() => of(null))
    );
  }
}

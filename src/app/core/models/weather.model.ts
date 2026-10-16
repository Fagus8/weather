// ერთი 3-საათიანი ჩანაწერი /forecast პასუხიდან
export interface WeatherForecast {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

// /forecast პასუხი
export interface WeatherInfo {
  city: {
    name: string;
    country: string;
    timezone: number;
  };
  list: WeatherForecast[];
}

// /weather პასუხი (მიმდინარე ამინდი)
export interface CurrentWeather {
  dt: number;
  timezone: number; // UTC-დან განსხვავება წამებში
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

// ქალაქი ძებნის სიიდან
export interface City {
  name: string;
  region: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
}

// ერთი დღე პროგნოზის ბარათებისთვის
export interface DayForecast {
  date: string; // "2026-10-16"
  hours: WeatherForecast[];
  min: number;
  max: number;
  icon: string;
}

// ---------- კურორტები ----------

export type Language = 'ka' | 'en' | 'ru';

// ტექსტი სამ ენაზე, მაგ. { ka: 'გუდაური', en: 'Gudauri', ru: 'Гудаури' }
export interface Translated {
  ka: string;
  en: string;
  ru: string;
}

export interface Resort {
  id: string;
  type: 'mountain' | 'sea';
  name: Translated;
  region: Translated;
  lat: number;
  lon: number;
  elevation: number;
  description: Translated;
}

// კურორტის ახლანდელი ამინდი (Open-Meteo-დან)
export interface ResortWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  weatherCode: number;
  isDay: boolean;
  wind: number;
  snowDepth: number;          // სმ
  precipitation: number;      // დღევანდელი ნალექი, მმ
  waterTemp: number | null;   // მხოლოდ ზღვის კურორტებზე
}

// ადგილი რუკაზე. temp და icon ცარიელია, სანამ ამინდი ჩაიტვირთება
export interface MapPlace {
  name: string;
  subtitle?: string;  // მაგ. რეგიონი
  lat: number;
  lon: number;
  temp?: number;
  icon?: string;      // OpenWeatherMap-ის აიქონის კოდი, მაგ. "04d"
  failed?: boolean;
}

export interface HourForecast {
  time: string; // "18:00"
  temp: number;
  weatherCode: number;
  isDay: boolean;
  wind: number;
}

export interface DailyForecast {
  date: string; // "2026-10-16"
  min: number;
  max: number;
  weatherCode: number;
  precipitation: number;
}

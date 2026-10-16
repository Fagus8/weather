// ამინდის აღწერები ჩვენივე JSON ფაილებიდან ითარგმნება (WEATHER.clear, WEATHER.rain ...),
// რადგან OpenWeatherMap ქართულ ენას არ უჭერს მხარს, Open-Meteo კი ტექსტს საერთოდ არ აბრუნებს, მხოლოდ კოდს.

// Open-Meteo-ს (WMO) კოდი → ჩვენი გასაღები
export function wmoToKey(code: number): string {
  if (code === 0) return 'clear';
  if (code === 1) return 'mainlyClear';
  if (code === 2) return 'partlyCloudy';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'showers';
  if (code === 85 || code === 86) return 'snowShowers';
  return 'thunderstorm'; // 95-99
}

// OpenWeatherMap-ის id → იგივე გასაღებები
export function owmToKey(id: number): string {
  if (id >= 200 && id < 300) return 'thunderstorm';
  if (id >= 300 && id < 400) return 'drizzle';
  if (id >= 500 && id < 520) return 'rain';
  if (id >= 520 && id < 600) return 'showers';
  if (id >= 600 && id < 700) return 'snow';
  if (id >= 700 && id < 800) return 'fog';
  if (id === 800) return 'clear';
  if (id === 801) return 'mainlyClear';
  if (id === 802) return 'partlyCloudy';
  return 'overcast';
}

// Open-Meteo-ს კოდისთვის OpenWeatherMap-ის აიქონს ვიყენებთ (მაგ. "10d")
const icons: { [key: string]: string } = {
  clear: '01', mainlyClear: '02', partlyCloudy: '03', overcast: '04', fog: '50',
  drizzle: '09', rain: '10', showers: '09', snow: '13', snowShowers: '13', thunderstorm: '11'
};

export function wmoToIcon(code: number, isDay: boolean): string {
  return icons[wmoToKey(code)] + (isDay ? 'd' : 'n');
}

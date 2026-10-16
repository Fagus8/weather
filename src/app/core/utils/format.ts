// კვირის დღეები და თვეები assets/i18n/*.json-შია (DAYS, DAYS_SHORT, MONTHS),
// აქ მხოლოდ რიცხვებს და დროს ვამზადებთ.

// API დროს UTC-ში აბრუნებს, ამიტომ ქალაქის timezone-ს (წამებში) ვუმატებთ.
// შემდეგ თარიღიდან ყოველთვის getUTC...() ფუნქციებით ვკითხულობთ, რომ ბრაუზერმა თავისი სარტყელი არ დაუმატოს.
export function toLocalDate(unixTime: number, timezone: number): Date {
  return new Date((unixTime + timezone) * 1000);
}

// მაგ. "09:00" (padStart ერთნიშნა რიცხვს წინ 0-ს უმატებს)
export function formatTime(unixTime: number, timezone: number): string {
  const d = toLocalDate(unixTime, timezone);
  return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
}

// "2026-10-16" → Date (შუადღე UTC-ით, რომ დღე არ აირიოს)
export function dateFromString(date: string): Date {
  return new Date(date + 'T12:00:00Z');
}

export function formatTemp(temp: number): string {
  // Math.round(-0.4) არის -0, ამიტომ "|| 0" ვწერთ, რომ "-0°" არ გამოჩნდეს
  return (Math.round(temp) || 0) + '°';
}

export function iconUrl(icon: string, size: string = '2x'): string {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
}

// დროშის სურათი (Windows-ზე დროშის emoji არ ჩანს, ამიტომ სურათს ვიყენებთ)
export function flagUrl(countryCode: string): string {
  return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
}

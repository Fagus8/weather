import { owmToKey, wmoToIcon, wmoToKey } from './weather-codes';

describe('weather codes', () => {
  it('should map Open-Meteo codes to translation keys', () => {
    expect(wmoToKey(0)).toBe('clear');
    expect(wmoToKey(63)).toBe('rain');
    expect(wmoToKey(75)).toBe('snow');
  });

  it('should map OpenWeatherMap ids to the same keys', () => {
    expect(owmToKey(800)).toBe('clear');
    expect(owmToKey(501)).toBe('rain');
    expect(owmToKey(804)).toBe('overcast');
  });

  it('should pick a night icon', () => {
    expect(wmoToIcon(0, false)).toBe('01n');
  });
});

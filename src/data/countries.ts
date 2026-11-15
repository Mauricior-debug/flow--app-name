export type Country = { name: string; flag: string };

export const STUDY_COUNTRIES: Country[] = [
  { name: 'United States', flag: '🇺🇸' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Belgium', flag: '🇧🇪' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'Czechia', flag: '🇨🇿' },
  { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'Hong Kong', flag: '🇭🇰' },
  { name: 'Hungary', flag: '🇭🇺' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Malaysia', flag: '🇲🇾' },
  { name: 'Mexico', flag: '🇲🇽' },
  { name: 'New Zealand', flag: '🇳🇿' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'South Africa', flag: '🇿🇦' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'Taiwan', flag: '🇹🇼' },
  { name: 'Turkey', flag: '🇹🇷' },
];

const ORIGINS: Country[] = [
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'Ghana', flag: '🇬🇭' },
  { name: 'Kenya', flag: '🇰🇪' },
  { name: 'South Africa', flag: '🇿🇦' },
  { name: 'Egypt', flag: '🇪🇬' },
  { name: 'Ethiopia', flag: '🇪🇹' },
  { name: 'Morocco', flag: '🇲🇦' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Pakistan', flag: '🇵🇰' },
  { name: 'Bangladesh', flag: '🇧🇩' },
  { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Philippines', flag: '🇵🇭' },
  { name: 'Vietnam', flag: '🇻🇳' },
  { name: 'Nepal', flag: '🇳🇵' },
  { name: 'Sri Lanka', flag: '🇱🇰' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Colombia', flag: '🇨🇴' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Chile', flag: '🇨🇱' },
  { name: 'Peru', flag: '🇵🇪' },
  { name: 'Ukraine', flag: '🇺🇦' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Romania', flag: '🇷🇴' },
];

const merged = new Map<string, Country>();
for (const country of [...STUDY_COUNTRIES, ...ORIGINS]) merged.set(country.name, country);

export const NATIONALITIES: Country[] = [...merged.values()].sort((a, b) => a.name.localeCompare(b.name));

export function flagFor(name: string) {
  return merged.get(name)?.flag ?? '🏳️';
}

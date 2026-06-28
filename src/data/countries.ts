import { Country } from '../types';

export const COUNTRIES: Country[] = [
  // Afrika
  { id: 'EG', name: 'Mısır', flag: '🇪🇬', continent: 'africa', namePoolRegion: 'arabic', leagues: [
    { id: 'eg-1', name: 'Egyptian Premier League', tier: 1, teamCount: 18 },
  ]},
  { id: 'ZA', name: 'Güney Afrika', flag: '🇿🇦', continent: 'africa', namePoolRegion: 'anglo', leagues: [
    { id: 'za-1', name: 'South African Premier Division', tier: 1, teamCount: 16 },
  ]},

  // Okyanusya
  { id: 'AU', name: 'Avustralya', flag: '🇦🇺', continent: 'oceania', namePoolRegion: 'anglo', leagues: [
    { id: 'au-1', name: 'A-League', tier: 1, teamCount: 12 },
  ]},

  // Asya
  { id: 'CN', name: 'Çin', flag: '🇨🇳', continent: 'asia', namePoolRegion: 'eastAsian', leagues: [
    { id: 'cn-1', name: 'Chinese Super League', tier: 1, teamCount: 18 },
  ]},
  { id: 'HK', name: 'Hong Kong', flag: '🇭🇰', continent: 'asia', namePoolRegion: 'eastAsian', leagues: [
    { id: 'hk-1', name: 'Hong Kong Premier League', tier: 1, teamCount: 10 },
  ]},
  { id: 'IN', name: 'Hindistan', flag: '🇮🇳', continent: 'asia', namePoolRegion: 'southAsian', leagues: [
    { id: 'in-1', name: 'Indian Super League', tier: 1, teamCount: 12 },
  ]},
  { id: 'ID', name: 'Endonezya', flag: '🇮🇩', continent: 'asia', namePoolRegion: 'southeastAsian', leagues: [
    { id: 'id-1', name: 'Liga 1', tier: 1, teamCount: 18 },
  ]},
  { id: 'JP', name: 'Japonya', flag: '🇯🇵', continent: 'asia', namePoolRegion: 'eastAsian', leagues: [
    { id: 'jp-1', name: 'J1 League', tier: 1, teamCount: 18 },
  ]},
  { id: 'MY', name: 'Malezya', flag: '🇲🇾', continent: 'asia', namePoolRegion: 'southeastAsian', leagues: [
    { id: 'my-1', name: 'Malaysian Super League', tier: 1, teamCount: 14 },
  ]},
  { id: 'SG', name: 'Singapur', flag: '🇸🇬', continent: 'asia', namePoolRegion: 'southeastAsian', leagues: [
    { id: 'sg-1', name: 'Singapore Premier League', tier: 1, teamCount: 8 },
  ]},
  { id: 'KR', name: 'Güney Kore', flag: '🇰🇷', continent: 'asia', namePoolRegion: 'eastAsian', leagues: [
    { id: 'kr-1', name: 'K League 1', tier: 1, teamCount: 12 },
  ]},
  { id: 'AE', name: 'BAE', flag: '🇦🇪', continent: 'asia', namePoolRegion: 'arabic', leagues: [
    { id: 'ae-1', name: 'UAE Pro League', tier: 1, teamCount: 14 },
  ]},

  // Avrupa
  { id: 'AT', name: 'Avusturya', flag: '🇦🇹', continent: 'europe', namePoolRegion: 'germanic', leagues: [
    { id: 'at-1', name: 'Austrian Bundesliga', tier: 1, teamCount: 12 },
  ]},
  { id: 'BY', name: 'Belarus', flag: '🇧🇾', continent: 'europe', namePoolRegion: 'slavicEast', leagues: [
    { id: 'by-1', name: 'Belarusian Premier League', tier: 1, teamCount: 16 },
  ]},
  { id: 'BE', name: 'Belçika', flag: '🇧🇪', continent: 'europe', namePoolRegion: 'dutch', leagues: [
    { id: 'be-1', name: 'Belgian Pro League', tier: 1, teamCount: 18 },
  ]},
  { id: 'BG', name: 'Bulgaristan', flag: '🇧🇬', continent: 'europe', namePoolRegion: 'slavicSouth', leagues: [
    { id: 'bg-1', name: 'Bulgarian First League', tier: 1, teamCount: 16 },
  ]},
  { id: 'HR', name: 'Hırvatistan', flag: '🇭🇷', continent: 'europe', namePoolRegion: 'slavicSouth', leagues: [
    { id: 'hr-1', name: 'Croatian First League', tier: 1, teamCount: 10 },
  ]},
  { id: 'CZ', name: 'Çekya', flag: '🇨🇿', continent: 'europe', namePoolRegion: 'slavicWest', leagues: [
    { id: 'cz-1', name: 'Czech First League', tier: 1, teamCount: 16 },
  ]},
  { id: 'DK', name: 'Danimarka', flag: '🇩🇰', continent: 'europe', namePoolRegion: 'nordic', leagues: [
    { id: 'dk-1', name: 'Danish Superliga', tier: 1, teamCount: 12 },
  ]},
  { id: 'EN', name: 'İngiltere', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', continent: 'europe', namePoolRegion: 'anglo', leagues: [
    { id: 'en-1', name: 'Premier League', tier: 1, teamCount: 20 },
    { id: 'en-2', name: 'Championship', tier: 2, teamCount: 24 },
    { id: 'en-3', name: 'League One', tier: 3, teamCount: 24 },
    { id: 'en-4', name: 'League Two', tier: 4, teamCount: 24 },
  ]},
  { id: 'FI', name: 'Finlandiya', flag: '🇫🇮', continent: 'europe', namePoolRegion: 'nordic', leagues: [
    { id: 'fi-1', name: 'Veikkausliiga', tier: 1, teamCount: 12 },
  ]},
  { id: 'FR', name: 'Fransa', flag: '🇫🇷', continent: 'europe', namePoolRegion: 'french', leagues: [
    { id: 'fr-1', name: 'Ligue 1', tier: 1, teamCount: 18 },
    { id: 'fr-2', name: 'Ligue 2', tier: 2, teamCount: 20 },
    { id: 'fr-3', name: 'French National', tier: 3, teamCount: 18 },
  ]},
  { id: 'DE', name: 'Almanya', flag: '🇩🇪', continent: 'europe', namePoolRegion: 'germanic', leagues: [
    { id: 'de-1', name: 'Bundesliga', tier: 1, teamCount: 18 },
  ]},
  { id: 'GI', name: 'Cebelitarık', flag: '🇬🇮', continent: 'europe', namePoolRegion: 'anglo', leagues: [
    { id: 'gi-1', name: 'Gibraltar National League', tier: 1, teamCount: 8 },
  ]},
  { id: 'GR', name: 'Yunanistan', flag: '🇬🇷', continent: 'europe', namePoolRegion: 'greek', leagues: [
    { id: 'gr-1', name: 'Greek Super League', tier: 1, teamCount: 14 },
  ]},
  { id: 'HU', name: 'Macaristan', flag: '🇭🇺', continent: 'europe', namePoolRegion: 'hungarian', leagues: [
    { id: 'hu-1', name: 'Hungarian NB I', tier: 1, teamCount: 12 },
  ]},
  { id: 'IS', name: 'İzlanda', flag: '🇮🇸', continent: 'europe', namePoolRegion: 'nordic', leagues: [
    { id: 'is-1', name: 'Icelandic Premier Division', tier: 1, teamCount: 12 },
  ]},
  { id: 'IE', name: 'İrlanda', flag: '🇮🇪', continent: 'europe', namePoolRegion: 'anglo', leagues: [
    { id: 'ie-1', name: 'League of Ireland Premier', tier: 1, teamCount: 10 },
  ]},
  { id: 'IL', name: 'İsrail', flag: '🇮🇱', continent: 'europe', namePoolRegion: 'arabic', leagues: [
    { id: 'il-1', name: 'Israeli Premier League', tier: 1, teamCount: 14 },
  ]},
  { id: 'IT', name: 'İtalya', flag: '🇮🇹', continent: 'europe', namePoolRegion: 'italian', leagues: [
    { id: 'it-1', name: 'Serie A', tier: 1, teamCount: 20 },
    { id: 'it-2', name: 'Serie B', tier: 2, teamCount: 20 },
    { id: 'it-3', name: 'Serie C', tier: 3, teamCount: 20 },
  ]},
  { id: 'LV', name: 'Letonya', flag: '🇱🇻', continent: 'europe', namePoolRegion: 'balticFinnic', leagues: [
    { id: 'lv-1', name: 'Latvian Higher League', tier: 1, teamCount: 10 },
  ]},
  { id: 'LT', name: 'Litvanya', flag: '🇱🇹', continent: 'europe', namePoolRegion: 'balticFinnic', leagues: [
    { id: 'lt-1', name: 'Lithuanian A Lyga', tier: 1, teamCount: 10 },
  ]},
  { id: 'NIR', name: 'Kuzey İrlanda', flag: '🏴', continent: 'europe', namePoolRegion: 'anglo', leagues: [
    { id: 'nir-1', name: 'NIFL Premiership', tier: 1, teamCount: 12 },
  ]},
  { id: 'NL', name: 'Hollanda', flag: '🇳🇱', continent: 'europe', namePoolRegion: 'dutch', leagues: [
    { id: 'nl-1', name: 'Eredivisie', tier: 1, teamCount: 18 },
  ]},
  { id: 'NO', name: 'Norveç', flag: '🇳🇴', continent: 'europe', namePoolRegion: 'nordic', leagues: [
    { id: 'no-1', name: 'Eliteserien', tier: 1, teamCount: 16 },
  ]},
  { id: 'PL', name: 'Polonya', flag: '🇵🇱', continent: 'europe', namePoolRegion: 'slavicWest', leagues: [
    { id: 'pl-1', name: 'Polish Ekstraklasa', tier: 1, teamCount: 18 },
  ]},
  { id: 'PT', name: 'Portekiz', flag: '🇵🇹', continent: 'europe', namePoolRegion: 'lusophone', leagues: [
    { id: 'pt-1', name: 'Portuguese Premier League', tier: 1, teamCount: 18 },
    { id: 'pt-2', name: 'Portuguese Second League', tier: 2, teamCount: 18 },
    { id: 'pt-3', name: 'Portuguese Third Division', tier: 3, teamCount: 18 },
    { id: 'pt-4', name: 'Portugal Championship', tier: 4, teamCount: 18 },
  ]},
  { id: 'RO', name: 'Romanya', flag: '🇷🇴', continent: 'europe', namePoolRegion: 'slavicSouth', leagues: [
    { id: 'ro-1', name: 'Romanian Liga I', tier: 1, teamCount: 16 },
  ]},
  { id: 'RU', name: 'Rusya', flag: '🇷🇺', continent: 'europe', namePoolRegion: 'slavicEast', leagues: [
    { id: 'ru-1', name: 'Russian Premier League', tier: 1, teamCount: 16 },
  ]},
  { id: 'SC', name: 'İskoçya', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', continent: 'europe', namePoolRegion: 'anglo', leagues: [
    { id: 'sc-1', name: 'Scottish Premiership', tier: 1, teamCount: 12 },
  ]},
  { id: 'RS', name: 'Sırbistan', flag: '🇷🇸', continent: 'europe', namePoolRegion: 'slavicSouth', leagues: [
    { id: 'rs-1', name: 'Serbian SuperLiga', tier: 1, teamCount: 16 },
  ]},
  { id: 'SK', name: 'Slovakya', flag: '🇸🇰', continent: 'europe', namePoolRegion: 'slavicWest', leagues: [
    { id: 'sk-1', name: 'Slovak Super Liga', tier: 1, teamCount: 12 },
  ]},
  { id: 'SI', name: 'Slovenya', flag: '🇸🇮', continent: 'europe', namePoolRegion: 'slavicSouth', leagues: [
    { id: 'si-1', name: 'Slovenian PrvaLiga', tier: 1, teamCount: 10 },
  ]},
  { id: 'ES', name: 'İspanya', flag: '🇪🇸', continent: 'europe', namePoolRegion: 'hispanic', leagues: [
    { id: 'es-1', name: 'Spanish First Division', tier: 1, teamCount: 20 },
    { id: 'es-2', name: 'Spanish Second Division', tier: 2, teamCount: 22 },
    { id: 'es-3', name: 'Spanish Federation First Division', tier: 3, teamCount: 20 },
    { id: 'es-4', name: 'Spanish Federation Second Division', tier: 4, teamCount: 20 },
  ]},
  { id: 'SE', name: 'İsveç', flag: '🇸🇪', continent: 'europe', namePoolRegion: 'nordic', leagues: [
    { id: 'se-1', name: 'Allsvenskan', tier: 1, teamCount: 16 },
  ]},
  { id: 'CH', name: 'İsviçre', flag: '🇨🇭', continent: 'europe', namePoolRegion: 'germanic', leagues: [
    { id: 'ch-1', name: 'Swiss Super League', tier: 1, teamCount: 12 },
  ]},
  { id: 'TR', name: 'Türkiye', flag: '🇹🇷', continent: 'europe', namePoolRegion: 'turkic', leagues: [
    { id: 'super-lig', name: 'Trendyol Süper Lig', tier: 1, teamCount: 17 },
    { id: '1-lig', name: 'TFF 1. Lig', tier: 2, teamCount: 18 },
    { id: 'tr-3', name: 'TFF 2. Lig', tier: 3, teamCount: 18 },
  ]},
  { id: 'UA', name: 'Ukrayna', flag: '🇺🇦', continent: 'europe', namePoolRegion: 'slavicEast', leagues: [
    { id: 'ua-1', name: 'Ukrainian Premier League', tier: 1, teamCount: 16 },
  ]},
  { id: 'WA', name: 'Galler', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', continent: 'europe', namePoolRegion: 'anglo', leagues: [
    { id: 'wa-1', name: 'Welsh Premier League', tier: 1, teamCount: 12 },
  ]},

  // Kuzey Amerika
  { id: 'CA', name: 'Kanada', flag: '🇨🇦', continent: 'northAmerica', namePoolRegion: 'anglo', leagues: [
    { id: 'ca-1', name: 'Canadian Premier League', tier: 1, teamCount: 8 },
  ]},
  { id: 'MX', name: 'Meksika', flag: '🇲🇽', continent: 'northAmerica', namePoolRegion: 'hispanic', leagues: [
    { id: 'mx-1', name: 'Liga MX', tier: 1, teamCount: 18 },
  ]},
  { id: 'US', name: 'ABD', flag: '🇺🇸', continent: 'northAmerica', namePoolRegion: 'anglo', leagues: [
    { id: 'us-1', name: 'Major League Soccer', tier: 1, teamCount: 18 },
  ]},

  // Güney Amerika
  { id: 'AR', name: 'Arjantin', flag: '🇦🇷', continent: 'southAmerica', namePoolRegion: 'hispanic', leagues: [
    { id: 'ar-1', name: 'Argentine Primera División', tier: 1, teamCount: 20 },
  ]},
  { id: 'BR', name: 'Brezilya', flag: '🇧🇷', continent: 'southAmerica', namePoolRegion: 'lusophone', leagues: [
    { id: 'br-1', name: 'Brasileirão Série A', tier: 1, teamCount: 20 },
  ]},
  { id: 'CL', name: 'Şili', flag: '🇨🇱', continent: 'southAmerica', namePoolRegion: 'hispanic', leagues: [
    { id: 'cl-1', name: 'Chilean Primera División', tier: 1, teamCount: 16 },
  ]},
  { id: 'CO', name: 'Kolombiya', flag: '🇨🇴', continent: 'southAmerica', namePoolRegion: 'hispanic', leagues: [
    { id: 'co-1', name: 'Colombian Primera A', tier: 1, teamCount: 20 },
  ]},
  { id: 'PE', name: 'Peru', flag: '🇵🇪', continent: 'southAmerica', namePoolRegion: 'hispanic', leagues: [
    { id: 'pe-1', name: 'Peruvian Liga 1', tier: 1, teamCount: 18 },
  ]},
  { id: 'UY', name: 'Uruguay', flag: '🇺🇾', continent: 'southAmerica', namePoolRegion: 'hispanic', leagues: [
    { id: 'uy-1', name: 'Uruguayan Primera División', tier: 1, teamCount: 16 },
  ]},
];

export const CONTINENT_NAMES: Record<string, string> = {
  europe: 'Avrupa',
  southAmerica: 'Güney Amerika',
  northAmerica: 'Kuzey Amerika',
  asia: 'Asya',
  africa: 'Afrika',
  oceania: 'Okyanusya',
};

export function getCountry(id: string): Country | undefined {
  return COUNTRIES.find(c => c.id === id);
}

import type { Currency } from '../types/portal-types.js';

export const currencySymbols: Record<Currency, string> = { KZT: '&#8376;', USD: '$', EUR: '&euro;', RUB: '&#8381;' };
export const fallbackRates: Record<Currency, number> = { KZT: 1, USD: 0.002, EUR: 0.0018, RUB: 0.16 };

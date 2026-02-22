// Geo-IP currency mapping and conversion utilities

export type SupportedCurrency = 'usd' | 'gbp' | 'cad' | 'aud' | 'nzd';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  rate: number; // multiplier from USD base
}

const CURRENCY_MAP: Record<string, CurrencyConfig> = {
  US: { code: 'usd', symbol: '$', rate: 1 },
  GB: { code: 'gbp', symbol: '£', rate: 0.79 },
  CA: { code: 'cad', symbol: 'CA$', rate: 1.36 },
  AU: { code: 'aud', symbol: 'A$', rate: 1.53 },
  NZ: { code: 'nzd', symbol: 'NZ$', rate: 1.67 },
};

const DEFAULT_CURRENCY: CurrencyConfig = CURRENCY_MAP.US;

export function getCurrencyForCountry(countryCode: string): CurrencyConfig {
  return CURRENCY_MAP[countryCode?.toUpperCase()] || DEFAULT_CURRENCY;
}

/**
 * Convert a USD cent amount to the target currency cent amount.
 * e.g. 1999 cents USD → 2719 cents CAD (at 1.36 rate)
 */
export function convertAmountCents(usdCents: number, currency: CurrencyConfig): number {
  return Math.round(usdCents * currency.rate);
}

/**
 * Format a cent amount with the currency symbol for display.
 * e.g. 2719 cents CAD → "CA$27.19"
 */
export function formatPrice(cents: number, currency: CurrencyConfig): string {
  const value = (cents / 100).toFixed(2);
  return `${currency.symbol}${value}`;
}

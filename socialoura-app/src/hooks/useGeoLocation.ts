'use client';
import { useState, useEffect } from 'react';
import { getCurrencyForCountry, type CurrencyConfig } from '@/lib/currency';

export interface GeoData {
  country: string;
  currency: CurrencyConfig;
}

export function useGeoLocation(): GeoData {
  const [geo, setGeo] = useState<GeoData>({
    country: 'US',
    currency: getCurrencyForCountry('US'),
  });

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data?.country_code) {
          const cc = data.country_code;
          setGeo({ country: cc, currency: getCurrencyForCountry(cc) });
        }
      })
      .catch(() => {
        // keep default US
      });
  }, []);

  return geo;
}

'use client';
import { useState, useEffect } from 'react';

export function useGeoLocation() {
  const [country, setCountry] = useState('US');

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data?.country_code) {
          setCountry(data.country_code);
        }
      })
      .catch(() => setCountry('US'));
  }, []);

  return country;
}

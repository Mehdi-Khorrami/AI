// Uses Open-Meteo (free, no API key)
export async function getWeather(city: string): Promise<string> {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
  );
  const geo: any = await geoRes.json();
  const place = geo.results?.[0];
  if (!place) return JSON.stringify({ error: `City "${city}" not found` });

  const wRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`,
  );
  const w: any = await wRes.json();
  return JSON.stringify({
    city: place.name,
    country: place.country,
    temperature_c: w.current?.temperature_2m,
    humidity_percent: w.current?.relative_humidity_2m,
    wind_kmh: w.current?.wind_speed_10m,
    weather_code: w.current?.weather_code,
  });
}

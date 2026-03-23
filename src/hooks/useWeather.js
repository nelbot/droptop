import { useState, useEffect, useCallback } from 'preact/hooks';
import { fetchWeather } from '../utils/weather.js';
import { score, nextWindow } from '../utils/scoring.js';

const DEFAULT_LAT = 25.7617;
const DEFAULT_LON = -80.1918;
const DEFAULT_LOCATION = 'Miami, FL';

function findCurrentHourIndex(times) {
  const now = new Date();
  return times.findIndex((t) => {
    const d = new Date(t);
    return d.getHours() === now.getHours() && d.getDate() === now.getDate();
  });
}

export function useLocation() {
  const [location, setLocation] = useState({
    lat: DEFAULT_LAT,
    lon: DEFAULT_LON,
    name: DEFAULT_LOCATION,
    locating: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ lat: DEFAULT_LAT, lon: DEFAULT_LON, name: DEFAULT_LOCATION, locating: false });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lon = parseFloat(pos.coords.longitude.toFixed(4));
        setLocation({
          lat,
          lon,
          name: `${lat}°, ${lon}°`,
          locating: false,
        });
      },
      () => {
        setLocation({ lat: DEFAULT_LAT, lon: DEFAULT_LON, name: DEFAULT_LOCATION, locating: false });
      },
      { timeout: 8000 }
    );
  }, []);

  return location;
}

export function useWeather(lat, lon, thresholds, ready) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const load = useCallback(async () => {
    if (!ready) return;
    setState({ data: null, loading: true, error: null });
    try {
      const raw = await fetchWeather(lat, lon);
      const h = raw.hourly;

      const ci = findCurrentHourIndex(h.time);
      if (ci === -1) throw new Error('Could not match current hour in forecast data.');

      const temp = Math.round(h.temperature_2m[ci]);
      const hum  = Math.round(h.relative_humidity_2m[ci]);
      const rain = Math.round(h.precipitation_probability[ci]);
      const wind = Math.round(h.wind_speed_10m[ci]);
      const uv   = h.uv_index[ci];
      const sc   = score(temp, rain, wind, uv, hum, thresholds);

      // Build 24-hour timeline starting from current hour
      const tl = [];
      for (let i = ci; i < Math.min(ci + 24, h.time.length); i++) {
        tl.push({
          time:  h.time[i],
          temp:  Math.round(h.temperature_2m[i]),
          score: score(
            h.temperature_2m[i],
            h.precipitation_probability[i],
            h.wind_speed_10m[i],
            h.uv_index[i],
            h.relative_humidity_2m[i],
            thresholds
          ),
          code: h.weather_code[i],
        });
      }

      const win    = nextWindow(tl);
      const isGood = sc >= 70;
      const winH   = win.start && win.end
        ? Math.round((win.end - win.start) / 3_600_000)
        : 0;

      setState({
        loading: false,
        error: null,
        data: { temp, hum, rain, wind, uv, sc, tl, win, winH, isGood, now: new Date() },
      });
    } catch (err) {
      console.error('[useWeather]', err);
      setState({ data: null, loading: false, error: err.message || 'Failed to load weather.' });
    }
  }, [lat, lon, thresholds, ready]);

  useEffect(() => { load(); }, [load]);

  return { ...state, refresh: load };
}
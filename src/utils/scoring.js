// ── Scoring ─────────────────────────────────────────────

export function score(temp, rain, wind, uv, hum, thresholds) {
  let s = 100;
  const t = thresholds;
  if (temp < t.temp.min) s -= Math.min(40, (t.temp.min - temp) * 3);
  else if (temp > t.temp.max) s -= Math.min(40, (temp - t.temp.max) * 4);
  if (rain > t.rain.max) s -= Math.min(50, (rain - t.rain.max) * 1.5);
  else if (rain > 10) s -= (rain - 10) * 0.5;
  if (wind > t.wind.max) s -= Math.min(30, (wind - t.wind.max) * 2);
  else if (wind > 15) s -= (wind - 15) * 0.5;
  if (uv > t.uv.max) s -= Math.min(15, (uv - t.uv.max) * 3);
  if (hum > t.humidity.max) s -= Math.min(20, (hum - t.humidity.max) * 1.5);
  return Math.max(0, Math.min(100, Math.round(s)));
}

export function verdict(s) {
  if (s >= 80) return { text: 'Drop the top', color: 'green' };
  if (s >= 55) return { text: 'Borderline',   color: 'yellow' };
  return             { text: 'Keep it up',    color: 'red' };
}

export function status(type, val, thresholds) {
  const t = thresholds;
  if (type === 'temp') {
    return (val < t.temp.min || val > t.temp.max)
      ? 'bad'
      : (val < t.temp.min + 5 || val > t.temp.max - 5) ? 'warn' : '';
  }
  if (type === 'rain')     return val > t.rain.max     ? 'bad' : val > 10  ? 'warn' : '';
  if (type === 'wind')     return val > t.wind.max     ? 'bad' : val > 15  ? 'warn' : '';
  if (type === 'uv')       return val > t.uv.max       ? 'bad' : val > 6   ? 'warn' : '';
  if (type === 'humidity') return val > t.humidity.max ? 'bad' : val > 70  ? 'warn' : '';
  return '';
}

export function icon(code) {
  if (code <= 1)  return '☀️';
  if (code <= 3)  return '⛅';
  if (code <= 48) return '☁️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  return '⛈️';
}

export function nextWindow(hours) {
  const now = new Date();
  let start = null;
  let end = null;
  for (const h of hours) {
    const d = new Date(h.time);
    if (d < now) continue;
    if (h.score >= 70 && !start) { start = d; }
    else if (h.score < 70 && start && !end) { end = d; }
  }
  if (start && !end) end = new Date(hours[hours.length - 1].time);
  return { start, end };
}

export function fmt(d) {
  if (!d) return '—';
  const h = d.getHours();
  const a = h >= 12 ? 'pm' : 'am';
  return `${h % 12 || 12}${a}`;
}
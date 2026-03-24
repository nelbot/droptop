import { status } from '../utils/scoring.js';

function detail(type, val, thresholds) {
  if (type === 'temp')
    return val >= thresholds.temp.min && val <= thresholds.temp.max ? 'In range' : 'Out of range';
  if (type === 'rain') return 'probability';
  if (type === 'wind') return val <= 10 ? 'Calm' : val <= 20 ? 'Breezy' : 'Strong';
  if (type === 'humidity') return val <= 60 ? 'Comfortable' : val <= 75 ? 'Sticky' : 'Swampy';
  if (type === 'uv') return val <= 2 ? 'Low' : val <= 5 ? 'Moderate' : val <= 7 ? 'High' : 'Very high';
  return '';
}

function Card({ label, value, type, val, thresholds }) {
  const st = status(type, val, thresholds);
  return (
    <div class={`condition-card ${st}`}>
      <div class="condition-label">
        <span class="dot" />
        {label}
      </div>
      <div class="condition-value">{value}</div>
      <div class="condition-detail">{detail(type, val, thresholds)}</div>
    </div>
  );
}

export function ConditionCards({ temp, rain, wind, uv, hum, thresholds }) {
  return (
    <div class="conditions anim d2">
      <Card label="Temp"     value={`${temp}°F`} type="temp"     val={temp} thresholds={thresholds} />
      <Card label="Rain"     value={`${rain}%`}  type="rain"     val={rain} thresholds={thresholds} />
      <Card label="Wind"     value={`${wind} mph`} type="wind"   val={wind} thresholds={thresholds} />
      <Card label="Humidity" value={`${hum}%`}   type="humidity" val={hum}  thresholds={thresholds} />
    </div>
  );
}
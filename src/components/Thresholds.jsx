export function Thresholds({ thresholds }) {
  const rows = [
    { label: 'Temperature',      value: `${thresholds.temp.min}–${thresholds.temp.max}°F` },
    { label: 'Rain probability', value: `≤ ${thresholds.rain.max}%` },
    { label: 'Wind speed',       value: `≤ ${thresholds.wind.max} mph` },
    { label: 'UV index',         value: `≤ ${thresholds.uv.max}` },
    { label: 'Humidity',         value: `≤ ${thresholds.humidity.max}%` },
  ];

  return (
    <div class="thresholds anim d5">
      <div class="section-header">Your thresholds</div>
      {rows.map(({ label, value }) => (
        <div key={label} class="threshold-row">
          <span class="threshold-key">{label}</span>
          <span class="threshold-val">{value}</span>
        </div>
      ))}
    </div>
  );
}
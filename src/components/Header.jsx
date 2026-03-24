export function Header({ locationName, car, onChangeCar }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const h = now.getHours();
  const a = h >= 12 ? 'pm' : 'am';
  const timeStr = `${h % 12 || 12}${a}`;

  return (
    <div class="header anim">
      <div class="brand">
        DropTop
        <span>for convertible owners</span>
      </div>
      <div class="location">
        <div class="location-name">{locationName}</div>
        <div>{dateStr}</div>
        <div>{timeStr}</div>
      </div>
    </div>
  );
}
import { useEffect, useRef } from 'preact/hooks';
import { verdict } from '../utils/scoring.js';

const CIRCUMFERENCE = 565.48; // 2 * π * 90

export function Gauge({ score, car }) {
  const fillRef = useRef(null);
  const v = verdict(score);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.style.strokeDashoffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div class="gauge-section anim d1">
      <div class="verdict-label">Right now</div>

      <div class="gauge-ring">
        <svg viewBox="0 0 200 200">
          <circle class="gauge-bg" cx="100" cy="100" r="90" />
          <circle
            ref={fillRef}
            class="gauge-fill"
            cx="100"
            cy="100"
            r="90"
            style={{
              stroke: `var(--${v.color})`,
              filter: `drop-shadow(0 0 8px var(--${v.color}-glow))`,
            }}
          />
        </svg>

        <div class="gauge-inner">
          <div class="gauge-verdict" style={{ color: `var(--${v.color})` }}>
            {v.text}
          </div>
          <div class="gauge-score">{score}</div>
          <div class="gauge-unit">/ 100</div>
        </div>
      </div>

      <div class="gauge-subtitle">{car.name}</div>
    </div>
  );
}
import { useEffect, useRef } from 'preact/hooks';
import { fmt, icon } from '../utils/scoring.js';

export function Timeline({ tl }) {
  const barsRef = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      barsRef.current.forEach((el, i) => {
        if (!el) return;
        setTimeout(() => {
          el.style.height = el.dataset.h + '%';
        }, i * 30);
      });
    }, 600);
    return () => clearTimeout(timer);
  }, [tl]);

  return (
    <div class="timeline-section anim d4">
      <div class="section-header">Next 24 hours</div>
      <div class="timeline">
        {tl.map((t, i) => {
          const d = new Date(t.time);
          const color =
            t.score >= 70
              ? 'var(--green)'
              : t.score >= 50
              ? 'var(--yellow)'
              : 'var(--red)';
          return (
            <div key={t.time} class={`hour-block${i === 0 ? ' now' : ''}`}>
              <div class="hour-time">{i === 0 ? 'Now' : fmt(d)}</div>
              <div class="hour-icon">{icon(t.code)}</div>
              <div class="hour-bar-wrap">
                <div
                  class="hour-bar"
                  ref={(el) => (barsRef.current[i] = el)}
                  data-h={t.score}
                  style={{ background: color, height: '0%' }}
                />
              </div>
              <div class="hour-temp">{t.temp}°</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
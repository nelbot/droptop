import { fmt } from '../utils/scoring.js';

export function WindowAlert({ isGood, win, winH }) {
  return (
    <div class="window-alert anim d3">
      <div class="window-alert-icon">{isGood ? '🟢' : '⏳'}</div>
      <div class="window-alert-text">
        {isGood ? (
          <>
            You're in a window.{' '}
            <span class="hl-green">{winH}h remaining</span> before conditions shift.
          </>
        ) : win.start ? (
          <>
            Next window at <strong>{fmt(win.start)}</strong> for about{' '}
            <span class="hl-green">{winH}h</span>.
          </>
        ) : (
          <>No open-top windows in the next 24 hours.</>
        )}
      </div>
    </div>
  );
}
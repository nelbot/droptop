export function ErrorState({ message, onRetry }) {
  return (
    <div class="error-state">
      <div class="header">
        <div class="brand">
          DropTop
          <span>for convertible owners</span>
        </div>
      </div>
      <p>
        {message || 'Could not load weather data. Check your connection and try again.'}
      </p>
      <button class="retry-btn" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
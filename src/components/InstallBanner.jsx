import { useInstallPrompt } from '../hooks/useInstallPrompt.js';

export function InstallBanner() {
  const { showBanner, iosHint, install, dismiss } = useInstallPrompt();

  if (!showBanner) return null;

  return (
    <div class="install-banner show">
      <div class="install-banner-text">
        {iosHint ? (
          <>Tap <strong>Share</strong> ↑ then <strong>Add to Home Screen</strong> for the full experience.</>
        ) : (
          <><strong>Install DropTop</strong> for the full experience</>
        )}
      </div>
      {!iosHint && (
        <button class="install-btn" onClick={install}>Install</button>
      )}
      <button class="install-dismiss" onClick={dismiss}>×</button>
    </div>
  );
}
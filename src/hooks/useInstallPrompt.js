import { useState, useEffect, useCallback } from 'preact/hooks';

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    // Android / Chrome install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // iOS Safari hint — show if running in mobile Safari but not yet installed
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = window.navigator.standalone === true;
    if (ios && !standalone) {
      setIosHint(true);
      setShowBanner(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowBanner(false);
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setShowBanner(false);
  }, []);

  return { showBanner, iosHint, install, dismiss };
}
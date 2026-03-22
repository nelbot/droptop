# DropTop

Should I drop the top right now? A weather app for convertible owners.

Scores current conditions against your personal thresholds and tells you whether to put the top down — plus a 24-hour timeline of your next open-air windows.

**Live:** `https://YOUR-USERNAME.github.io/droptop/`

---

## Deploy to GitHub Pages

1. Create a new **public** repo named `droptop` at [github.com/new](https://github.com/new)
2. Upload all files: `index.html`, `manifest.json`, `sw.js`, and the `icons/` folder
3. Go to **Settings → Pages → Source: Deploy from branch → main / root**
4. Wait ~1 minute, then visit `https://YOUR-USERNAME.github.io/droptop/`

## Install on iPhone

1. Open the URL in **Safari**
2. Tap **Share** (↑) → **Add to Home Screen**
3. Name it **DropTop**, tap **Add**

Opens full-screen, no browser chrome.

## Customize

Edit the `CONFIG` object in `index.html`:

```js
const CONFIG = {
  lat: 25.6351,            // your latitude
  lon: -80.3453,           // your longitude
  locationName: 'Kendale Lakes, FL',
  car: '2025 MX-5 Miata Club',
  thresholds: {
    temp:     { min: 65, max: 95 },  // °F
    rain:     { max: 20 },            // %
    wind:     { max: 25 },            // mph
    uv:       { max: 8 },
    humidity: { max: 85 },            // %
  }
};
```

Commit and it redeploys automatically.

## Stack

- Vanilla HTML/CSS/JS — no framework, no build step
- [Open-Meteo API](https://open-meteo.com/) — free, no API key
- Service worker for offline caching
- PWA manifest for home screen install

## License

MIT

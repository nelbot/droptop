# DropTop

Should I drop the top right now? A Preact PWA for convertible owners.

Scores real-time weather conditions against your car's comfort thresholds and tells you whether to put the top down — plus a 24-hour timeline of upcoming open-air windows.

**Live:** `https://YOUR-USERNAME.github.io/droptop/`

---

## Stack

- [Preact](https://preactjs.com/) — React-compatible UI, ~3 KB
- [Vite](https://vitejs.dev/) — build tool with instant HMR
- [Open-Meteo API](https://open-meteo.com/) — free weather, no API key needed
- Service worker for offline caching
- PWA manifest for home-screen install

---

## Dev flow

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

Opens at `http://localhost:5173`. Changes hot-reload instantly.

### Production build

```bash
npm run build
```

Output goes to `dist/`. The folder is fully self-contained — deploy it anywhere.

### Preview the production build locally

```bash
npm run preview
```

Serves the `dist/` folder at `http://localhost:4173` so you can verify the production bundle before deploying.

---

## Project structure

```
droptop/
├── src/
│   ├── main.jsx                  # Entry — mounts <App />, registers service worker
│   ├── App.jsx                   # Root — car selection state + localStorage
│   ├── components/
│   │   ├── CarPicker.jsx         # Full-screen car selection with search/filter
│   │   ├── WeatherDashboard.jsx  # Orchestrates all weather UI
│   │   ├── Header.jsx            # Brand + location + date/time
│   │   ├── Gauge.jsx             # Animated SVG score ring
│   │   ├── ConditionCards.jsx    # 2×2 grid: temp / rain / wind / humidity
│   │   ├── WindowAlert.jsx       # Next open-top window callout
│   │   ├── Timeline.jsx          # 24-hour horizontal scroll with animated bars
│   │   ├── Thresholds.jsx        # Per-car threshold summary table
│   │   ├── InstallBanner.jsx     # PWA install prompt (Android + iOS)
│   │   ├── Loading.jsx           # Spinner shown while fetching
│   │   └── ErrorState.jsx        # Error message + retry
│   ├── hooks/
│   │   ├── useWeather.js         # Fetches + processes weather data; exports useLocation
│   │   └── useInstallPrompt.js   # Manages beforeinstallprompt + iOS hint
│   ├── data/
│   │   └── cars.js               # 14 convertibles with per-car thresholds
│   ├── utils/
│   │   ├── scoring.js            # score(), verdict(), status(), icon(), nextWindow(), fmt()
│   │   └── weather.js            # fetchWeather(lat, lon) — Open-Meteo wrapper
│   └── styles/
│       └── global.css            # All styles: design tokens, layout, components
├── icons/                        # PWA icons (192×192, 512×512, apple-touch)
├── index.html                    # Minimal Vite HTML shell
├── vite.config.js                # Vite config with @preact/preset-vite
├── package.json
├── manifest.json                 # PWA manifest
├── sw.js                         # Service worker
├── .github/
│   └── dependabot.yml            # Monthly npm dependency updates
└── AGENTS.md                     # Architecture notes for AI agents and contributors
```

---

## Car picker & localStorage

On first launch the app shows a car picker. Choose your convertible from the list of 14 popular models — each car has its own comfort thresholds (temperature range, rain tolerance, wind limit, UV ceiling, humidity cap).

Your selection is saved to `localStorage` under the key `droptop_car` and restored on every subsequent visit. Tap **⇄ Change car** in the footer to switch.

### Adding a car

Open `src/data/cars.js` and append to the `CARS` array:

```js
{
  id: 'my-car-id',
  name: '2025 My Car Name',
  emoji: '🚗',
  category: 'sporty', // sporty | luxury | exotic | muscle | rugged
  thresholds: {
    temp:     { min: 60, max: 95 },
    rain:     { max: 20 },
    wind:     { max: 25 },
    uv:       { max: 8 },
    humidity: { max: 85 },
  },
},
```

No other changes needed.

---

## Location

The app requests your browser location via `navigator.geolocation`. If permission is granted, coordinates are used directly. If denied or unavailable, it falls back to **Miami, FL** (25.7617°, -80.1918°).

---

## Deploy to GitHub Pages

1. Create a public repo named `droptop` at [github.com/new](https://github.com/new)
2. Run `npm run build`
3. Go to **Settings → Pages → Source** and point it at your chosen branch/dist
4. Visit `https://nelbot.github.io/droptop/`

> **Tip:** Use the [vite-plugin-gh-pages](https://github.com/catnose99/vite-plugin-gh-pages) or the official `gh-pages` npm package to automate step 2–3.

---

## Install as a PWA

### iPhone / iPad

1. Open the URL in **Safari**
2. Tap **Share** (↑) → **Add to Home Screen**
3. Name it **DropTop**, tap **Add**

### Android / Chrome

Tap **Install** in the banner that appears at the top of the page, or use the browser menu → **Add to Home Screen**.

Both paths open the app full-screen with no browser chrome.

---

## Service worker & offline

`sw.js` caches all static assets on install. Open-Meteo API responses are cached with a network-first strategy — the last known forecast is shown when you're offline.

To bust the cache after a deploy, bump the version string in `sw.js`:

```js
const CACHE_NAME = 'droptop-v2'; // increment this
```

---

## License

MIT

# AGENTS.md

## Project overview

**DropTop** is a Preact PWA that tells convertible owners whether conditions are good to drop the top. It fetches real-time weather from the Open-Meteo API (no key required), scores conditions against per-car thresholds, and persists the user's car choice in localStorage.

---

## Repository layout

```
droptop/
├── src/
│   ├── main.jsx                  # Entry point — mounts <App />, registers SW
│   ├── App.jsx                   # Root — car selection state + localStorage
│   ├── components/
│   │   ├── CarPicker.jsx         # Full-screen car selection with search/filter
│   │   ├── WeatherDashboard.jsx  # Orchestrates all weather UI
│   │   ├── Header.jsx            # Brand + location + date/time
│   │   ├── Gauge.jsx             # Animated SVG score ring
│   │   ├── ConditionCards.jsx    # 2×2 grid of temp/rain/wind/humidity cards
│   │   ├── WindowAlert.jsx       # Next open-top window callout
│   │   ├── Timeline.jsx          # 24-hour horizontal scroll with animated bars
│   │   ├── Thresholds.jsx        # Per-car threshold summary table
│   │   ├── InstallBanner.jsx     # PWA install prompt (Android + iOS)
│   │   ├── Loading.jsx           # Spinner shown during fetch
│   │   └── ErrorState.jsx        # Error message + retry button
│   ├── hooks/
│   │   ├── useWeather.js         # Fetches + processes weather; exports useLocation
│   │   └── useInstallPrompt.js   # Manages beforeinstallprompt + iOS hint
│   ├── data/
│   │   └── cars.js               # Curated list of 14 convertibles with thresholds
│   ├── utils/
│   │   ├── scoring.js            # score(), verdict(), status(), icon(), nextWindow(), fmt()
│   │   └── weather.js            # fetchWeather(lat, lon) — thin Open-Meteo wrapper
│   └── styles/
│       └── global.css            # All styles: design tokens, components, CarPicker
├── icons/                        # PWA icons (192, 512, apple-touch)
├── index.html                    # Minimal Vite HTML shell
├── vite.config.js                # Vite + @preact/preset-vite, base: "./"
├── package.json
├── manifest.json                 # PWA manifest
├── sw.js                         # Service worker (cache-first assets, network-first API)
├── .github/
│   └── dependabot.yml            # Monthly npm dependency updates
└── AGENTS.md                     # This file
```

---

## Architecture decisions

| Decision | Rationale |
|---|---|
| **Preact** over React | Identical API, ~3 KB vs ~45 KB — critical for a PWA that must load fast on mobile |
| **Vite** | Near-instant HMR, native ESM, zero config for Preact via `@preact/preset-vite` |
| **No CSS framework** | The design is bespoke and dark-themed; utility classes would add bloat without benefit |
| **Open-Meteo API** | Free, no API key, excellent global coverage, single request returns full hourly forecast |
| **localStorage for car** | Simple, synchronous, survives page reloads and PWA installs with no backend needed |
| **Geolocation API** | Gives accurate local weather; falls back to Miami, FL if permission is denied |
| **Per-car thresholds** | Different cars suit different conditions — a Jeep owner tolerates rain; a Ferrari owner does not |

---

## Data flow

```
App
 └── car state (localStorage → useState)
       │
       ├─ no car saved → <CarPicker onSelect={handleCarSelect} />
       │
       └─ car selected → <WeatherDashboard car={car} onChangeCar={...} />
                              │
                              ├── useLocation()
                              │     navigator.geolocation → { lat, lon, name, locating }
                              │     fallback: Miami, FL (25.7617, -80.1918)
                              │
                              ├── useWeather(lat, lon, car.thresholds, ready)
                              │     fetchWeather() → Open-Meteo hourly JSON
                              │     → { temp, hum, rain, wind, uv, sc, tl, win, winH, isGood }
                              │
                              ├── <Header />          location name + date/time
                              ├── <Gauge />           animated SVG ring + verdict
                              ├── <ConditionCards />  temp / rain / wind / humidity
                              ├── <WindowAlert />     next good window callout
                              ├── <Timeline />        24-hour scroll with animated bars
                              ├── <Thresholds />      threshold summary table
                              └── <InstallBanner />   useInstallPrompt()
```

---

## Scoring algorithm

`score(temp, rain, wind, uv, humidity, thresholds)` → **0–100 integer**

Each factor deducts from a starting score of 100:

| Factor | Penalty |
|---|---|
| Temperature below `temp.min` | up to −40 pts · `(min - temp) × 3` |
| Temperature above `temp.max` | up to −40 pts · `(temp - max) × 4` |
| Rain above `rain.max` | up to −50 pts · `(rain - max) × 1.5` |
| Rain above 10% (soft warn) | `(rain - 10) × 0.5` |
| Wind above `wind.max` | up to −30 pts · `(wind - max) × 2` |
| Wind above 15 mph (soft warn) | `(wind - 15) × 0.5` |
| UV above `uv.max` | up to −15 pts · `(uv - max) × 3` |
| Humidity above `humidity.max` | up to −20 pts · `(hum - max) × 1.5` |

**Verdict bands**

| Score | Text | Colour |
|---|---|---|
| ≥ 80 | Drop the top | Green |
| 55 – 79 | Borderline | Yellow |
| < 55 | Keep it up | Red |

---

## Adding a new car

1. Open `src/data/cars.js`
2. Append an entry to the `CARS` array:

```js
{
  id: 'my-car-id',           // unique kebab-case string
  name: '2025 My Car Name',
  emoji: '🚗',
  category: 'sporty',        // sporty | luxury | exotic | muscle | rugged
  thresholds: {
    temp:     { min: 60, max: 95 },
    rain:     { max: 20 },
    wind:     { max: 25 },
    uv:       { max: 8 },
    humidity: { max: 85 },
  },
},
```

No other changes needed — `CarPicker` reads directly from `CARS`.

---

## Threshold tuning guide

| Field | Unit | Condition card turns yellow | Condition card turns red |
|---|---|---|---|
| `temp.min` / `temp.max` | °F | Within 5° of the edge | Outside the range |
| `rain.max` | % probability | Above 10% | Above `rain.max` |
| `wind.max` | mph | Above 15 mph | Above `wind.max` |
| `uv.max` | UV index | Above 6 | Above `uv.max` |
| `humidity.max` | % | Above 70% | Above `humidity.max` |

General guidance by category:

- **Exotic / Luxury** — tight thresholds; narrow temp range, low rain/wind tolerance, humidity matters
- **Sporty** — moderate; sensible all-rounder defaults
- **Muscle** — wider temp and wind tolerance; less fussy
- **Rugged** — very wide tolerances across the board

---

## Service worker

`sw.js` uses two caching strategies:

- **Network-first** for `api.open-meteo.com` — always tries a fresh fetch, caches the response, falls back to cache when offline.
- **Cache-first** for all other assets (HTML, CSS, JS, fonts, icons) — serves from cache immediately, updates in background.

To bust the cache on deploy, increment `CACHE_NAME` in `sw.js`:

```js
const CACHE_NAME = 'droptop-v2'; // bump this
```

---

## PWA install

| Platform | Mechanism |
|---|---|
| Android / Chrome | `beforeinstallprompt` captured in `useInstallPrompt`; banner appears automatically |
| iOS / Safari | Hook detects `iphone\|ipad\|ipod` UA and surfaces a "Tap Share → Add to Home Screen" hint |

The install banner is dismissed via component state and will reappear on the next visit if the app has not been installed.

---

## Dependabot

`.github/dependabot.yml` runs a **monthly** npm audit and opens PRs with:
- Label: `dependencies`
- Commit prefix: `chore`

---

## Environment & build

No environment variables or API keys are required. The Open-Meteo API is fully public.

```bash
npm install        # install deps
npm run dev        # start Vite dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

The `dist/` folder is self-contained and can be deployed to any static host (GitHub Pages, Netlify, Vercel, etc.).
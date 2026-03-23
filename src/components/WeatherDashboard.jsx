import { useWeather, useLocation } from '../hooks/useWeather.js';
import { Header } from './Header.jsx';
import { Gauge } from './Gauge.jsx';
import { ConditionCards } from './ConditionCards.jsx';
import { WindowAlert } from './WindowAlert.jsx';
import { Timeline } from './Timeline.jsx';
import { Thresholds } from './Thresholds.jsx';
import { InstallBanner } from './InstallBanner.jsx';
import { Loading } from './Loading.jsx';
import { ErrorState } from './ErrorState.jsx';

export function WeatherDashboard({ car, onChangeCar }) {
  const location = useLocation();
  const { data, loading, error, refresh } = useWeather(
    location.lat,
    location.lon,
    car.thresholds,
    !location.locating
  );

  const locationName = location.locating ? 'Locating...' : location.name;

  if (loading) {
    return (
      <div class="app">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div class="app">
        <ErrorState message={error} onRetry={refresh} />
      </div>
    );
  }

  const { temp, hum, rain, wind, uv, sc, tl, win, winH, isGood } = data;

  return (
    <div class="app">
      <InstallBanner />

      <Header locationName={locationName} car={car} onChangeCar={onChangeCar} />

      <Gauge score={sc} car={car} />

      <ConditionCards
        temp={temp}
        rain={rain}
        wind={wind}
        uv={uv}
        hum={hum}
        thresholds={car.thresholds}
      />

      <WindowAlert isGood={isGood} win={win} winH={winH} />

      <Timeline tl={tl} />

      <Thresholds thresholds={car.thresholds} />

      <div class="refresh-bar anim d5">
        <button class="refresh-btn" onClick={refresh}>↻ Refresh</button>
      </div>

      <div class="footer anim d5">
        DropTop v2.0 · Open-Meteo API<br />
        {car.name}
        <br />
        <button class="footer-change-car" onClick={onChangeCar}>
          ⇄ Change car
        </button>
      </div>
    </div>
  );
}
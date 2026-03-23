import { useState } from 'preact/hooks';
import { CarPicker } from './components/CarPicker.jsx';
import { WeatherDashboard } from './components/WeatherDashboard.jsx';

const STORAGE_KEY = 'droptop_car';

function loadSavedCar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function App() {
  const [car, setCar] = useState(() => loadSavedCar());

  const handleCarSelect = (selectedCar) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCar));
    } catch {
      // localStorage may be unavailable in some private-browsing contexts
    }
    setCar(selectedCar);
  };

  const handleChangeCar = () => {
    setCar(null);
  };

  if (!car) {
    return <CarPicker onSelect={handleCarSelect} />;
  }

  return <WeatherDashboard car={car} onChangeCar={handleChangeCar} />;
}
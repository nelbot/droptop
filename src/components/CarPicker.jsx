import { useState, useMemo } from 'preact/hooks';
import { CARS, CATEGORY_LABELS } from '../data/cars.js';

export function CarPicker({ onSelect }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CARS;
    return CARS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [query]);

  const handleConfirm = () => {
    if (!selected) return;
    onSelect(selected);
  };

  return (
    <div class="car-picker">
      <div class="picker-hero">
        <div class="picker-brand">DropTop</div>
        <div class="picker-subtitle">Choose your convertible</div>
      </div>

      <div class="picker-search-wrap">
        <span class="picker-search-icon">⌕</span>
        <input
          class="picker-search"
          type="search"
          placeholder="Search makes & models..."
          value={query}
          onInput={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div class="picker-list">
        {filtered.length === 0 ? (
          <div class="picker-empty">No cars match "{query}"</div>
        ) : (
          filtered.map((car) => (
            <button
              key={car.id}
              class={`car-card${selected?.id === car.id ? ' selected' : ''}`}
              onClick={() => setSelected(car)}
            >
              <div class="car-card-emoji">{car.emoji}</div>
              <div class="car-card-info">
                <div class="car-card-name">{car.name}</div>
                <span class={`car-card-badge ${car.category}`}>
                  {CATEGORY_LABELS[car.category] ?? car.category}
                </span>
              </div>
              <div class="car-card-check">✓</div>
            </button>
          ))
        )}
      </div>

      <button
        class="picker-cta"
        disabled={!selected}
        onClick={handleConfirm}
      >
        {selected ? `Let's go` : 'Select a car'}
      </button>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';

export default function TastePreference() {
  const navigate = useNavigate();
  const setAvoidSpicy = useOrderStore((s) => s.setAvoidSpicy);
  const [selected, setSelected] = useState([]);

  const options = [
    { label: 'Spicy', emoji: '🌶️' },
    { label: 'Sweet', emoji: '🍯' },
    { label: 'Sour', emoji: '🍋' },
    { label: 'Salty', emoji: '🧂' },
    { label: 'Mild', emoji: '🌿' },
    { label: 'Balanced', emoji: '⚖️' },
  ];

  const toggle = (val) => {
    setSelected(selected.includes(val) ? selected.filter((s) => s !== val) : [...selected, val]);
  };

  const handleNext = () => {
    setAvoidSpicy(selected.includes('Spicy') ? false : true);
    navigate('/time');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-paper)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      gap: '24px',
      maxWidth: '400px',
      margin: '0 auto',
    }}>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '20px', textAlign: 'center' }}>
        What taste should this table avoid or emphasize?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {options.map((o) => (
          <button
            key={o.label}
            onClick={() => toggle(o.label)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 20px',
              border: '2px solid var(--color-ink)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              cursor: 'pointer',
              background: selected.includes(o.label) ? 'var(--color-ink)' : 'var(--color-paper)',
              color: selected.includes(o.label) ? 'var(--color-paper)' : 'var(--color-ink)',
              width: '100%',
            }}
          >
            <span>{o.emoji}</span>
            <span>{o.label}</span>
          </button>
        ))}
      </div>

      <input
        placeholder="Your answer..."
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '2px solid var(--color-ink)',
          borderRadius: 'var(--radius)',
          fontFamily: 'var(--font-hint)',
          fontSize: '16px',
          background: 'var(--color-paper)',
          color: 'var(--color-ink)',
          outline: 'none',
        }}
      />

      <button
        onClick={handleNext}
        style={{
          width: '100%',
          background: 'var(--color-ink)',
          color: 'var(--color-paper)',
          border: '2px solid var(--color-ink)',
          borderRadius: 'var(--radius)',
          padding: '14px',
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          cursor: 'pointer',
        }}
      >
        Next →
      </button>

    </div>
  );
}

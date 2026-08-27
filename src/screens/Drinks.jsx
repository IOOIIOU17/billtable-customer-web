import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';

export default function Drinks() {
  const navigate = useNavigate();
  const setDrinks = useOrderStore((s) => s.setDrinks);
  const [selected, setSelected] = useState('');

  const options = ['Cocktails', 'Wine', 'Mocktails', 'Skip it'];

  const pillStyle = (val) => ({
    padding: '12px 24px',
    border: '2px solid var(--color-ink)',
    borderRadius: '999px',
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    cursor: 'pointer',
    background: selected === val ? 'var(--color-ink)' : 'var(--color-paper)',
    color: selected === val ? 'var(--color-paper)' : 'var(--color-ink)',
  });

  const handleNext = () => {
    if (!selected) return;
    setDrinks(selected);
    navigate('/cake');
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
        What should this table drink?
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {options.map((o) => (
          <button key={o} style={pillStyle(o)} onClick={() => setSelected(o)}>{o}</button>
        ))}
      </div>

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

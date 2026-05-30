import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';

export default function Allergy() {
  const navigate = useNavigate();
  const setAllergies = useOrderStore((s) => s.setAllergies);
  const [selected, setSelected] = useState([]);

  const options = ['Milk', 'Peanuts', 'Shellfish', 'Gluten', 'No allergy', 'Other'];

  const toggle = (val) => {
    if (val === 'No allergy') { setSelected(['No allergy']); return; }
    const filtered = selected.filter((s) => s !== 'No allergy');
    setSelected(filtered.includes(val) ? filtered.filter((s) => s !== val) : [...filtered, val]);
  };

  const pillStyle = (val) => ({
    padding: '12px 24px',
    border: '2px solid var(--color-ink)',
    borderRadius: '999px',
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    cursor: 'pointer',
    background: selected.includes(val) ? 'var(--color-ink)' : 'var(--color-paper)',
    color: selected.includes(val) ? 'var(--color-paper)' : 'var(--color-ink)',
  });

  const handleNext = () => {
    setAllergies(selected);
    navigate('/taste');
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
        Does anyone have allergies I should protect?
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {options.map((o) => (
          <button key={o} style={pillStyle(o)} onClick={() => toggle(o)}>{o}</button>
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

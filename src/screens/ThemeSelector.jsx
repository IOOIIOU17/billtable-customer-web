import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';

export default function ThemeSelector() {
  const navigate = useNavigate();
  const setTheme = useOrderStore((s) => s.setTheme);
  const [selected, setSelected] = useState('');

  const cuisines = ['Thai', 'Sushi', 'Italian', 'Custom'];
  const events = ['My Party', 'Birthday', 'Wedding', 'Football @ Home', 'Football @ Office', 'Graduation', 'Other'];

  const pillStyle = (val) => ({
    padding: '10px 20px',
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
    setTheme(selected);
    navigate('/guests');
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
        How do you want to build this table?
      </p>

      <div>
        <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', marginBottom: '10px' }}>
          By Cuisine
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {cuisines.map((c) => (
            <button key={c} style={pillStyle(c)} onClick={() => setSelected(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', marginBottom: '10px' }}>
          By Theme
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {events.map((e) => (
            <button key={e} style={pillStyle(e)} onClick={() => setSelected(e)}>{e}</button>
          ))}
        </div>
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
          marginTop: '8px',
        }}
      >
        Next →
      </button>

    </div>
  );
}

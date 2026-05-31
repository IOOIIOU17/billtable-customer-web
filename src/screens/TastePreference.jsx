import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import spicyImg from '../assets/taste-spicy.png';
import sweetImg from '../assets/taste-sweet.png';
import sourImg from '../assets/taste-sour.png';
import saltyImg from '../assets/taste-salty.png';
import mildImg from '../assets/taste-mild.png';
import balancedImg from '../assets/taste-balanced.png';

export default function TastePreference() {
  const navigate = useNavigate();
  const setAvoidSpicy = useOrderStore((s) => s.setAvoidSpicy);
  const [selected, setSelected] = useState([]);

  const options = [
    { label: 'Spicy', img: spicyImg },
    { label: 'Sweet', img: sweetImg },
    { label: 'Sour', img: sourImg },
    { label: 'Salty', img: saltyImg },
    { label: 'Mild', img: mildImg },
    { label: 'Balanced', img: balancedImg },
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
      gap: '12px',
      maxWidth: '400px',
      margin: '0 auto',
    }}>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '20px',
        textAlign: 'center',
        marginBottom: '4px',
      }}>
        What taste should this table avoid or emphasize?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        {options.map((o) => (
          <button
            key={o.label}
            onClick={() => toggle(o.label)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '48px',
              paddingRight: '48px',
              border: '2px solid var(--color-ink)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              cursor: 'pointer',
              background: selected.includes(o.label) ? 'var(--color-ink)' : 'var(--color-paper)',
              color: selected.includes(o.label) ? 'var(--color-paper)' : 'var(--color-ink)',
              width: '100%',
              height: '56px',
            }}
          >
            <span>{o.label}</span>
            <img
              src={o.img}
              alt={o.label}
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain',
                filter: selected.includes(o.label) ? 'invert(1)' : 'none',
              }}
            />
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
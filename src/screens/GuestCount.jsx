import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import guestDoodle from '../assets/guest-doodle.png';

export default function GuestCount() {
  const navigate = useNavigate();
  const setGuestCount = useOrderStore((s) => s.setGuestCount);
  const [count, setCount] = useState('');

  const handleNext = () => {
    if (!count || count < 1) return;
    setGuestCount(Number(count));
    navigate('/budget');
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

      <img
        src={guestDoodle}
        alt="Guest doodle"
        style={{
          width: '200px',
          height: '200px',
          objectFit: 'contain',
        }}
      />

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '20px', textAlign: 'center' }}>
        How many people will sit at this table?
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <input
          type="number"
          min="1"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          placeholder="20"
          style={{
            width: '120px',
            padding: '12px 16px',
            border: '2px solid var(--color-ink)',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-body)',
            fontSize: '24px',
            textAlign: 'center',
            background: 'var(--color-paper)',
            color: 'var(--color-ink)',
            outline: 'none',
          }}
        />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--color-pencil)' }}>
          people
        </span>
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
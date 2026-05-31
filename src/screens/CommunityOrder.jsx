import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import communityDoodle from '../assets/community-doodle.png';

export default function CommunityOrder() {
  const navigate = useNavigate();
  const setCommunityType = useOrderStore((s) => s.setCommunityType);
  const [selected, setSelected] = useState('');

  const options = ['Coworker', 'Neighbor', 'Homeless', 'Driver', 'Other'];

  const handleNext = () => {
    setCommunityType(selected);
    navigate('/summary');
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
        src={communityDoodle}
        alt="Community doodle"
        style={{
          width: '220px',
          height: '180px',
          objectFit: 'contain',
        }}
      />

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '20px', textAlign: 'center' }}>
        Every table can make the city a little warmer.
      </p>

      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', textAlign: 'center' }}>
        Choose who receives the shared order.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {options.map((o) => (
          <button
            key={o}
            onClick={() => setSelected(o)}
            style={{
              padding: '12px 24px',
              border: '2px solid var(--color-ink)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              cursor: 'pointer',
              background: selected === o ? 'var(--color-ink)' : 'var(--color-paper)',
              color: selected === o ? 'var(--color-paper)' : 'var(--color-ink)',
            }}
          >
            {o}
          </button>
        ))}
      </div>

      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', textAlign: 'center' }}>
        Restaurant will choose the shared meal.
      </p>

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
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import confirmationDoodle from '../assets/confirmation-doodle.png';

export default function Confirmation() {
  const navigate = useNavigate();
  const reset = useOrderStore((s) => s.reset);

  const steps = [
    'Order received',
    'Restaurant preparing',
    'Delivery scheduled',
    'Out for delivery',
    'Delivered',
    'Completed',
  ];

  const handleDone = () => {
    reset();
    navigate('/');
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

      <p style={{ fontFamily: 'var(--font-logo)', fontSize: '32px', textAlign: 'center' }}>
        Your table is confirmed.
      </p>

      <img
        src={confirmationDoodle}
        alt="Confirmation doodle"
        style={{
          width: '240px',
          height: '180px',
          objectFit: 'contain',
        }}
      />

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {steps.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--color-ink)', fontSize: '16px' }}>✓</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}>{s}</span>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '16px', color: 'var(--color-pencil)' }}>
        Thank you! ♡
      </p>

      <button
        onClick={handleDone}
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
        Start a new table
      </button>

    </div>
  );
}
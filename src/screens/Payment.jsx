import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';

export default function Payment() {
  const navigate = useNavigate();
  const store = useOrderStore();

  const total = store.orderTotal || 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-paper)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      gap: '20px',
      maxWidth: '400px',
      margin: '0 auto',
    }}>

      <p style={{ fontFamily: 'var(--font-logo)', fontSize: '24px' }}>Secure Payment</p>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {['Card number', 'Expiry MM/YY', 'CVV', 'Name on card', 'Billing ZIP'].map((placeholder) => (
          <input
            key={placeholder}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid var(--color-ink)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              background: 'var(--color-paper)',
              color: 'var(--color-ink)',
              outline: 'none',
            }}
          />
        ))}
      </div>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid var(--color-ink)' }}>
        <span style={{ fontFamily: 'var(--font-logo)', fontSize: '20px' }}>Total</span>
        <span style={{ fontFamily: 'var(--font-logo)', fontSize: '20px' }}>${total}</span>
      </div>

      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', textAlign: 'center' }}>
        * Demo only — no real payment processed
      </p>

      <button
        onClick={() => navigate('/confirmation')}
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
        Confirm & Pay
      </button>

    </div>
  );
}

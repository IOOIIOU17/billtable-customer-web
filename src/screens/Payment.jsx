import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useOrderStore from '../store/orderStore';
import api from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ orderId, total }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const reset = useOrderStore((s) => s.reset);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paid, setPaid] = useState(false);
  const [closingMessage, setClosingMessage] = useState('');
  const theme = useOrderStore(s => s.theme);
  const guestCount = useOrderStore(s => s.guestCount);

  useEffect(() => {
    if (paid) {
      api.get('/api/orders/closing-message', { params: { theme, guestCount } })
        .then(res => setClosingMessage(res.data?.data?.message || ''))
        .catch(() => {});
    }
  }, [paid]);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // Step 1: สร้าง PaymentIntent จาก backend
      const intentRes = await api.post('/api/payments/create-intent',
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { clientSecret } = intentRes.data;

      // Step 2: ยืนยันการจ่ายเงินกับ Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        setPaid(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (paid) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <p style={{ fontFamily: 'var(--font-logo)', fontSize: '32px', textAlign: 'center' }}>Payment confirmed! ✓</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', textAlign: 'center', color: 'var(--color-pencil)' }}>Your table is confirmed. The restaurant will start preparing your order.</p>
        {closingMessage && (
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '15px', textAlign: 'center', color: 'var(--color-pencil)', fontStyle: 'italic', marginTop: '8px', lineHeight: '1.6' }}>{closingMessage}</p>
        )}
        <button onClick={() => { reset(); navigate('/'); }} style={{ width: '100%', background: 'var(--color-ink)', color: 'var(--color-paper)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '14px', fontFamily: 'var(--font-body)', fontSize: '18px', cursor: 'pointer' }}>Start a new table</button>
        <button onClick={() => navigate('/history')} style={{ width: '100%', background: 'var(--color-paper)', color: 'var(--color-ink)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '14px', fontFamily: 'var(--font-body)', fontSize: '18px', cursor: 'pointer' }}>My Orders</button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{
        padding: '16px',
        border: '2px solid var(--color-ink)',
        borderRadius: 'var(--radius)',
        background: 'var(--color-paper)',
      }}>
        <CardElement options={{
          style: {
            base: {
              fontFamily: "'Patrick Hand', sans-serif",
              fontSize: '16px',
              color: '#1A1A1A',
              '::placeholder': { color: '#4A4A4A' },
            },
            invalid: { color: 'var(--color-ink)' },
          },
        }} />
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-ink)', margin: 0 }}>
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!stripe || loading}
        style={{
          width: '100%',
          background: loading ? 'var(--color-pencil)' : 'var(--color-ink)',
          color: 'var(--color-paper)',
          border: '2px solid var(--color-ink)',
          borderRadius: 'var(--radius)',
          padding: '14px',
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Processing...' : `Pay $${total}`}
      </button>

      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '12px', color: 'var(--color-pencil)', textAlign: 'center', margin: 0 }}>
        Secured by Stripe
      </p>
    </div>
  );
}

export default function Payment() {
  const store = useOrderStore();
  const total = store.orderTotal || 0;
  const orderId = store.currentOrderId;


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
      <p style={{ fontFamily: 'var(--font-logo)', fontSize: '28px' }}>Secure Payment</p>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '2px solid var(--color-ink)' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '18px' }}>Total</span>
        <span style={{ fontFamily: 'var(--font-logo)', fontSize: '20px' }}>${total}</span>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm orderId={orderId} total={total} />
      </Elements>


    </div>
  );
}

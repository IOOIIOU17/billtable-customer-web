import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import confirmationDoodle from '../assets/confirmation-doodle.png';

export default function Confirmation() {
  const navigate = useNavigate();
  const reset = useOrderStore((s) => s.reset);
  const order = useOrderStore((s) => s.order);
  const theme = useOrderStore((s) => s.theme);
  const budget = useOrderStore((s) => s.budget);
  const guestCount = useOrderStore((s) => s.guestCount);
  const allergies = useOrderStore((s) => s.allergies);
  const avoidSpicy = useOrderStore((s) => s.avoidSpicy);
  const setMatchedRestaurant = useOrderStore((s) => s.setMatchedRestaurant);

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

  const handleChangeRestaurant = async () => {
    try {
      const res = await fetch('/api/matching/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          budget,
          guest_count: guestCount,
          allergies,
          avoid_spicy: avoidSpicy,
          exclude_restaurant: order?.restaurant_id,
        }),
      });
      const data = await res.json();
      if (data.restaurant) {
        setMatchedRestaurant(data.restaurant);
        navigate('/matching');
      }
    } catch (e) {
      console.error(e);
    }
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
        style={{ width: '240px', height: '180px', objectFit: 'contain' }}
      />

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {steps.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--color-ink)', fontSize: '16px' }}>✓</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}>{s}</span>
          </div>
        ))}
      </div>

      {order && order.restaurant_phone && (
        <div style={{
          width: '100%',
          border: '2px solid var(--color-ink)',
          borderRadius: 'var(--radius)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', margin: 0 }}>
            ติดต่อร้านอาหารได้ที่
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '20px', margin: 0 }}>
            {order.restaurant_phone}
          </p>
          <a href={'tel:' + order.restaurant_phone} style={{
            width: '100%',
            padding: '12px',
            background: 'var(--color-paper)',
            color: 'var(--color-ink)',
            border: '2px solid var(--color-ink)',
            borderRadius: '12px',
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            cursor: 'pointer',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'block',
          }}>
            โทรหาร้าน
          </a>
        </div>
      )}

      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '16px', color: 'var(--color-pencil)' }}>
        Thank you! ♡
      </p>

      <button onClick={handleDone} style={{
        width: '100%',
        background: 'var(--color-ink)',
        color: 'var(--color-paper)',
        border: '2px solid var(--color-ink)',
        borderRadius: 'var(--radius)',
        padding: '14px',
        fontFamily: 'var(--font-body)',
        fontSize: '18px',
        cursor: 'pointer',
      }}>
        Start a new table
      </button>

      <button onClick={handleChangeRestaurant} style={{
        width: '100%',
        background: 'var(--color-paper)',
        color: 'var(--color-ink)',
        border: '2px solid var(--color-ink)',
        borderRadius: 'var(--radius)',
        padding: '14px',
        fontFamily: 'var(--font-body)',
        fontSize: '18px',
        cursor: 'pointer',
      }}>
        Change restaurant or menu
      </button>

    </div>
  );
}
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import api from '../services/api';
import confirmationDoodle from '../assets/confirmation-doodle.png';

export default function Confirmation() {
  const navigate = useNavigate();
  const reset = useOrderStore((s) => s.reset);
  const order = useOrderStore((s) => s.order);
  const matchedRestaurant = useOrderStore((s) => s.matchedRestaurant);
  const theme = useOrderStore((s) => s.theme);
  const budget = useOrderStore((s) => s.budget);
  const guestCount = useOrderStore((s) => s.guestCount);
  const allergies = useOrderStore((s) => s.allergies);
  const avoidSpicy = useOrderStore((s) => s.avoidSpicy);

  const [createdOrder, setCreatedOrder] = useState(null);
  const [error, setError] = useState(null);

  const steps = [
    'Order received',
    'Restaurant preparing',
    'Delivery scheduled',
    'Out for delivery',
    'Delivered',
    'Completed',
  ];

  useEffect(() => {
    const sendOrder = async () => {
      try {
        const restaurantId = matchedRestaurant?.restaurant?.id || 1;
        const menus = matchedRestaurant?.recommended_menus || [];
        const items = menus.slice(0, 5).map((m) => ({
          name: m.name,
          quantity: 1,
          unitPrice: m.price,
        }));
        const res = await api.post('/api/orders', { restaurantId, items });
        setCreatedOrder(res.data.data);
      } catch (err) {
        setError(err.message);
      }
    };
    sendOrder();
  }, []);

  const handleDone = () => {
    reset();
    navigate('/');
  };

  const handleChangeRestaurant = () => { navigate('/matching'); };

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

      <img src={confirmationDoodle} alt="Confirmation doodle" style={{ width: '240px', height: '180px', objectFit: 'contain' }} />

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {steps.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--color-ink)', fontSize: '16px' }}>✓</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}>{s}</span>
          </div>
        ))}
      </div>

      {createdOrder && (
        <div style={{ width: '100%', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '16px' }}>
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', margin: 0 }}>Order ID</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', margin: 0 }}>{createdOrder.order_id?.slice(0, 8)}</p>
        </div>
      )}

      {error && (
        <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'red' }}>Error: {error}</p>
      )}

      {matchedRestaurant?.restaurant?.phone && (
        <div style={{
          width: '100%',
          border: '2px solid var(--color-ink)',
          borderRadius: 'var(--radius)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', margin: 0 }}>ติดต่อร้านอาหารได้ที่</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '20px', margin: 0 }}>{matchedRestaurant.restaurant.phone}</p>
          <a href={'tel:' + matchedRestaurant.restaurant.phone} style={{
            width: '100%', padding: '12px',
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
          }}>โทรหาร้าน</a>
        </div>
      )}

      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '16px', color: 'var(--color-pencil)' }}>Thank you! ♡</p>

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
      }}>Start a new table</button>

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
      }}>Change restaurant or menu</button>

    </div>
  );
}

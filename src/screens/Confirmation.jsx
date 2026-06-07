import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import api from '../services/api';
import confirmationDoodle from '../assets/confirmation-doodle.png';

export default function Confirmation() {
  const navigate = useNavigate();
  const reset = useOrderStore((s) => s.reset);
  const matchedRestaurant = useOrderStore((s) => s.matchedRestaurant);
  const theme = useOrderStore((s) => s.theme);
  const guestCount = useOrderStore((s) => s.guestCount);
  const budget = useOrderStore((s) => s.budget);
  const allergies = useOrderStore((s) => s.allergies);
  const avoidSpicy = useOrderStore((s) => s.avoidSpicy);
  const deliveryTime = useOrderStore((s) => s.deliveryTime);
  const deliveryAddress = useOrderStore((s) => s.deliveryAddress);

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
        const token = localStorage.getItem('token');
        const restaurantId = matchedRestaurant?.restaurant?.id || 1;
        const menus = matchedRestaurant?.recommended_menus || [];
        const items = menus.slice(0, 5).map((m) => ({
          name: m.name,
          quantity: 1,
          unitPrice: m.price,
        }));

        await api.post('/api/orders', {
          restaurantId,
          items,
          theme,
          guestCount,
          budget,
          allergies: allergies.join(', '),
          avoidSpicy,
          deliveryTime,
          deliveryAddress,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error(err);
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
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: '24px', maxWidth: '400px', margin: '0 auto' }}>
      <p style={{ fontFamily: 'var(--font-logo)', fontSize: '32px', textAlign: 'center' }}>Your table is confirmed.</p>

      <img src={confirmationDoodle} alt="Confirmation doodle" style={{ width: '240px', height: '180px', objectFit: 'contain' }} />

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {steps.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--color-ink)', fontSize: '16px' }}>✓</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}>{s}</span>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '16px', color: 'var(--color-pencil)' }}>Thank you! ♡</p>

      <button onClick={handleDone} style={{ width: '100%', background: 'var(--color-ink)', color: 'var(--color-paper)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '14px', fontFamily: 'var(--font-body)', fontSize: '18px', cursor: 'pointer' }}>Start a new table</button>

      <button onClick={handleChangeRestaurant} style={{ width: '100%', background: 'var(--color-paper)', color: 'var(--color-ink)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '14px', fontFamily: 'var(--font-body)', fontSize: '18px', cursor: 'pointer' }}>Change restaurant or menu</button>
    </div>
  );
}

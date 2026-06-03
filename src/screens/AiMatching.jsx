import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import aiMatchingDoodle from '../assets/ai-matching-doodle.png';

const mockMatch = {
  restaurant: {
    id: 1,
    name: 'The Thai Kitchen',
    address: '123 Main St, Los Angeles, CA',
    phone: '213-555-0101',
  },
  recommended_menus: [
    { id: 1, name: 'Pad Thai', price: 14.99, image_url: null },
    { id: 2, name: 'Green Curry', price: 15.99, image_url: null },
    { id: 3, name: 'Spring Rolls', price: 8.99, image_url: null },
    { id: 4, name: 'Fried Rice', price: 13.99, image_url: null },
    { id: 5, name: 'Tom Yum Soup', price: 12.99, image_url: null },
    { id: 6, name: 'Mango Sticky Rice', price: 7.99, image_url: null },
    { id: 7, name: 'Satay Chicken', price: 11.99, image_url: null },
    { id: 8, name: 'Papaya Salad', price: 9.99, image_url: null },
  ],
  estimated_total: 89.99,
};

export default function AiMatching() {
  const navigate = useNavigate();
  const store = useOrderStore();
  const [step, setStep] = useState(0);

  const steps = [
    'Matching theme...',
    'Checking restaurants...',
    'Confirming menu...',
    'Checking delivery...',
    'Almost done...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 500);

    const timer = setTimeout(() => {
      clearInterval(interval);
      store.setMatchedRestaurant(mockMatch);
      navigate('/result');
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-paper)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      gap: '32px',
      maxWidth: '400px',
      margin: '0 auto',
    }}>
      <img src={aiMatchingDoodle} alt="AI Matching" style={{ width: '220px', height: '220px', objectFit: 'contain' }} />
      <p style={{ fontFamily: 'var(--font-logo)', fontSize: '28px', textAlign: 'center' }}>
        Bill AI is building your table.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: i <= step ? 1 : 0.2, transition: 'opacity 0.4s' }}>
            <span style={{ fontSize: '16px' }}>{i <= step ? '✓' : 'O'}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-ink)' }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

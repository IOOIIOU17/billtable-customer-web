import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import api from '../services/api';
import aiMatchingDoodle from '../assets/ai-matching-doodle.png';

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
    }, 800);

    const run = async () => {
      try {
        const res = await api.post('/api/matching/find', {
          latitude: 34.0522,
          longitude: -118.2437,
          cuisine_type: store.theme,
          budget: store.budget,
          guest_count: store.guestCount,
          allergies: store.allergies,
          avoid_spicy: store.avoidSpicy,
        });
        store.setMatchedRestaurant(res.data);
      } catch (e) {
        console.log('matching error', e);
      }
      setTimeout(() => {
        clearInterval(interval);
        navigate('/result');
      }, 4500);
    };

    run();
    return () => clearInterval(interval);
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

      <img
        src={aiMatchingDoodle}
        alt="AI Matching"
        style={{
          width: '220px',
          height: '220px',
          objectFit: 'contain',
        }}
      />

      <p style={{ fontFamily: 'var(--font-logo)', fontSize: '28px', textAlign: 'center' }}>
        Bill AI is building your table.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
        {steps.map((s, i) => (
          <div key={s} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            opacity: i <= step ? 1 : 0.2,
            transition: 'opacity 0.4s',
          }}>
            <span style={{ fontSize: '16px' }}>{i <= step ? '✓' : '○'}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-ink)' }}>{s}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import api from '../services/api';
import aiMatchingDoodle from '../assets/ai-matching-doodle.png';

export default function AiMatching() {
  const navigate = useNavigate();
  const store = useOrderStore();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

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

    const runMatching = async () => {
      try {
        const res = await api.post('/api/matching/find', {
          latitude: store.latitude,
          longitude: store.longitude,
          cuisine_type: (() => {
            const knownCuisines = ['thai', 'japanese', 'sushi', 'mexican', 'italian', 'chinese'];
            const t = (store.theme || '').toLowerCase();
            return knownCuisines.includes(t) ? store.theme : null;
          })(),
          budget: store.budget || null,
          guest_count: store.guestCount || 1,
          allergies: store.allergies || [],
          avoid_spicy: store.avoidSpicy || false,
        });

        const data = res.data;

        if (data.count > 0) {
          store.setMatchedRestaurant(data.matches[0]);
          navigate('/result');
        } else {
          setError('ไม่พบร้านที่ตรงกับเงื่อนไข ลองปรับ budget หรือ theme ดูนะครับ');
        }
      } catch (err) {
        console.error('Matching error:', err);
        setError('เกิดข้อผิดพลาดในการค้นหาร้าน กรุณาลองใหม่');
      }
    };

    const timer = setTimeout(() => {
      clearInterval(interval);
      runMatching();
    }, 2000);

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

      {!error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: i <= step ? 1 : 0.2, transition: 'opacity 0.4s' }}>
              <span style={{ fontSize: '16px' }}>{i <= step ? '✓' : 'O'}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-ink)' }}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', alignItems: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', textAlign: 'center' }}>{error}</p>
          <button
            onClick={() => navigate('/time')}
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
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import budgetDoodle from '../assets/budget-doodle.png';

export default function Budget() {
  const navigate = useNavigate();
  const setBudget = useOrderStore((s) => s.setBudget);
  const [amount, setAmount] = useState('');

  const handleNext = () => {
    if (!amount || amount < 1) return;
    setBudget(Number(amount));
    navigate('/allergy');
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
        src={budgetDoodle}
        alt="Budget doodle"
        style={{
          width: '200px',
          height: '200px',
          objectFit: 'contain',
        }}
      />

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '20px', textAlign: 'center' }}>
        What is your total budget for this table?
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '28px' }}>$</span>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="500"
          style={{
            width: '140px',
            padding: '12px 16px',
            border: '2px solid var(--color-ink)',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-body)',
            fontSize: '28px',
            textAlign: 'center',
            background: 'var(--color-paper)',
            color: 'var(--color-ink)',
            outline: 'none',
          }}
        />
      </div>

      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>
        Includes food + delivery estimate.
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
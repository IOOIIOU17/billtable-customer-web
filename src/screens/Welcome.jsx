import { useNavigate } from 'react-router-dom';
import welcomeDoodle from '../assets/welcome-doodle.png';
import logo from '../assets/billtable-logo.png';

export default function Welcome() {
  const navigate = useNavigate();

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
    }}>

      <img
        src={logo}
        alt="BillTable"
        style={{
          height: '64px',
          objectFit: 'contain',
          marginBottom: '-8px',
        }}
      />

      <img
        src={welcomeDoodle}
        alt="Welcome doodle"
        style={{
          width: '280px',
          height: '280px',
          objectFit: 'contain',
        }}
      />

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '17px',
        lineHeight: '1.5',
        color: 'var(--color-pencil)',
        textAlign: 'center',
        maxWidth: '320px',
      }}>
        Those who give their best often receive the best in return.
      </p>

      <button
        onClick={() => navigate('/signup')}
        style={{
          background: 'var(--color-ink)',
          color: 'var(--color-paper)',
          border: '2px solid var(--color-ink)',
          borderRadius: 'var(--radius)',
          padding: '14px 48px',
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        Start a Table
      </button>

    </div>
  );
}

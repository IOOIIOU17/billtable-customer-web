import { useNavigate, Link } from 'react-router-dom';
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
        fontSize: '12px',
        lineHeight: '1.4',
        color: 'var(--color-pencil)',
        textAlign: 'center',
        whiteSpace: 'nowrap',
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

      <footer style={{
        marginTop: '48px',
        textAlign: 'center',
        fontFamily: 'var(--font-hint)',
        fontSize: '11px',
        color: 'var(--color-pencil)',
        lineHeight: '1.6',
      }}>
        <p style={{ margin: 0 }}>BillBeBe Inc. · 45 S Arroyo Pkwy #1119, Pasadena, CA 91105</p>
        <p style={{ margin: 0 }}>
          <Link to="/terms" style={{ color: 'var(--color-pencil)' }}>Terms of Service</Link>
          {' · '}
          <Link to="/privacy" style={{ color: 'var(--color-pencil)' }}>Privacy Policy</Link>
        </p>
      </footer>

    </div>
  );
}

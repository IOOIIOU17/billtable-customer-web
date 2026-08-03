import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AiConsent() {
  const navigate = useNavigate();

  const wrap = { minHeight: '100vh', background: 'var(--color-paper)', padding: '32px 24px', maxWidth: '500px', margin: '0 auto' };
  const h1 = { fontFamily: 'var(--font-logo)', fontSize: '32px', marginBottom: '24px' };
  const label = { fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-ink)' };
  const text = { fontFamily: 'var(--font-hint)', fontSize: '15px', color: 'var(--color-pencil)', marginBottom: '8px' };
  const section = { marginBottom: '28px' };
  const btn = { padding: '12px 24px', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '15px', cursor: 'pointer', marginTop: '8px', marginRight: '12px', border: '2px solid var(--color-ink)' };
  const btnDark = { ...btn, background: 'var(--color-ink)', color: 'var(--color-paper)' };
  const btnOutline = { ...btn, background: 'var(--color-paper)', color: 'var(--color-ink)' };

  const handleAccept = () => {
    localStorage.setItem('aiConsentGiven', 'true');
    navigate('/matching');
  };

  const handleDecline = () => {
    navigate('/time');
  };

  return (
    <div style={wrap}>
      <h1 style={h1}>BillTable AI — How your data is used</h1>

      <div style={section}>
        <p style={label}>What we share with Bill AI</p>
        <p style={text}>Theme, guest count, budget, food preferences, and delivery area — used to find and match the right restaurant for your event.</p>
      </div>

      <div style={section}>
        <p style={label}>What we don't share</p>
        <p style={text}>Your name, email, and other personal account details are never sent to the AI matching service.</p>
      </div>

      <div style={section}>
        <p style={label}>Who provides this</p>
        <p style={text}>Matching is powered by BillTable's own matching service, using the details above only.</p>
      </div>

      <div style={section}>
        <button style={btnDark} onClick={handleAccept}>
          Accept &amp; Continue
        </button>
        <button style={btnOutline} onClick={handleDecline}>
          Not Now
        </button>
      </div>
    </div>
  );
}

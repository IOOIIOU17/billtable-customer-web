import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeleteAccount() {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const wrap = { maxWidth: 800, margin: '0 auto', padding: '48px 24px', fontFamily: 'var(--font-body)', color: 'var(--color-ink)' };
  const h1 = { fontFamily: 'var(--font-logo)', fontSize: 48, marginBottom: 8 };
  const h2 = { fontSize: 28, marginBottom: 32 };
  const btnDark = { marginTop: 32, padding: '12px 32px', background: 'var(--color-ink)', color: 'var(--color-paper)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: 16, cursor: 'pointer' };

  return (
    <div style={wrap}>
      <h1 style={h1}>BillTable</h1>
      <h2 style={h2}>Delete Account</h2>

      {isLoggedIn ? (
        <>
          <p>You're logged in — you can delete your account instantly from Settings.</p>
          <button style={btnDark} onClick={() => navigate('/settings')}>
            Go to Settings
          </button>
        </>
      ) : submitted ? (
        <p>✅ Your request has been received. We will delete your account within 30 days.</p>
      ) : (
        <>
          <p>To request deletion of your account and all associated data, please email us at:</p>
          <p><strong><a href="mailto:billtable@billtable.co?subject=Account Deletion Request">billtable@billtable.co</a></strong></p>
          <p>Subject: Account Deletion Request</p>
          <p>Please include the email address associated with your account.</p>
          <p>We will process your request within 30 days.</p>
          <button style={btnDark} onClick={() => setSubmitted(true)}>
            I have sent the email
          </button>
        </>
      )}
    </div>
  );
}

import React, { useState } from 'react';

export default function DeleteAccount() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px', fontFamily: 'Patrick Hand, sans-serif', color: '#1A1A1A' }}>
      <h1 style={{ fontFamily: 'Caveat, cursive', fontSize: 48, marginBottom: 8 }}>BillTable</h1>
      <h2 style={{ fontSize: 28, marginBottom: 32 }}>Delete Account</h2>

      {submitted ? (
        <p>✅ Your request has been received. We will delete your account within 30 days.</p>
      ) : (
        <>
          <p>To request deletion of your account and all associated data, please email us at:</p>
          <p><strong><a href="mailto:billbebela@gmail.com?subject=Account Deletion Request">billbebela@gmail.com</a></strong></p>
          <p>Subject: Account Deletion Request</p>
          <p>Please include the email address associated with your account.</p>
          <p>We will process your request within 30 days.</p>
          <button
            onClick={() => setSubmitted(true)}
            style={{ marginTop: 32, padding: '12px 32px', background: '#1A1A1A', color: '#FEFEFE', border: 'none', borderRadius: 16, fontFamily: 'Patrick Hand, sans-serif', fontSize: 16, cursor: 'pointer' }}
          >
            I have sent the email
          </button>
        </>
      )}
    </div>
  );
}

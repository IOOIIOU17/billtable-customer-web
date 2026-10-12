import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Google Play account-deletion page (billtable.co/delete). Must name the app
// and developer as on the store listing, give the steps, say what is deleted
// and what is kept, and offer a way to ask without the app. Keep in step
// with billtable-customer-native app/(public)/delete.jsx and with what the
// backend really does (DELETE /api/auth/account, restaurantService.js).
export default function DeleteAccount() {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  let isLoggedIn = false;
  try { isLoggedIn = !!localStorage.getItem('token'); } catch (e) { isLoggedIn = false; }

  const wrap = { maxWidth: 800, margin: '0 auto', padding: '48px 24px', fontFamily: 'var(--font-body)', color: 'var(--color-ink)' };
  const h1 = { fontFamily: 'var(--font-logo)', fontSize: 48, marginBottom: 8 };
  const h2 = { fontSize: 28, marginBottom: 32 };
  const btnDark = { marginTop: 32, padding: '12px 32px', background: 'var(--color-ink)', color: 'var(--color-paper)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: 16, cursor: 'pointer' };

  if (submitted) {
    return (
      <div style={wrap}>
        <h1 style={h1}>TigTagTrue</h1>
        <h2 style={h2}>Delete Account</h2>
        <p>Thanks — we&apos;ll reply by email.</p>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <h1 style={h1}>TigTagTrue</h1>
      <h2 style={h2}>Delete Account</h2>

      <p>How to delete your account in <strong>TigTagTrue by BillBeBe Inc.</strong> — the TigTagTrue app, and TigTagTrue Orders for restaurant partners.</p>

      <h3>Delete in the app</h3>
      <ul>
        <li>Customers: open TigTagTrue → tap the settings icon at the top of My TigTagTrue Day → Delete My Account. Your account is deleted right away.</li>
        <li>Restaurants: open TigTagTrue Orders → Settings → Delete restaurant account. New orders stop right away, you can finish open orders, and your account and data are deleted after 30 days. You can cancel before then.</li>
      </ul>

      <h3>Or ask us by email</h3>
      <p>Email <strong><a href="mailto:support@tigtagtrue.com?subject=Account%20Deletion%20Request">support@tigtagtrue.com</a></strong> with the subject &quot;Account Deletion Request&quot; and the email address of your account. We will process your request within 30 days.</p>

      <h3>What gets deleted (TigTagTrue)</h3>
      <ul>
        <li>Your account: name, email and password</li>
        <li>Your important days and their stories</li>
        <li>Your close friends, friend codes, the notes on your stories and the notes you left for friends</li>
        <li>Party chat messages you wrote</li>
        <li>Party photos you added</li>
        <li>Your saved delivery addresses</li>
        <li>Push notification tokens</li>
        <li>Birthdays you saved</li>
        <li>For parties you hosted: the chat, photos, guest list and plans, and the delivery address, comments, allergies and review text on the order</li>
        <li>Your place in parties you joined, and the reports and blocks you made</li>
      </ul>

      <h3>What is kept (TigTagTrue)</h3>
      <ul>
        <li>Orders for parties you hosted (what was ordered, the amounts, the star rating, and the type and status of any problem report) are kept for 1 year without your name or contact details, for accounting and for the restaurant that cooked them, and then deleted. An order that is still open is cancelled.</li>
        <li>A party you joined as a guest stays with its host, without your name, messages or photos.</li>
        <li>Our security log keeps a record of some actions (such as a table booking) without your name, email or IP address.</li>
      </ul>

      <h3>Restaurant accounts (TigTagTrue Orders)</h3>
      <ul>
        <li>After 30 days we delete the menu, menu and storefront photos, opening hours, profile, phone, email and street address, and the push tokens of your phones. The login is anonymised and can no longer sign in.</li>
        <li>Any order still open at that time is cancelled and the customer is told.</li>
        <li>Order records are kept as tax records, showing the restaurant name but no personal contact details.</li>
      </ul>

      {isLoggedIn ? (
        <button style={btnDark} onClick={() => navigate('/settings')}>
          Go to Settings
        </button>
      ) : (
        <button style={btnDark} onClick={() => setSubmitted(true)}>
          I have sent the email
        </button>
      )}
    </div>
  );
}

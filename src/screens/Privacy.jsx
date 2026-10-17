import React from 'react';

export default function Privacy() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px', fontFamily: 'Patrick Hand, sans-serif', color: '#1A1A1A' }}>
      <h1 style={{ fontFamily: 'Caveat, cursive', fontSize: 48, marginBottom: 8 }}>TigTagTrue</h1>
      <h2 style={{ fontSize: 28, marginBottom: 8 }}>Privacy Policy</h2>
      <p style={{ color: '#4A4A4A', marginBottom: 32 }}>Last updated: October 17, 2026</p>

      <h3>Company</h3>
      <p>TigTagTrue is operated by <strong>BillBeBe Inc.</strong>, a Delaware corporation located at 45 S Arroyo Pkwy #1119, Pasadena, CA 91105.</p>

      <h3>Information We Collect</h3>
      <p>We collect: email, name, phone number, location (GPS), order history, delivery address, party chat messages, ratings and reviews you write, and party photos you add (the party cover and the Memory album). Party photos are visible only to the host and guests of that party and are deleted 24 hours after the party ends.</p>
      <p>When you sign up, we email you a 6-digit code to confirm your email address. We keep only a scrambled (hashed) copy of the code, and it stops working after 15 minutes.</p>

      <h3>My TigTagTrue Day</h3>
      <p>When you add an important day, we keep a first name, the date (the year only if you add it), what kind of day it is, a theme, when to remind you, and that person&apos;s favorite color, song, animal and place if you add them, and any photos you add to a day. We also keep the stories you write about your days, the notes close friends leave on them, and your list of close friends.</p>

      <h3>Stories and Close Friends</h3>
      <p>Every story is private when you write it: only you can see it. You can open a story to your close friends, to read it or to read it and add notes. Close friends are only the people who used a friend code you made, or whose code you used; there can be at most 10, and you can remove any of them at any time. Removing a friend also removes their notes on your stories. Stories and notes are stored encrypted.</p>

      <h3>Restaurant Partners</h3>
      <p>If you run a restaurant on TigTagTrue (the TigTagTrue Orders app), we collect: business name, owner name, email, phone, business address, menu and storefront photos, opening hours, order and sales data, and the push token of the phone that receives order alerts. We use this to run your orders, show your restaurant to customers, and build your sales reports.</p>
      <p>To delete a restaurant account, go to Settings → Delete restaurant account in the TigTagTrue Orders app. Your restaurant stops taking new orders right away, you can finish open orders, and you can cancel within 30 days. After 30 days the account and its data are removed. Order records are kept for tax purposes, without personal contact details.</p>

      <h3>How We Use Your Information</h3>
      <p>We use your information to process orders, match restaurants, deliver food, remind you before your important days, and show your stories only to the people you choose. We do not sell your information, and we do not use your stories or notes for advertising.</p>

      <h3>Third Parties We Share With</h3>
      <ul>
        <li>Stripe — payment processing</li>
        <li>Cloudinary — storing party photos</li>
        <li>Cloudflare R2 — storing the photos you add to your important days</li>
        <li>Expo — sending push notifications</li>
        <li>U.S. Census Bureau Geocoder and OpenStreetMap Nominatim — turning a typed address into a map point (only the address is sent)</li>
        <li>Sentry — error reports so we can fix problems</li>
        <li>Google (Gmail) — sending emails such as receipts and password resets</li>
        <li>Render — hosting our servers and database</li>
        <li>QR Server (api.qrserver.com, by goqr.me) — making the QR code for a party invite (it receives only the join link, no names or emails)</li>
      </ul>

      <h3>Data Retention</h3>
      <p>Your account, important days, stories and notes are kept until you delete them or delete your account, and your order history stays in your account while you have one. When you delete your account, the orders you hosted are kept for 1 year without your name or contact details (no address, comments, allergies or review text), for accounting and for the restaurants that cooked them, and then deleted. Party chat is deleted 1 day after the party starts, and party photos 24 hours after the party ends.</p>
      <p>Backups: we keep encrypted backups of our database for up to 95 days so we can recover from accidents. When you delete your account, your information is removed from the live service right away and disappears from backups within 95 days. If we ever restore a backup, we delete your information again.</p>

      <h3>Children</h3>
      <p>TigTagTrue is for people 13 and older. We do not knowingly collect information from children under 13. If you believe a child has created an account, contact us and we will delete it.</p>

      <h3>If the Company Changes Hands</h3>
      <p>If BillBeBe Inc. is merged, acquired or sells its business, your information may move with it, and this policy will keep protecting it. We will tell you before that happens.</p>

      <h3>Your Rights</h3>
      <p>You may request deletion of your account and its data at any time. You can delete your account directly in the app, or submit a request at <a href="https://billtable.co/delete">billtable.co/delete</a>. Deleting your account removes your important days, stories, notes, close friends, the party chat messages you wrote, and your party photos. Orders you hosted are kept for 1 year without your name or contact details, as described under Data Retention.</p>

      <h3>Contact</h3>
      <p>BillBeBe Inc. · 45 S Arroyo Pkwy #1119, Pasadena, CA 91105<br />
      Email: <a href="mailto:support@tigtagtrue.com">support@tigtagtrue.com</a></p>
    </div>
  );
}

import React from 'react';

export default function Privacy() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px', fontFamily: 'Patrick Hand, sans-serif', color: '#1A1A1A' }}>
      <h1 style={{ fontFamily: 'Caveat, cursive', fontSize: 48, marginBottom: 8 }}>BillTable</h1>
      <h2 style={{ fontSize: 28, marginBottom: 32 }}>Privacy Policy</h2>
      <p style={{ color: '#4A4A4A', marginBottom: 32 }}>Last updated: June 28, 2026</p>

      <h3>Information We Collect</h3>
      <p>We collect: email, name, phone number, location (GPS), order history, and delivery address.</p>

      <h3>How We Use Your Information</h3>
      <p>We use your information to: process orders, match restaurants, and deliver food.</p>

      <h3>Third Parties We Share With</h3>
      <ul>
        <li>Stripe — payment processing</li>
        <li>Cloudinary — food images</li>
        <li>LocationIQ — geocoding</li>
      </ul>

      <h3>Data Retention</h3>
      <p>We retain your data for 1 year after your last order.</p>

      <h3>Your Rights</h3>
      <p>You may request deletion of your account and all associated data at any time. You can delete your account directly in the app, or submit a request at <a href="https://billtable.co/delete">billtable.co/delete</a>.</p>

      <h3>Contact</h3>
      <p>Email: <a href="mailto:billbebela@gmail.com">billbebela@gmail.com</a></p>
    </div>
  );
}

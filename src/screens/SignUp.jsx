import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/billtable-logo.png';

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.email) return;
    navigate('/theme');
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid var(--color-ink)',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    background: 'var(--color-paper)',
    color: 'var(--color-ink)',
    outline: 'none',
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
      gap: '20px',
      maxWidth: '400px',
      margin: '0 auto',
    }}>

      <img
        src={logo}
        alt="BillTable"
        style={{
          height: '56px',
          objectFit: 'contain',
        }}
      />

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '20px', textAlign: 'center' }}>
        Let's save your table first.
      </p>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input style={inputStyle} name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input style={inputStyle} name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input style={inputStyle} name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      </div>
      <button
        onClick={handleSubmit}
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
        Send code
      </button>
    </div>
  );
}
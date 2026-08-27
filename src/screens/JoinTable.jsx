import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useOrderStore from '../store/orderStore';

const NAME_KEY = 'billtable_my_name';

const inputStyle = {
  width: '100%', padding: '16px',
  fontFamily: 'var(--font-body)', fontSize: '16px',
  border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
  background: 'var(--color-paper)', color: 'var(--color-ink)',
  outline: 'none', boxSizing: 'border-box',
};

const buttonStyle = (filled) => ({
  width: '100%',
  background: filled ? 'var(--color-ink)' : 'var(--color-paper)',
  color: filled ? 'var(--color-paper)' : 'var(--color-ink)',
  border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
  padding: '16px', fontFamily: 'var(--font-body)', fontSize: '17px', cursor: 'pointer',
});

// JoinTable — where a QR code / invite link lands. This is NOT the normal
// 13-step ordering flow: the table already exists, so a guest just needs
// an account (quick Sign Up or Log In, no theme/budget/menu questions)
// and then goes straight to the live Table Home.
export default function JoinTable() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const setCurrentOrderId = useOrderStore((s) => s.setCurrentOrderId);
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already have an account on this device from an earlier visit? Skip
  // straight to the table instead of asking them to sign up again.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentOrderId(Number(orderId));
      navigate('/table');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!form.email || !form.password || (mode === 'signup' && !form.name)) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'signup' ? '/api/auth/register' : '/api/auth/login';
      const body = mode === 'signup'
        ? { name: form.name, email: form.email, password: form.password, role: 'customer' }
        : { email: form.email, password: form.password };
      const res = await api.post(endpoint, body);
      const token = res.data?.accessToken || res.data?.data?.token || res.data?.token;
      if (!token) {
        setError('No token received. Please try again.');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', token);
      if (mode === 'signup' && form.name) {
        try { localStorage.setItem(NAME_KEY, form.name); } catch { /* ignore */ }
      }
      setCurrentOrderId(Number(orderId));
      navigate('/table');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-paper)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px', gap: '16px', maxWidth: '400px', margin: '0 auto',
    }}>
      <p style={{ fontFamily: 'var(--font-logo)', fontSize: '32px', textAlign: 'center', margin: 0 }}>
        You're invited to a table.
      </p>
      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', textAlign: 'center', margin: '0 0 8px' }}>
        {mode === 'signup'
          ? 'Quick sign up to join — just your name, email, and a password. No forms about the party, that part is already done.'
          : 'Log in to join the table.'}
      </p>

      {mode === 'signup' && (
        <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
      )}
      <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        style={inputStyle}
      />

      {error && <p style={{ color: 'crimson', fontFamily: 'var(--font-hint)', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

      <button onClick={handleSubmit} disabled={loading} style={buttonStyle(true)}>
        {loading ? 'Joining...' : mode === 'signup' ? 'Join the table →' : 'Log in →'}
      </button>

      <p
        onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); }}
        style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', cursor: 'pointer', textDecoration: 'underline', margin: 0 }}
      >
        {mode === 'signup' ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </p>
    </div>
  );
}

import { useState } from 'react';
import { subscribePush } from '../services/pushNotification';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import billTableLogo from '../assets/billtable-logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'customer'
      });
      const token = res.data?.accessToken || res.data?.data?.token || res.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        subscribePush(api, 'customer');
        navigate('/theme');
      } else {
        setError('No token received. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '16px',
    fontFamily: "'Patrick Hand', cursive", fontSize: '16px',
    border: '1.5px solid #1A1A1A', borderRadius: '12px',
    background: '#FEFEFE', color: '#1A1A1A',
    outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FEFEFE', maxWidth: '480px', margin: '0 auto', padding: '24px', fontFamily: "'Patrick Hand', cursive", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      <div style={{ textAlign: 'center', marginBottom: '32px', width: '100%' }}>
        <img src={billTableLogo} alt="BillTable" style={{ height: '64px', objectFit: 'contain', display: 'block', margin: '0 auto 8px' }} />
        <p style={{ fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#999', margin: 0 }}>Create your account</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px', width: '100%' }}>
        <input type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
        <input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
        <input type="tel" placeholder="Phone number (for OTP verification)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} />
      </div>

      <p style={{ fontFamily: "'Kalam', cursive", fontSize: '12px', color: '#999', width: '100%', marginBottom: '16px', lineHeight: '1.6' }}>
        Password must be 8-10 characters, include uppercase, lowercase, number, and special character (e.g. !@#$%)
      </p>

      {error && <p style={{ color: 'red', fontFamily: "'Kalam', cursive", fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}

      <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#999' : '#1A1A1A', color: '#FEFEFE', border: 'none', borderRadius: '12px', fontFamily: "'Caveat', cursive", fontSize: '1.2rem', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '1px', marginBottom: '16px' }}>
        {loading ? 'Please wait...' : 'Create Account →'}
      </button>

      <p style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#999', textAlign: 'center', margin: 0 }}>
        Already have an account?{' '}
        <span onClick={() => navigate('/signup')} style={{ color: '#1A1A1A', cursor: 'pointer', textDecoration: 'underline' }}>
          Login
        </span>
      </p>

    </div>
  );
}

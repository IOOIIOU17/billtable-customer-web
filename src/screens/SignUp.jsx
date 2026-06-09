import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import billTableLogo from '../assets/billtable-logo.png';

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'customer'
      });
      if (res.data?.accessToken) {
        localStorage.setItem('token', res.data.accessToken);
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
      
      <div style={{ textAlign: 'center', marginBottom: '40px', width: '100%' }}>
        <img src={billTableLogo} alt="BillTable" style={{ height: '64px', objectFit: 'contain', display: 'block', margin: '0 auto 8px' }} />
        <p style={{ fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#999', margin: 0 }}>
          Let's save your table first.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', width: '100%' }}>
        <input type="text" placeholder="Your name" value={form.name} onChange={handleChange('name')} style={inputStyle} />
        <input type="email" placeholder="Email address" value={form.email} onChange={handleChange('email')} style={inputStyle} />
        <input type="password" placeholder="Password" value={form.password} onChange={handleChange('password')} style={inputStyle} />
      </div>

      {error ? <p style={{ color: 'red', fontFamily: "'Kalam', cursive", fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error}</p> : null}

      <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#999' : '#1A1A1A', color: '#FEFEFE', border: 'none', borderRadius: '12px', fontFamily: "'Caveat', cursive", fontSize: '1.2rem', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '1px' }}>
        {loading ? 'Please wait...' : "Let's go"}
      </button>

      <p style={{ fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#999', textAlign: 'center', marginTop: '24px' }}>
        Already have an account?{' '}
        <span onClick={() => navigate('/login')} style={{ color: '#1A1A1A', cursor: 'pointer', textDecoration: 'underline' }}>
          Login
        </span>
      </p>

    </div>
  );
}

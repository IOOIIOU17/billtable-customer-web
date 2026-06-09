import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import billTableLogo from '../assets/billtable-logo.png';

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', {
        email: form.email,
        password: form.password,
      });
      const token = res.data?.accessToken || res.data?.data?.token || res.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        navigate('/theme');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
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
        <p style={{ fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#999', margin: 0 }}>Let's save your table first.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px', width: '100%' }}>
        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          style={inputStyle}
        />
      </div>

      {error && <p style={{ color: 'red', fontFamily: "'Kalam', cursive", fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}

      <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#999' : '#1A1A1A', color: '#FEFEFE', border: 'none', borderRadius: '12px', fontFamily: "'Caveat', cursive", fontSize: '1.2rem', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '1px', marginBottom: '16px' }}>
        {loading ? 'Please wait...' : "Let's go"}
      </button>

      <p onClick={() => alert('Forgot Password — coming soon in OTP phase')} style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#999', textAlign: 'center', margin: '0 0 24px 0', cursor: 'pointer', textDecoration: 'underline' }}>
        Forgot password?
      </p>

      <div style={{ width: '100%', borderTop: '1px solid #E8E8E8', paddingTop: '24px' }}>
        <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '16px', background: '#FEFEFE', color: '#1A1A1A', border: '1.5px solid #1A1A1A', borderRadius: '12px', fontFamily: "'Caveat', cursive", fontSize: '1.2rem', cursor: 'pointer', letterSpacing: '1px' }}>
          Create Account
        </button>
      </div>

    </div>
  );
}

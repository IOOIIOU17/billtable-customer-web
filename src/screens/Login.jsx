import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/login', {
        email: form.email,
        password: form.password,
      });
      const token = res.data.data?.token || res.data.token;
      if (token) {
        localStorage.setItem('token', token);
        navigate('/theme');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', maxWidth: '400px', margin: '0 auto', gap: '24px' }}>
      
      <h1 style={{ fontFamily: 'var(--font-logo)', fontSize: '36px', color: 'var(--color-ink)', textAlign: 'center', margin: 0 }}>
        Welcome back.
      </h1>

      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', textAlign: 'center', margin: 0 }}>
        Table first. Food follows.
      </p>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ width: '100%', padding: '14px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '16px', background: 'var(--color-paper)', outline: 'none', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', padding: '14px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '16px', background: 'var(--color-paper)', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: '#cc0000', textAlign: 'center', margin: 0 }}>
          {error}
        </p>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ width: '100%', padding: '16px', background: 'var(--color-ink)', color: 'var(--color-paper)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '18px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Logging in...' : 'Login →'}
      </button>

      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', textAlign: 'center', margin: 0 }}>
        Don't have an account?{' '}
        <span onClick={() => navigate('/signup')} style={{ color: 'var(--color-ink)', cursor: 'pointer', textDecoration: 'underline' }}>
          Sign up
        </span>
      </p>

    </div>
  );
}

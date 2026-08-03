import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    const fetchUser = async () => {
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data.data);
      } catch (err) {
        setError('Could not load account info.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      // proceed with local logout even if server call fails
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError('');
    try {
      await api.delete('/api/auth/account');
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      setError('Something went wrong deleting your account. Please try again or contact support.');
      setDeleting(false);
    }
  };

  const wrap = { minHeight: '100vh', background: 'var(--color-paper)', padding: '32px 24px', maxWidth: '500px', margin: '0 auto' };
  const headerRow = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' };
  const backBtn = { padding: '8px 16px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer', background: 'var(--color-paper)' };
  const h1 = { fontFamily: 'var(--font-logo)', fontSize: '28px' };
  const section = { marginBottom: '32px' };
  const label = { fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-ink)' };
  const text = { fontFamily: 'var(--font-hint)', fontSize: '15px', color: 'var(--color-pencil)' };
  const btn = { padding: '12px 24px', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer', marginTop: '12px', marginRight: '12px', border: '2px solid var(--color-ink)' };
  const btnDark = { ...btn, background: 'var(--color-ink)', color: 'var(--color-paper)' };
  const btnOutline = { ...btn, background: 'var(--color-paper)', color: 'var(--color-ink)' };
  const btnDanger = { ...btn, background: 'var(--color-paper)', color: '#B00020', border: '2px solid #B00020' };
  const btnDangerConfirm = { ...btn, background: '#B00020', color: 'var(--color-paper)', border: '2px solid #B00020' };

  if (loading) {
    return (
      <div style={wrap}>
        <p style={text}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={headerRow}>
        <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>
        <h1 style={h1}>Settings</h1>
      </div>

      {error && <p style={{ ...text, color: '#B00020' }}>{error}</p>}

      <div style={section}>
        <p style={label}>Account</p>
        <p style={text}>Name: {user?.name || '-'}</p>
        <p style={text}>Email: {user?.email || '-'}</p>
      </div>

      <div style={section}>
        <p style={label}>Privacy</p>
        <p style={text}><a href="/privacy" style={{ color: 'var(--color-ink)' }}>Privacy Policy</a></p>
      </div>

      <div style={section}>
        <p style={label}>Delete My Account</p>
        {!confirmDelete ? (
          <>
            <p style={text}>This will permanently delete your account and all order history. This cannot be undone.</p>
            <button style={btnDanger} onClick={() => setConfirmDelete(true)}>
              Delete My Account
            </button>
          </>
        ) : (
          <>
            <p style={{ ...text, fontWeight: 'bold' }}>Are you sure? This action is permanent and cannot be undone.</p>
            <button style={btnDangerConfirm} onClick={handleDeleteAccount} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Yes, permanently delete my account'}
            </button>
            <button style={btnOutline} onClick={() => setConfirmDelete(false)} disabled={deleting}>
              Cancel
            </button>
          </>
        )}
      </div>

      <div style={section}>
        <p style={label}>App</p>
        <button style={btnDark} onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}

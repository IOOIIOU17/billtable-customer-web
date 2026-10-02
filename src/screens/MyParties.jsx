import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useOrderStore from '../store/orderStore';
import { formatPartyDate } from '../utils/partyTime';

// My Parties -- where a returning customer lands after Log in (same screen
// as the native app's My Parties). Just the parties they have had: the
// most recent is "Last Party", each shows its theme. Tapping one opens
// that party's Table Home; once a party is over, Table Home is read-only
// (no Chat/Invite). Header has Logout and "+ New Order" only -- no
// Settings button here, per Tony (2026-10-02).
export default function MyParties() {
  const navigate = useNavigate();
  const store = useOrderStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/orders');
      // API shape is { status: 'OK', data: [...] }
      const list = res.data?.data ?? res.data?.orders;
      setOrders(Array.isArray(list) ? list : []);
    } catch (e) {
      setError('Could not load your parties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const openParty = (orderId) => {
    store.setCurrentOrderId(orderId);
    navigate('/table');
  };

  const openNewOrder = () => {
    store.reset();
    navigate('/theme');
  };

  const handleLogout = async () => {
    try { await api.post('/api/auth/logout'); } catch { /* log out locally anyway */ }
    localStorage.removeItem('token');
    store.reset();
    navigate('/login');
  };

  const btn = { padding: '8px 14px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', padding: '32px 24px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontFamily: 'var(--font-logo)', fontSize: '28px', color: 'var(--color-ink)' }}>BillTable</span>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-pencil)', textDecoration: 'underline', cursor: 'pointer' }}>Logout</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-body)', fontSize: '26px', margin: 0 }}>My Parties</h1>
        <button onClick={openNewOrder} style={{ ...btn, background: 'var(--color-ink)', color: 'var(--color-paper)' }}>+ New Order</button>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-hint)', color: 'var(--color-pencil)' }}>Loading...</p>
      ) : error ? (
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <p style={{ fontFamily: 'var(--font-hint)', color: 'var(--color-pencil)' }}>{error}</p>
          <button onClick={fetchOrders} style={{ ...btn, marginTop: '16px', background: 'var(--color-ink)', color: 'var(--color-paper)' }}>Try again</button>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '16px', color: 'var(--color-pencil)' }}>No parties yet</p>
          <button onClick={openNewOrder} style={{ ...btn, marginTop: '16px', background: 'var(--color-ink)', color: 'var(--color-paper)' }}>Open a Table</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map((o, i) => (
            <button
              key={o.id}
              onClick={() => openParty(o.id)}
              style={{ textAlign: 'left', width: '100%', padding: '16px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', background: 'var(--color-paper)', cursor: 'pointer' }}
            >
              <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)' }}>
                {i === 0 ? 'Last Party' : 'Party'}{formatPartyDate(o.delivery_time) ? ` · ${formatPartyDate(o.delivery_time)}` : ''}
              </p>
              <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--color-ink)', textTransform: 'capitalize' }}>
                {o.theme || 'My Party'}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';

export default function MatchingResult() {
  const navigate = useNavigate();
  const store = useOrderStore();
  const matches = store.matches || [];

  useEffect(() => {
    if (!matches.length) {
      navigate('/matching');
    }
  }, []);

  const handleFind = () => navigate('/matching');
  const handleEdit = () => navigate('/edit-menu');

  return (
    <div style={{ minHeight: '100vh', background: '#FEFEFE', fontFamily: "'Patrick Hand', sans-serif", padding: '24px 16px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <img src="/src/assets/billtable-logo.png" alt="BillTable" style={{ height: '40px' }} />
      </div>

      {/* Title */}
      <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '1.8rem', fontWeight: '700', color: '#1A1A1A', textAlign: 'center', margin: '0 0 8px' }}>
        Your Table is Ready
      </h1>
      <p style={{ textAlign: 'center', color: '#4A4A4A', fontSize: '14px', marginBottom: '28px' }}>
        Bill AI found the best match for your event
      </p>

      {/* Match Cards */}
      {matches.map((r, i) => (
        <div key={i} style={{ border: '2px solid #1A1A1A', borderRadius: '16px', padding: '20px', marginBottom: '16px', background: '#fff' }}>

          {/* Restaurant + Menus */}
          <div style={{ padding: '0 28px', display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '28px' }}>

            {/* Left: Restaurant Info */}
            <div style={{ flex: '0 0 auto', width: '44%' }}>
              <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: '1.5rem', fontWeight: '700', color: '#1A1A1A', margin: '0 0 4px' }}>
                {r.restaurant?.name || r.name}
              </h2>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {[store.theme, 'Casual', 'Family Friendly'].filter(Boolean).map((tag, i) => (
                  <span key={i} style={{ border: '1.5px solid #1A1A1A', borderRadius: '20px', padding: '1px 10px', fontSize: '11px', fontFamily: "'Kalam', cursive", color: '#1A1A1A', whiteSpace: 'nowrap' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>{store.guestCount || '-'} people</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>${store.budget || '-'} budget</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>~1.5 hr estimated duration</p>
              </div>
            </div>

            {/* Right: Menu Items */}
            <div style={{ flex: 1 }}>
              {(r.recommended_menus || r.menus || []).slice(0, 3).map((menu, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid #1A1A1A', background: '#f5f5f5', flexShrink: 0, overflow: 'hidden' }}>
                    {menu.image_url && <img src={menu.image_url} alt={menu.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#1A1A1A' }}>{menu.name}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#4A4A4A' }}>${menu.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button
              onClick={handleEdit}
              style={{ flex: 1, padding: '10px', border: '2px solid #1A1A1A', borderRadius: '12px', background: '#fff', fontFamily: "'Patrick Hand', sans-serif", fontSize: '14px', cursor: 'pointer' }}>
              Edit Menu
            </button>
            <button
              onClick={handleFind}
              style={{ flex: 1, padding: '10px', border: '2px solid #1A1A1A', borderRadius: '12px', background: '#1A1A1A', color: '#fff', fontFamily: "'Patrick Hand', sans-serif", fontSize: '14px', cursor: 'pointer' }}>
              Find
            </button>
          </div>

        </div>
      ))}

    </div>
  );
}

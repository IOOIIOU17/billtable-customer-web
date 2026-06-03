import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import tableIllustration from '../assets/table-illustration.png';

export default function MatchingResult() {
  const navigate = useNavigate();
  const store = useOrderStore();
  const match = store.matchedRestaurant;

  useEffect(() => {
    if (!match) navigate('/');
  }, []);

  if (!match) return null;

  const restaurant = match.restaurant || match;
  const menus = match.recommended_menus || match.menus || [];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FEFEFE',
      maxWidth: '480px',
      margin: '0 auto',
      fontFamily: "'Patrick Hand', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* รูปโต๊ะ — เต็มความกว้าง ด้านบน */}
      <div style={{ width: '100%', background: '#F5F5F5' }}>
        <img src={tableIllustration} alt="Table" style={{ width: '100%', objectFit: 'contain', display: 'block' }} />
      </div>

      {/* Content ด้านล่าง */}
      <div style={{ padding: '24px' }}>

        {/* ชื่อและ subtitle */}
        <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2.4rem', fontWeight: '700', color: '#1A1A1A', margin: '0 0 4px', lineHeight: 1.1 }}>
          your table<br />is ready
        </h1>
        <p style={{ fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#4A4A4A', margin: '0 0 16px' }}>
          We found the perfect place for your {store.theme || 'event'}.
        </p>

        {/* ชื่อร้าน + tags + info || เมนู */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>

          {/* ซ้าย — ร้าน */}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: '1.4rem', fontWeight: '700', color: '#1A1A1A', margin: '0 0 8px' }}>
              {restaurant.name || 'Your Restaurant'}
            </h2>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {[store.theme, 'Casual', 'Family Friendly'].filter(Boolean).map((tag, i) => (
                <span key={i} style={{ border: '1.5px solid #1A1A1A', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontFamily: "'Kalam', cursive" }}>
                  {tag}
                </span>
              ))}
            </div>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#333' }}>👥 {store.guestCount || '-'} people</p>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#333' }}>💵 ${store.budget || '-'} budget</p>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#333' }}>🕐 ~1.5 hr estimated duration</p>
            {restaurant.address && <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>📍 {restaurant.address}</p>}
          </div>

          {/* ขวา — เมนู */}
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Kalam', cursive", fontSize: '12px', color: '#4A4A4A', textAlign: 'right', margin: '0 0 8px' }}>
              recommended for your table
            </p>
            {menus.slice(0, 5).map((menu, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1.5px solid #1A1A1A', background: '#f5f5f5', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {menu.image_url
                    ? <img src={menu.image_url} alt={menu.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '18px' }}>🍽</span>}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1A1A1A' }}>{menu.name}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#4A4A4A' }}>${menu.price}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ปุ่ม */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/edit-menu')}
            style={{ flex: 1, padding: '14px', border: '2px solid #1A1A1A', borderRadius: '14px', background: '#fff', fontFamily: "'Patrick Hand', sans-serif", fontSize: '16px', cursor: 'pointer' }}>
            Edit
          </button>
          <button onClick={() => navigate('/community')}
            style={{ flex: 1, padding: '14px', border: '2px solid #1A1A1A', borderRadius: '14px', background: '#1A1A1A', color: '#fff', fontFamily: "'Patrick Hand', sans-serif", fontSize: '16px', cursor: 'pointer', fontWeight: '600' }}>
            Perfect
          </button>
          <button onClick={() => navigate('/matching')}
            style={{ flex: 1, padding: '14px', border: '2px solid #1A1A1A', borderRadius: '14px', background: '#fff', fontFamily: "'Patrick Hand', sans-serif", fontSize: '16px', cursor: 'pointer' }}>
            Find
          </button>
        </div>

      </div>
    </div>
  );
}

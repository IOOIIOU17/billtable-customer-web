import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import tableIllustration from '../assets/table-illustration.png';

export default function MatchingResult() {
  const navigate = useNavigate();
  const store = useOrderStore();
  const match = store.matchedRestaurant;

  useEffect(() => {
    if (!match) navigate('/matching');
  }, []);

  if (!match) return null;

  const restaurant = match.restaurant || match;
  const menus = match.recommended_menus || match.menus || [];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FEFEFE',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      fontFamily: "'Patrick Hand', sans-serif",
    }}>

      <div style={{ width: '100%', maxWidth: '400px' }}>

        <p style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#4A4A4A', margin: '0 0 4px' }}>
          we found the perfect place
        </p>

        <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2.2rem', fontWeight: '700', color: '#1A1A1A', margin: '0 0 8px', lineHeight: 1.1 }}>
          your table<br />is ready
        </h1>

        <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: '1.4rem', fontWeight: '700', color: '#1A1A1A', margin: '0 0 4px' }}>
          {restaurant.name}
        </h2>

        <p style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#4A4A4A', margin: '0 0 20px' }}>
          We found the perfect place for your {store.theme || 'event'}.
        </p>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={tableIllustration} alt="Table" style={{ width: '100%', maxWidth: '280px', objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {[store.theme, 'Casual', 'Family Friendly'].filter(Boolean).map((tag, i) => (
            <span key={i} style={{ border: '1.5px solid #1A1A1A', borderRadius: '20px', padding: '2px 12px', fontSize: '12px', fontFamily: "'Kalam', cursive" }}>
              {tag}
            </span>
          ))}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#333' }}>{store.guestCount || '-'} people</p>
          <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#333' }}>${store.budget || '-'} budget</p>
          <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#333' }}>~1.5 hr estimated duration</p>
          {restaurant.address && <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>{restaurant.address}</p>}
        </div>

        {menus.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontFamily: "'Kalam', cursive", fontSize: '12px', color: '#4A4A4A', textAlign: 'right', margin: '0 0 8px' }}>
              recommended for your table
            </p>
            {menus.slice(0, 5).map((menu, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid #1A1A1A', background: '#f5f5f5', flexShrink: 0, overflow: 'hidden' }}>
                  {menu.image_url && <img src={menu.image_url} alt={menu.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1A1A1A' }}>{menu.name}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#4A4A4A' }}>${menu.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/edit-menu')}
            style={{ flex: 1, padding: '12px', border: '2px solid #1A1A1A', borderRadius: '14px', background: '#fff', fontFamily: "'Patrick Hand', sans-serif", fontSize: '15px', cursor: 'pointer' }}>
            Edit
          </button>
          <button onClick={() => navigate('/community')}
            style={{ flex: 1, padding: '12px', border: '2px solid #1A1A1A', borderRadius: '14px', background: '#1A1A1A', color: '#fff', fontFamily: "'Patrick Hand', sans-serif", fontSize: '15px', cursor: 'pointer', fontWeight: '600' }}>
            Perfect
          </button>
          <button onClick={() => navigate('/matching')}
            style={{ flex: 1, padding: '12px', border: '2px solid #1A1A1A', borderRadius: '14px', background: '#fff', fontFamily: "'Patrick Hand', sans-serif", fontSize: '15px', cursor: 'pointer' }}>
            Find
          </button>
        </div>

      </div>
    </div>
  );
}

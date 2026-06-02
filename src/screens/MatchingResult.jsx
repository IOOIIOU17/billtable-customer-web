import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import api from '../services/api';
import tableImg from '../assets/table-illustration.png';

export default function MatchingResult() {
  const navigate = useNavigate();
  const store = useOrderStore();
  const r = store.matchedRestaurant;

  const handleChangeRestaurant = async () => {
    try {
      const res = await api.post('/api/matching/find', {
        latitude: 34.0522, longitude: -118.2437,
        cuisine_type: store.theme, budget: store.budget,
        guest_count: store.guestCount, allergies: store.allergies,
        avoid_spicy: store.avoidSpicy,
        exclude_restaurant: r?.restaurant_id || r?.id,
      });
      store.setMatchedRestaurant(res.data);
    } catch (e) { console.log(e); }
  };

  if (!r) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Patrick Hand', cursive" }}>
      <p>ไม่พบข้อมูล กรุณาเริ่มใหม่</p>
    </div>
  );

  const menus = r.menus || r.recommended_menus || [];

  return (
    <div style={{ minHeight: '100vh', background: '#FEFEFE', maxWidth: '480px', margin: '0 auto', fontFamily: "'Patrick Hand', cursive" }}>

      <div style={{ padding: '40px 28px 0' }}>
        <p style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#999', margin: '0 0 6px' }}>
          we found the perfect place
        </p>
        <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2.6rem', fontWeight: '700', color: '#1A1A1A', margin: '0', lineHeight: '1.1' }}>
          your table<br />is ready
        </h1>
        <p style={{ fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#666', margin: '10px 0 0' }}>
          We found the perfect place for your {store.theme || 'dinner'}.
        </p>
      </div>

      <div style={{ padding: '16px 0', textAlign: 'center' }}>
        <img src={tableImg} alt="your table" style={{ width: '100%', objectFit: 'contain' }} />
      </div>

      <div style={{ padding: '0 28px', display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div style={{ flex: '0 0 auto', width: '44%' }}>
          <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: '1.5rem', fontWeight: '700', color: '#1A1A1A', margin: '0 0 8px' }}>
            {r.restaurant_name || r.name}
          </h2>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {[store.theme, 'Casual', 'Family Friendly'].filter(Boolean).map((tag, i) => (
              <span key={i} style={{ border: '1.5px solid #1A1A1A', borderRadius: '20px', padding: '1px 10px', fontSize: '11px', fontFamily: "'Kalam', cursive", color: '#1A1A1A', whiteSpace: 'nowrap' }}>
                {tag}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>{store.guestCount || '—'} people</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>${store.budget || '—'} budget</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>~1.5 hr estimated duration</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>{r.address || r.location || 'Los Angeles, CA'}</p>
            {r.rating && <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>☆ {r.rating} ({r.review_count || 0} reviews)</p>}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'Kalam', cursive", fontSize: '11px', color: '#999', margin: '0 0 12px', textAlign: 'right' }}>
            recommended for your table
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {menus.map((menu, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1.5px solid #ccc', flexShrink: 0, background: '#f8f8f8' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontSize: '14px', fontFamily: "'Caveat', cursive", fontWeight: 'bold', color: '#1A1A1A' }}>
                    {menu.name}
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#888', fontFamily: "'Kalam', cursive", lineHeight: '1.3' }}>
                    {menu.reason || menu.description || ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 28px 48px', display: 'flex', gap: '10px' }}>
        <button onClick={() => navigate('/matching')}
          style={{ flex: 1, padding: '14px 8px', background: 'none', color: '#1A1A1A', border: '1.5px solid #1A1A1A', borderRadius: '12px', fontFamily: "'Caveat', cursive", fontSize: '1rem', cursor: 'pointer' }}>
          Edit
        </button>
        <button onClick={() => navigate('/community')}
          style={{ flex: 1, padding: '14px 8px', background: '#1A1A1A', color: '#FEFEFE', border: 'none', borderRadius: '12px', fontFamily: "'Caveat', cursive", fontSize: '1.1rem', cursor: 'pointer', letterSpacing: '1px' }}>
          Perfect
        </button>
        <button onClick={handleChangeRestaurant}
          style={{ flex: 1, padding: '14px 8px', background: 'none', color: '#1A1A1A', border: '1.5px solid #1A1A1A', borderRadius: '12px', fontFamily: "'Caveat', cursive", fontSize: '1rem', cursor: 'pointer' }}>
          Find
        </button>
      </div>

    </div>
  );
}
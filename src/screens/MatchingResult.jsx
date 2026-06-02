import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';
import api from '../services/api';

const TableIllustration = () => (
  <svg viewBox="0 0 400 280" style={{ width: '100%', maxHeight: '280px' }} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="200" cy="140" rx="140" ry="65" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="200" cy="133" rx="140" ry="65" fill="#FEFEFE" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>
    {[40,80,120,160,200,240,280,320,360].map((x,i) => (
      <g key={i}>
        <ellipse cx={x} cy={i%2===0?105:165} rx="10" ry="14" fill="#FEFEFE" stroke="#1A1A1A" strokeWidth="1.5"/>
        <line x1={x} y1={i%2===0?91:151} x2={x} y2={i%2===0?72:182} stroke="#1A1A1A" strokeWidth="1.5"/>
        <ellipse cx={x} cy={i%2===0?66:188} rx="14" ry="6" fill="#FEFEFE" stroke="#1A1A1A" strokeWidth="1.5"/>
      </g>
    ))}
    {[[170,118],[200,125],[230,118],[185,140],[215,140],[170,152],[200,145],[230,152]].map(([x,y],i) => (
      <ellipse key={i} cx={x} cy={y} rx="13" ry="8" fill="#FEFEFE" stroke="#1A1A1A" strokeWidth="1.2"/>
    ))}
    {[[160,130],[190,138],[220,130],[175,148],[205,148]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="3" fill="none" stroke="#1A1A1A" strokeWidth="1"/>
    ))}
  </svg>
);

const MenuIcon = ({ index }) => {
  const icons = [
    <ellipse cx="20" cy="20" rx="16" ry="10" fill="none" stroke="#1A1A1A" strokeWidth="1.5"/>,
    <><rect x="6" y="14" width="28" height="4" rx="2" fill="none" stroke="#1A1A1A" strokeWidth="1.5"/><rect x="10" y="20" width="20" height="4" rx="2" fill="none" stroke="#1A1A1A" strokeWidth="1.5"/></>,
    <circle cx="20" cy="20" r="14" fill="none" stroke="#1A1A1A" strokeWidth="1.5"/>,
    <><ellipse cx="20" cy="22" rx="14" ry="10" fill="none" stroke="#1A1A1A" strokeWidth="1.5"/><path d="M10 18 Q20 10 30 18" fill="none" stroke="#1A1A1A" strokeWidth="1.5"/></>,
    <><ellipse cx="20" cy="24" rx="12" ry="8" fill="none" stroke="#1A1A1A" strokeWidth="1.5"/><path d="M14 16 Q20 8 26 16" fill="none" stroke="#1A1A1A" strokeWidth="1.5"/></>
  ];
  return (
    <svg viewBox="0 0 40 40" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
      {icons[index % icons.length]}
    </svg>
  );
};

export default function MatchingResult() {
  const navigate = useNavigate();
  const store = useOrderStore();
  const r = store.matchedRestaurant;

  const handleChangeMenu = async (index) => {
    try {
      const res = await api.post('/api/matching/find', {
        latitude: 34.0522,
        longitude: -118.2437,
        cuisine_type: store.theme,
        budget: store.budget,
        guest_count: store.guestCount,
        allergies: store.allergies,
        avoid_spicy: store.avoidSpicy,
        exclude_menu_index: index,
      });
      store.setMatchedRestaurant(res.data);
    } catch (e) {
      console.log('change menu error', e);
    }
  };

  const handleChangeRestaurant = async () => {
    try {
      const res = await api.post('/api/matching/find', {
        latitude: 34.0522,
        longitude: -118.2437,
        cuisine_type: store.theme,
        budget: store.budget,
        guest_count: store.guestCount,
        allergies: store.allergies,
        avoid_spicy: store.avoidSpicy,
        exclude_restaurant: r?.restaurant_id || r?.id,
      });
      store.setMatchedRestaurant(res.data);
    } catch (e) {
      console.log('change restaurant error', e);
    }
  };

  if (!r) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Patrick Hand', cursive" }}>
      <p>ไม่พบข้อมูล กรุณาเริ่มใหม่</p>
    </div>
  );

  const menus = r.menus || r.recommended_menus || [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', maxWidth: '480px', margin: '0 auto', fontFamily: "'Patrick Hand', cursive" }}>

      {/* Hero Section */}
      <div style={{ padding: '32px 24px 0', position: 'relative' }}>
        <div style={{ marginBottom: '8px' }}>
          <p style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#888', margin: '0 0 4px', letterSpacing: '0.5px' }}>
            we found the perfect place
          </p>
          <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2.2rem', fontWeight: '700', color: '#1A1A1A', margin: '0', lineHeight: '1.1' }}>
            your table<br />is ready
          </h1>
          <p style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#666', marginTop: '8px' }}>
            for your {store.theme || 'dinner'}.
          </p>
        </div>

        <TableIllustration />
      </div>

      {/* Restaurant Info */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ borderTop: '2px solid #1A1A1A', paddingTop: '20px', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: '1.8rem', fontWeight: '700', color: '#1A1A1A', margin: '0 0 8px' }}>
            {r.restaurant_name || r.name}
          </h2>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {[store.theme, 'Casual', 'Catering'].filter(Boolean).map((tag, i) => (
              <span key={i} style={{ border: '1.5px solid #1A1A1A', borderRadius: '20px', padding: '2px 12px', fontSize: '12px', fontFamily: "'Kalam', cursive", color: '#1A1A1A' }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>
              👥 {store.guestCount || '—'} people
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>
              💵 ${store.budget || '—'} budget
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>
              📍 {r.address || r.location || 'Los Angeles, CA'}
            </p>
            {r.rating && (
              <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>
                ☆ {r.rating} {r.review_count ? `(${r.review_count} reviews)` : ''}
              </p>
            )}
          </div>

          {r.reason && (
            <div style={{ marginTop: '14px', background: '#f8f8f8', borderRadius: '12px', padding: '12px 14px', borderLeft: '3px solid #1A1A1A' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#444', fontFamily: "'Kalam', cursive", lineHeight: '1.5' }}>
                💡 {r.reason}
              </p>
            </div>
          )}
        </div>

        {/* Menus */}
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#888', margin: '0 0 14px', textAlign: 'right' }}>
            recommended for your table
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {menus.map((menu, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '14px', borderBottom: i < menus.length - 1 ? '1px solid #E8E8E8' : 'none' }}>
                <MenuIcon index={i} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 'bold', fontSize: '15px', color: '#1A1A1A', fontFamily: "'Caveat', cursive" }}>
                    {menu.name}
                  </p>
                  <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#666', fontFamily: "'Kalam', cursive", lineHeight: '1.4' }}>
                    {menu.reason || menu.description || ''}
                  </p>
                  {menu.price && (
                    <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>${menu.price}</p>
                  )}
                </div>
                <button
                  onClick={() => handleChangeMenu(i)}
                  style={{ background: 'none', border: '1px solid #ccc', borderRadius: '8px', padding: '4px 8px', fontSize: '11px', fontFamily: "'Kalam', cursive", color: '#888', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                  เปลี่ยน
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '40px' }}>
          <button
            onClick={() => navigate('/community')}
            style={{ width: '100%', padding: '18px', background: '#1A1A1A', color: '#FEFEFE', border: 'none', borderRadius: 'var(--radius)', fontFamily: "'Caveat', cursive", fontSize: '1.4rem', cursor: 'pointer', letterSpacing: '1px' }}
          >
            Perfect.
          </button>
          <button
            onClick={handleChangeRestaurant}
            style={{ width: '100%', padding: '14px', background: 'none', color: '#1A1A1A', border: '2px solid #1A1A1A', borderRadius: 'var(--radius)', fontFamily: "'Patrick Hand', cursive", fontSize: '1rem', cursor: 'pointer' }}
          >
            🔄 เปลี่ยนร้านใหม่
          </button>
          <button
            onClick={() => navigate('/matching')}
            style={{ width: '100%', padding: '14px', background: 'none', color: '#888', border: '1px solid #ccc', borderRadius: 'var(--radius)', fontFamily: "'Kalam', cursive", fontSize: '0.95rem', cursor: 'pointer' }}
          >
            ← กลับแก้ข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}

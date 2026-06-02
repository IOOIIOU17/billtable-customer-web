import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import api from '../services/api';

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

  if (!r) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Patrick Hand', cursive" }}>
      <p>ไม่พบข้อมูล กรุณาเริ่มใหม่</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', padding: '32px 24px', maxWidth: '480px', margin: '0 auto', fontFamily: "'Patrick Hand', cursive" }}>

      {/* Header */}
      <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', marginBottom: '4px' }}>
        🍽️ Bill AI เลือกให้คุณแล้ว
      </h1>
      <p style={{ color: 'var(--color-pencil)', marginBottom: '24px', fontFamily: "'Kalam', cursive" }}>
        สำหรับ {store.guestCount} คน • งบ ${store.budget}
      </p>

      {/* Restaurant */}
      <div style={{ border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: '1.5rem', marginBottom: '4px' }}>
          {r.restaurant_name || r.name}
        </h2>
        <p style={{ color: 'var(--color-pencil)', fontSize: '14px', marginBottom: '8px' }}>
          📍 {r.address || r.location}
        </p>
        <p style={{ fontSize: '14px', background: '#f5f5f5', padding: '10px', borderRadius: '8px' }}>
          💡 <strong>เหตุผลที่เลือก:</strong> {r.reason || `ร้านนี้อยู่ใกล้จุดส่ง มีเมนูตรงกับ ${store.theme} และอยู่ในงบของคุณ`}
        </p>
      </div>

      {/* Menus */}
      <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: '1.3rem', marginBottom: '12px' }}>เมนูที่แนะนำ</h3>
      {(r.menus || r.recommended_menus || []).map((menu, i) => (
        <div key={i} style={{ border: '1px solid var(--color-light)', borderRadius: 'var(--radius)', padding: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 'bold', marginBottom: '2px' }}>{menu.name}</p>
            <p style={{ fontSize: '13px', color: 'var(--color-pencil)', marginBottom: '4px' }}>
              💡 {menu.reason || `เหมาะกับ ${store.theme} และไม่มีส่วนผสมที่แพ้`}
            </p>
            <p style={{ fontSize: '14px' }}>${menu.price}</p>
          </div>
          <button
            onClick={() => handleChangeMenu(i)}
            style={{ background: 'none', border: '1px solid var(--color-ink)', borderRadius: '8px', padding: '6px 10px', fontFamily: "'Kalam', cursive", fontSize: '12px', cursor: 'pointer', marginLeft: '8px', whiteSpace: 'nowrap' }}
          >
            เปลี่ยนเมนู
          </button>
        </div>
      ))}

      {/* 3 Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        <button
          onClick={() => navigate('/community')}
          style={{ width: '100%', padding: '16px', background: 'var(--color-ink)', color: 'var(--color-paper)', border: 'none', borderRadius: 'var(--radius)', fontFamily: "'Caveat', cursive", fontSize: '1.4rem', cursor: 'pointer', letterSpacing: '2px' }}
        >
          Perfect.
        </button>
        <button
          onClick={() => navigate('/matching')}
          style={{ width: '100%', padding: '14px', background: 'none', color: 'var(--color-ink)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: "'Patrick Hand', cursive", fontSize: '1rem', cursor: 'pointer' }}
        >
          🔄 เปลี่ยนร้านใหม่
        </button>
        <button
          onClick={() => navigate('/matching')}
          style={{ width: '100%', padding: '14px', background: 'none', color: 'var(--color-pencil)', border: '1px solid var(--color-light)', borderRadius: 'var(--radius)', fontFamily: "'Kalam', cursive", fontSize: '0.95rem', cursor: 'pointer' }}
        >
          ← กลับแก้ข้อมูล
        </button>
      </div>

    </div>
  );
}

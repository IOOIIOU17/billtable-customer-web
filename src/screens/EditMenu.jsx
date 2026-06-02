import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';

export default function EditMenu() {
  const navigate = useNavigate();
  const store = useOrderStore();
  const r = store.matchedRestaurant;
  const menus = r?.menus || r?.recommended_menus || [];
  const extras = r?.extra_menus || [];

  const [selected, setSelected] = useState(menus.map((_, i) => i));
  const [comment, setComment] = useState('');

  const toggleMenu = (index) => {
    setSelected(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const allMenus = [...menus, ...extras];

  const handleConfirm = () => {
    const finalMenus = allMenus.filter((_, i) => selected.includes(i));
    store.setMatchedRestaurant({ ...r, menus: finalMenus, comment });
    navigate('/result');
  };

  if (!r) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Patrick Hand', cursive" }}>
      <p>ไม่พบข้อมูล กรุณาเริ่มใหม่</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#FEFEFE', maxWidth: '480px', margin: '0 auto', fontFamily: "'Patrick Hand', cursive", padding: '40px 28px 48px' }}>

      <button onClick={() => navigate('/result')}
        style={{ background: 'none', border: 'none', fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#999', cursor: 'pointer', padding: '0 0 20px', display: 'block' }}>
        ← back
      </button>

      <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', fontWeight: '700', color: '#1A1A1A', margin: '0 0 6px' }}>
        edit your menu
      </h1>
      <p style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#999', margin: '0 0 28px' }}>
        pick what you want · swap what you don't
      </p>

      {/* Menu List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {allMenus.map((menu, i) => {
          const isSelected = selected.includes(i);
          const isExtra = i >= menus.length;
          return (
            <div key={i}
              onClick={() => toggleMenu(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px', borderRadius: '12px', cursor: 'pointer',
                border: isSelected ? '2px solid #1A1A1A' : '1.5px solid #E8E8E8',
                background: isSelected ? '#FAFAFA' : '#FEFEFE',
                transition: 'all 0.15s'
              }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                border: '1.5px solid #ccc', flexShrink: 0, background: '#f8f8f8'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p style={{ margin: 0, fontSize: '15px', fontFamily: "'Caveat', cursive", fontWeight: 'bold', color: '#1A1A1A' }}>
                    {menu.name}
                  </p>
                  {isExtra && (
                    <span style={{ fontSize: '10px', fontFamily: "'Kalam', cursive", color: '#999', border: '1px solid #ccc', borderRadius: '10px', padding: '1px 8px' }}>
                      alternative
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#888', fontFamily: "'Kalam', cursive" }}>
                  {menu.reason || menu.description || ''}
                </p>
              </div>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                border: '1.5px solid #1A1A1A',
                background: isSelected ? '#1A1A1A' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {isSelected && <span style={{ color: '#FEFEFE', fontSize: '12px' }}>✓</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comment Box */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#999', margin: '0 0 8px' }}>
          anything else you'd like to add?
        </p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="e.g. no peanuts, extra spicy, gluten free..."
          style={{
            width: '100%', minHeight: '80px', padding: '12px',
            fontFamily: "'Patrick Hand', cursive", fontSize: '14px',
            border: '1.5px solid #1A1A1A', borderRadius: '12px',
            background: '#FEFEFE', color: '#1A1A1A', resize: 'none',
            outline: 'none', boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Confirm Button */}
      <button onClick={handleConfirm}
        style={{
          width: '100%', padding: '16px', background: '#1A1A1A', color: '#FEFEFE',
          border: 'none', borderRadius: '12px', fontFamily: "'Caveat', cursive",
          fontSize: '1.2rem', cursor: 'pointer', letterSpacing: '1px'
        }}>
        Done
      </button>

    </div>
  );
}

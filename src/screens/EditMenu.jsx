import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import billTableLogo from '../assets/billtable-logo.png';

const MOCK_AI_MENUS = [
  { id: 1, name: 'Pad Thai', reason: 'Popular choice for groups' },
  { id: 2, name: 'Green Curry', reason: 'Matches your flavor preference' },
  { id: 3, name: 'Spring Rolls', reason: 'Great starter for your theme' },
  { id: 4, name: 'Mango Sticky Rice', reason: 'Perfect dessert pairing' },
  { id: 5, name: 'Tom Yum Soup', reason: 'Crowd favorite, fits budget' },
];

const MOCK_EXTRAS = [
  { id: 6, name: 'Fried Rice', reason: 'Alternative to Pad Thai' },
  { id: 7, name: 'Basil Chicken', reason: 'Fan favorite backup' },
  { id: 8, name: 'Papaya Salad', reason: 'Light option for variety' },
];

export default function EditMenu() {
  const navigate = useNavigate();
  const store = useOrderStore();
  const r = store.matchedRestaurant;

  const aiMenus = r?.menus?.length ? r.menus : MOCK_AI_MENUS;
  const extras = r?.extra_menus?.length ? r.extra_menus : MOCK_EXTRAS;
  const allMenus = [...aiMenus, ...extras];

  const [selected, setSelected] = useState(aiMenus.map((_, i) => i));
  const [comment, setComment] = useState('');

  const toggleMenu = (index) => {
    setSelected(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleConfirm = () => {
    const finalMenus = allMenus.filter((_, i) => selected.includes(i));
    store.setMatchedRestaurant({ ...r, menus: finalMenus, comment });
    navigate('/result');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FEFEFE', maxWidth: '480px', margin: '0 auto', padding: '32px 24px 48px', fontFamily: "'Patrick Hand', cursive" }}>

      <button onClick={() => navigate('/result')}
        style={{ background: 'none', border: 'none', fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#999', cursor: 'pointer', padding: '0 0 24px', display: 'block' }}>
        back
      </button>

      <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', fontWeight: '700', color: '#1A1A1A', margin: '0 0 4px' }}>
        edit your menu
      </h1>
      <p style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#999', margin: '0 0 28px' }}>
        pick what you want · swap what you don't
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <img src={billTableLogo} alt="BillTable" style={{ height: '22px', objectFit: 'contain' }} />
        <span style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#999' }}>recommends</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
        {aiMenus.map((menu, i) => {
          const isSelected = selected.includes(i);
          return (
            <div key={i} onClick={() => toggleMenu(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px', borderRadius: '12px', cursor: 'pointer',
                border: isSelected ? '2px solid #1A1A1A' : '1.5px solid #D8D8D8',
                background: isSelected ? '#F4F4F4' : '#FEFEFE',
                transition: 'all 0.15s'
              }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                border: '2px solid #1A1A1A',
                background: isSelected ? '#1A1A1A' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {isSelected && <span style={{ color: '#FEFEFE', fontSize: '13px' }}>✓</span>}
              </div>
              <div>
                <p style={{ margin: 0, fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#1A1A1A' }}>{menu.name}</p>
                <p style={{ margin: 0, fontFamily: "'Kalam', cursive", fontSize: '12px', color: '#888' }}>{menu.reason || ''}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.1rem', color: '#1A1A1A', margin: '0 0 12px' }}>
        swap with these
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
        {extras.map((menu, i) => {
          const idx = aiMenus.length + i;
          const isSelected = selected.includes(idx);
          return (
            <div key={idx} onClick={() => toggleMenu(idx)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px', borderRadius: '12px', cursor: 'pointer',
                border: isSelected ? '2px solid #1A1A1A' : '1.5px dashed #C8C8C8',
                background: isSelected ? '#F4F4F4' : '#FEFEFE',
                transition: 'all 0.15s'
              }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                border: '2px solid #1A1A1A',
                background: isSelected ? '#1A1A1A' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {isSelected && <span style={{ color: '#FEFEFE', fontSize: '13px' }}>✓</span>}
              </div>
              <div>
                <p style={{ margin: 0, fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#1A1A1A' }}>{menu.name}</p>
                <p style={{ margin: 0, fontFamily: "'Kalam', cursive", fontSize: '12px', color: '#888' }}>{menu.reason || ''}</p>
              </div>
            </div>
          );
        })}
      </div>

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
          outline: 'none', boxSizing: 'border-box', marginBottom: '28px'
        }}
      />

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

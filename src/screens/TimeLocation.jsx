import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';

export default function TimeLocation() {
  const navigate = useNavigate();
  const setDeliveryTime = useOrderStore((s) => s.setDeliveryTime);
  const setDeliveryAddress = useOrderStore((s) => s.setDeliveryAddress);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [building, setBuilding] = useState('');
  const [phone, setPhone] = useState('');

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid var(--color-ink)',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    background: 'var(--color-paper)',
    color: 'var(--color-ink)',
    outline: 'none',
  };

  const handleNext = () => {
    if (!date || !time || !address) return;
    setDeliveryTime(`${date} ${time}`);
    setDeliveryAddress(`${address} ${building}`);
    navigate('/matching');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-paper)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      gap: '16px',
      maxWidth: '400px',
      margin: '0 auto',
    }}>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '20px', textAlign: 'center' }}>
        When and where should the table arrive?
      </p>

      <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
        <input style={{ ...inputStyle, flex: 1 }} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input style={{ ...inputStyle, width: '120px' }} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>

      <input style={inputStyle} placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <input style={inputStyle} placeholder="Building / unit (optional)" value={building} onChange={(e) => setBuilding(e.target.value)} />
      <input style={inputStyle} placeholder="Contact phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

      <button
        onClick={handleNext}
        style={{
          width: '100%',
          background: 'var(--color-ink)',
          color: 'var(--color-paper)',
          border: '2px solid var(--color-ink)',
          borderRadius: 'var(--radius)',
          padding: '14px',
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        Next →
      </button>

    </div>
  );
}

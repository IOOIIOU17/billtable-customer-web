import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import api from '../services/api';

export default function TimeLocation() {
  const navigate = useNavigate();
  const setDeliveryTime = useOrderStore((s) => s.setDeliveryTime);
  const setDeliveryAddress = useOrderStore((s) => s.setDeliveryAddress);
  const setLocation = useOrderStore((s) => s.setLocation);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [building, setBuilding] = useState('');
  const [phone, setPhone] = useState('');
  const [savedAddress, setSavedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const buttonStyle = (filled) => ({
    width: '100%',
    background: filled ? 'var(--color-ink)' : 'var(--color-paper)',
    color: filled ? 'var(--color-paper)' : 'var(--color-ink)',
    border: '2px solid var(--color-ink)',
    borderRadius: 'var(--radius)',
    padding: '14px',
    fontFamily: 'var(--font-body)',
    fontSize: '18px',
    cursor: 'pointer',
  });

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/addresses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.address) {
          setSavedAddress(res.data.address);
        } else {
          setShowForm(true);
        }
      } catch (err) {
        setShowForm(true);
      } finally {
        setLoading(false);
      }
    };
    loadAddress();
  }, []);

  const geocodeAddress = async (text) => {
    const key = import.meta.env.VITE_LOCATIONIQ_KEY;
    const url = `https://us1.locationiq.com/v1/search?key=${key}&q=${encodeURIComponent(text)}&format=json&limit=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    if (!data || data.length === 0) throw new Error('Address not found');
    return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
  };

  const useSavedAddress = () => {
    if (!date || !time) {
      setError('กรุณาเลือกวันและเวลาก่อน');
      return;
    }
    setDeliveryTime(`${date} ${time}`);
    setDeliveryAddress(`${savedAddress.address} ${savedAddress.building || ''}`);
    setLocation(parseFloat(savedAddress.latitude), parseFloat(savedAddress.longitude));
    navigate('/matching');
  };

  const handleNext = async () => {
    if (!date || !time || !address) return;
    setError('');
    setLoading(true);
    try {
      const { latitude, longitude } = await geocodeAddress(`${address} ${building}`);
      const token = localStorage.getItem('token');
      await api.post('/api/addresses', {
        address, building, phone, latitude, longitude,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDeliveryTime(`${date} ${time}`);
      setDeliveryAddress(`${address} ${building}`);
      setLocation(latitude, longitude);
      navigate('/matching');
    } catch (err) {
      console.error(err);
      setError('ไม่พบที่อยู่นี้ กรุณาตรวจสอบและลองใหม่');
    } finally {
      setLoading(false);
    }
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

      {loading && (
        <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', textAlign: 'center' }}>
          กำลังโหลด...
        </p>
      )}

      {!loading && savedAddress && !showForm && (
        <>
          <div style={{
            width: '100%',
            border: '2px dashed var(--color-ink)',
            borderRadius: 'var(--radius)',
            padding: '16px',
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
          }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>
              ส่งที่อยู่นี้?
            </p>
            <p style={{ margin: '4px 0 0 0' }}>{savedAddress.address} {savedAddress.building}</p>
          </div>

          {error && <p style={{ color: 'crimson', fontFamily: 'var(--font-hint)', fontSize: '14px' }}>{error}</p>}

          <button onClick={useSavedAddress} style={buttonStyle(true)}>
            Deliver here →
          </button>
          <button onClick={() => setShowForm(true)} style={buttonStyle(false)}>
            + Add new address
          </button>
        </>
      )}

      {!loading && showForm && (
        <>
          <input style={inputStyle} placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <input style={inputStyle} placeholder="Building / unit (optional)" value={building} onChange={(e) => setBuilding(e.target.value)} />
          <input style={inputStyle} placeholder="Contact phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

          {error && <p style={{ color: 'crimson', fontFamily: 'var(--font-hint)', fontSize: '14px' }}>{error}</p>}

          <button onClick={handleNext} style={buttonStyle(true)}>
            Next →
          </button>

          {savedAddress && (
            <button onClick={() => { setShowForm(false); setError(''); }} style={buttonStyle(false)}>
              ← Use saved address
            </button>
          )}
        </>
      )}

    </div>
  );
}

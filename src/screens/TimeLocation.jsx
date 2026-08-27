import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import api from '../services/api';
import LocationMap from '../components/LocationMap';

const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

// TEST MODE — locks this screen to a known-good location (near the test
// restaurant data) so the rest of the flow (matching, table, etc.) can be
// tested end-to-end without fighting geocoding/typing every time. It does
// NOT change how the screen looks — the map, search, and current-location
// button all still work normally, this just pre-fills valid values so
// "Next →" can be clicked right away. Flip LOCK_TEST_LOCATION to false to
// go back to a fully blank form once real customer locations are wired in.
const LOCK_TEST_LOCATION = true;
const TEST_LOCATION = {
  address: 'Downtown Los Angeles, CA, USA',
  lat: 34.0522,
  lng: -118.2437,
};

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

  // Feature 1 — search + pin, on LocationIQ (no Google Maps key needed;
  // VITE_LOCATIONIQ_KEY is already set in .env).
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pin, setPin] = useState(null); // { lat, lng } | null
  const [locating, setLocating] = useState(false);
  const debounceRef = useRef(null);

  // TEST MODE — pre-fill a valid date/time/address/pin once on load so
  // this screen can be skipped past with a single click. See
  // LOCK_TEST_LOCATION above to turn this off later.
  useEffect(() => {
    if (!LOCK_TEST_LOCATION) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().slice(0, 10));
    setTime('18:00');
    setAddress(TEST_LOCATION.address);
    setPin({ lat: TEST_LOCATION.lat, lng: TEST_LOCATION.lng });
    setBuilding('Suite 100');
    setPhone('2135551234');
  }, []);

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
    const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(text)}&format=json&limit=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    if (!data || data.length === 0) throw new Error('Address not found');
    return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
  };

  const reverseGeocode = async (lat, lng) => {
    const url = `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Reverse geocoding failed');
    const data = await res.json();
    return data?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  };

  const handleAddressChange = (text) => {
    setAddress(text);
    setPin(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const url = `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(text)}&limit=5&format=json`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
        setShowSuggestions(true);
      } catch {
        // silent — typing an address without suggestions still works via handleNext's geocode fallback
      }
    }, 350);
  };

  const selectSuggestion = (s) => {
    setAddress(s.display_name);
    setPin({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handlePinMove = async (lat, lng) => {
    setPin({ lat, lng });
    try {
      const name = await reverseGeocode(lat, lng);
      setAddress(name);
    } catch {
      // pin still moves even if the reverse-lookup fails
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location detection.');
      return;
    }
    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const name = await reverseGeocode(latitude, longitude);
          setAddress(name);
          setPin({ lat: latitude, lng: longitude });
        } catch {
          setPin({ lat: latitude, lng: longitude });
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError('Could not get your location. Please search for an address instead.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const useSavedAddress = () => {
    if (!date || !time) {
      setError('Please select a date and time first.');
      return;
    }
    setDeliveryTime(`${date} ${time}`);
    setDeliveryAddress(`${savedAddress.address}${savedAddress.building ? ', ' + savedAddress.building : ''}`.trim());
    setLocation(parseFloat(savedAddress.latitude), parseFloat(savedAddress.longitude));
    navigate(localStorage.getItem('aiConsentGiven') === 'true' ? '/matching' : '/ai-consent');
  };

  const handleNext = async () => {
    if (!date || !time || !address) return;
    setError('');
    setLoading(true);
    try {
      // Prefer the pin's coordinates (from a suggestion, drag, or current
      // location) over re-geocoding the typed text — it's the spot the
      // person actually confirmed on the map.
      const { latitude, longitude } = pin
        ? { latitude: pin.lat, longitude: pin.lng }
        : await geocodeAddress(`${address} ${building}`);
      const token = localStorage.getItem('token');
      const cleanBuilding = building && !address.toLowerCase().includes(building.toLowerCase()) ? building : '';
      await api.post('/api/addresses', {
        address, building: cleanBuilding, phone, latitude, longitude,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDeliveryTime(`${date} ${time}`);
      setDeliveryAddress(`${address}${building ? ', ' + building : ''}`.trim());
      setLocation(latitude, longitude);
      navigate(localStorage.getItem('aiConsentGiven') === 'true' ? '/matching' : '/ai-consent');
    } catch (err) {
      console.error(err);
      // Show the real reason instead of always blaming the address — a
      // pin-based save can fail for other reasons (expired login, etc.)
      // and the old blanket message hid that.
      if (err.response?.status === 401) {
        setError('Your session has expired. Please sign up or log in again.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (!pin) {
        setError('Address not found. Please check and try again, or use the map to pin your location.');
      } else {
        setError('Something went wrong saving this address. Please try again.');
      }
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
          Loading...
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
              Deliver to this address?
            </p>
            <p style={{ margin: '4px 0 0 0' }}>{savedAddress.address}{savedAddress.building ? ', ' + savedAddress.building : ''}</p>
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
          <button onClick={handleUseCurrentLocation} disabled={locating} style={buttonStyle(false)}>
            {locating ? 'Finding you...' : '📍 Use my current location'}
          </button>

          <div style={{ width: '100%', position: 'relative' }}>
            <input
              style={inputStyle}
              placeholder="Search for the delivery address"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 10,
                background: 'var(--color-paper)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
                maxHeight: '220px', overflowY: 'auto',
              }}>
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => selectSuggestion(s)}
                    style={{
                      padding: '10px 14px', fontFamily: 'var(--font-hint)', fontSize: '14px', cursor: 'pointer',
                      borderBottom: i < suggestions.length - 1 ? '1px solid var(--color-light)' : 'none',
                    }}
                  >
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {pin && (
            <LocationMap lat={pin.lat} lng={pin.lng} onMove={handlePinMove} />
          )}
          {pin && (
            <p style={{ fontFamily: 'var(--font-hint)', fontSize: '12px', color: 'var(--color-pencil)', textAlign: 'center', margin: 0 }}>
              Drag the pin or tap the map to fine-tune the spot.
            </p>
          )}

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

import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';

export default function Summary() {
  const navigate = useNavigate();
  const store = useOrderStore();

  const deliveryFee = 40;
  const serviceFee = 40;
  const editedMenus = store.matchedRestaurant?.menus;
  const hasValidPrices = editedMenus?.length && editedMenus.every((m) => typeof m.price === 'number');
  const menus = (hasValidPrices ? editedMenus : (store.matchedRestaurant?.recommended_menus || [])).slice(0, 5);
  const foodTotal = menus.reduce((sum, m) => sum + (m.price || 0), 0);
  const total = foodTotal + deliveryFee + serviceFee;

  const rows = [
    { label: 'Theme', value: store.theme || '-' },
    { label: 'Guests', value: store.guestCount ? `${store.guestCount} people` : '-' },
    { label: 'Allergy', value: store.allergies?.length ? store.allergies.join(', ') : 'None' },
    { label: 'Taste', value: store.avoidSpicy ? 'Not spicy only' : 'Any' },
    { label: 'Delivery', value: store.deliveryTime || '-' },
    { label: 'Community', value: store.communityType || '-' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <p style={{ fontFamily: 'var(--font-logo)', fontSize: '28px' }}>Here is your table.</p>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {rows.map((r) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light)', paddingBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>{r.label}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}>{r.value}</span>
          </div>
        ))}
      </div>

      {menus.length > 0 && (
        <div style={{ width: '100%', borderTop: '2px solid var(--color-ink)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>Menu</p>
          {menus.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px' }}>{m.name}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px' }}>${m.price}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ width: '100%', borderTop: '2px solid var(--color-ink)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-pencil)' }}>Food</span>
          <span style={{ fontFamily: 'var(--font-body)' }}>${foodTotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-pencil)' }}>Delivery</span>
          <span style={{ fontFamily: 'var(--font-body)' }}>${deliveryFee}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-pencil)' }}>Service</span>
          <span style={{ fontFamily: 'var(--font-body)' }}>${serviceFee}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontFamily: 'var(--font-logo)', fontSize: '20px' }}>Total</span>
          <span style={{ fontFamily: 'var(--font-logo)', fontSize: '20px' }}>${total}</span>
        </div>
      </div>

      <button onClick={() => navigate('/payment')} style={{ width: '100%', background: 'var(--color-ink)', color: 'var(--color-paper)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '14px', fontFamily: 'var(--font-body)', fontSize: '18px', cursor: 'pointer' }}>Confirm Table →</button>
    </div>
  );
}

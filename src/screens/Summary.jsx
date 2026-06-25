import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useOrderStore from '../store/orderStore';
import api from '../services/api';

export default function Summary() {
  const navigate = useNavigate();
  const store = useOrderStore();
  const setOrderTotal = useOrderStore((s) => s.setOrderTotal);
  const setBudgetWarningAcknowledged = useOrderStore((s) => s.setBudgetWarningAcknowledged);
  const setCurrentOrderId = useOrderStore((s) => s.setCurrentOrderId);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const handleConfirm = async () => {
    setCreating(true);
    setCreateError('');
    try {
      const token = localStorage.getItem('token');
      const matchedRestaurant = store.matchedRestaurant;
      const restaurantId = matchedRestaurant?.restaurant?.id;
      if (!restaurantId) { setCreateError('Restaurant not found.'); setCreating(false); return; }
      const editedMenus = matchedRestaurant?.menus;
      const hasValidPrices = editedMenus?.length && editedMenus.every((m) => typeof m.price === 'number');
      const menus = hasValidPrices ? editedMenus : (matchedRestaurant?.recommended_menus || []);
      const items = menus.slice(0, 5).map((m) => ({ menuItemId: m.id, name: m.name, quantity: m.quantity || 1 }));
      const orderRes = await api.post('/api/orders', {
        restaurantId, items,
        theme: store.theme, guestCount: store.guestCount, budget: store.budget,
        allergies: (store.allergies || []).join(', '), avoidSpicy: store.avoidSpicy,
        deliveryTime: store.deliveryTime, deliveryAddress: store.deliveryAddress,
        latitude: store.latitude, longitude: store.longitude,
        budgetWarningShown: store.budgetWarningAcknowledged, budgetWarningAcknowledged: store.budgetWarningAcknowledged,
        customerComment: matchedRestaurant?.comment || '',
      }, { headers: { Authorization: `Bearer ${token}` } });
      const newOrder = orderRes.data?.data;
      if (!newOrder?.id) { setCreateError('Could not create order. Please try again.'); setCreating(false); return; }
      setCurrentOrderId(newOrder.id);
      navigate('/payment');
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Something went wrong.');
      setCreating(false);
    }
  };

  const TAX_RATE = 0.0875;
  const editedMenus = store.matchedRestaurant?.menus;
  const hasValidPrices = editedMenus?.length && editedMenus.every((m) => typeof m.price === 'number');
  const menus = (hasValidPrices ? editedMenus : (store.matchedRestaurant?.recommended_menus || [])).slice(0, 5);
  const foodTotal = menus.reduce((sum, m) => sum + (m.price || 0), 0);
  const taxAmount = parseFloat((foodTotal * TAX_RATE).toFixed(2));
  const total = parseFloat((foodTotal + taxAmount).toFixed(2));
  useEffect(() => { setOrderTotal(total); }, [total]);

  const restaurantName = store.matchedRestaurant?.restaurant?.name || store.matchedRestaurant?.name || '-';
  const budget = parseFloat(store.budget) || 0;
  const isOverBudget = budget > 0 && total > budget;
  const overBy = (total - budget).toFixed(2);

  const rows = [
    { label: 'Restaurant', value: restaurantName },
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
          <span style={{ fontFamily: 'var(--font-body)', color: '#16a34a' }}>FREE</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-pencil)' }}>Service</span>
          <span style={{ fontFamily: 'var(--font-body)', color: '#16a34a' }}>FREE</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-pencil)' }}>Tax (8.75%)</span>
          <span style={{ fontFamily: 'var(--font-body)' }}>${taxAmount.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontFamily: 'var(--font-logo)', fontSize: '20px' }}>Total</span>
          <span style={{ fontFamily: 'var(--font-logo)', fontSize: '20px' }}>${total}</span>
        </div>
      </div>

      {isOverBudget && (
        <div style={{ width: '100%', background: '#fef9c3', border: '2px solid #ca8a04', borderRadius: 'var(--radius)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#92400e', margin: 0 }}>⚠️ This order exceeds your budget by <strong>${overBy}</strong></p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { setBudgetWarningAcknowledged(true); handleConfirm(); }} style={{ flex: 1, background: 'var(--color-ink)', color: 'var(--color-paper)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '12px', fontFamily: 'var(--font-body)', fontSize: '15px', cursor: 'pointer' }}>Confirm Anyway</button>
            <button onClick={() => navigate('/matching')} style={{ flex: 1, background: 'var(--color-paper)', color: 'var(--color-ink)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '12px', fontFamily: 'var(--font-body)', fontSize: '15px', cursor: 'pointer' }}>Re-match</button>
          </div>
        </div>
      )}
      {!isOverBudget && (
        <button onClick={handleConfirm} style={{ width: '100%', background: 'var(--color-ink)', color: 'var(--color-paper)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '14px', fontFamily: 'var(--font-body)', fontSize: '18px', cursor: 'pointer' }}>Confirm Table →</button>
      )}
    </div>
  );
}

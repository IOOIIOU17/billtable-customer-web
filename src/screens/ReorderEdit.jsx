import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'

export default function ReorderEdit() {
  const navigate = useNavigate()
  const location = useLocation()
  const order = location.state?.order

  const [items, setItems] = useState(() =>
    (order?.order_items || []).map((i, idx) => ({
      key: idx,
      name: i.item_name,
      unitPrice: parseFloat(i.unit_price),
      quantity: i.quantity,
      selected: true,
    }))
  )
  const [submitting, setSubmitting] = useState(false)

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-paper)', padding: '32px 24px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-pencil)' }}>No order data found.</p>
        <button onClick={() => navigate('/history')} style={{ marginTop: '16px', padding: '12px 24px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer', background: 'var(--color-ink)', color: 'var(--color-paper)' }}>← Back to Orders</button>
      </div>
    )
  }

  const toggleSelected = (key) => {
    setItems(prev => prev.map(it => it.key === key ? { ...it, selected: !it.selected } : it))
  }

  const changeQty = (key, delta) => {
    setItems(prev => prev.map(it => {
      if (it.key !== key) return it
      const q = Math.max(1, it.quantity + delta)
      return { ...it, quantity: q }
    }))
  }

  const selectedItems = items.filter(i => i.selected)
  const total = selectedItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  const handleConfirm = () => {
    if (selectedItems.length === 0) {
      alert('กรุณาเลือกเมนูอย่างน้อย 1 รายการ')
      return
    }
    setSubmitting(true)
    api.post('/api/orders', {
      restaurantId: order.restaurant_id,
      items: selectedItems.map(i => ({ name: i.name, quantity: i.quantity, unitPrice: i.unitPrice })),
      theme: order.theme,
      guestCount: order.guest_count,
      budget: order.budget,
      allergies: order.allergies,
      avoidSpicy: order.avoid_spicy,
      deliveryTime: order.delivery_time,
      deliveryAddress: order.delivery_address,
      latitude: order.latitude,
      longitude: order.longitude,
    }).then(res => {
      const newOrder = res.data?.data || res.data?.order || res.data
      navigate(`/tracking/${newOrder.id}`)
    }).catch(() => {
      alert('Reorder failed. Please try again.')
      setSubmitting(false)
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', padding: '32px 24px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/history')} style={{ padding: '8px 16px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer', background: 'var(--color-paper)' }}>← Back</button>
        <h1 style={{ fontFamily: 'var(--font-logo)', fontSize: '28px' }}>Edit & Reorder</h1>
      </div>

      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', marginBottom: '20px' }}>
        Uncheck items you don't want, or adjust quantity.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {items.map(item => (
          <div key={item.key} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
            border: item.selected ? '2px solid var(--color-ink)' : '1.5px solid var(--color-light)',
            borderRadius: 'var(--radius)',
            background: item.selected ? 'var(--color-paper)' : '#F8F8F8',
            opacity: item.selected ? 1 : 0.5,
          }}>
            <div
              onClick={() => toggleSelected(item.key)}
              style={{
                width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0, cursor: 'pointer',
                border: '2px solid var(--color-ink)',
                background: item.selected ? 'var(--color-ink)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
              {item.selected && <span style={{ color: 'var(--color-paper)', fontSize: '13px' }}>✓</span>}
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '15px' }}>{item.name}</p>
              <p style={{ margin: 0, fontFamily: 'var(--font-hint)', fontSize: '12px', color: 'var(--color-pencil)' }}>${item.unitPrice.toFixed(2)} each</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => changeQty(item.key, -1)} disabled={!item.selected} style={{ width: '28px', height: '28px', border: '2px solid var(--color-ink)', borderRadius: '8px', background: 'var(--color-paper)', cursor: item.selected ? 'pointer' : 'default', fontFamily: 'var(--font-body)', fontSize: '14px' }}>-</button>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
              <button onClick={() => changeQty(item.key, 1)} disabled={!item.selected} style={{ width: '28px', height: '28px', border: '2px solid var(--color-ink)', borderRadius: '8px', background: 'var(--color-paper)', cursor: item.selected ? 'pointer' : 'default', fontFamily: 'var(--font-body)', fontSize: '14px' }}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--color-ink)', paddingTop: '12px', marginBottom: '24px' }}>
        <span style={{ fontFamily: 'var(--font-logo)', fontSize: '20px' }}>Total</span>
        <span style={{ fontFamily: 'var(--font-logo)', fontSize: '20px' }}>${total.toFixed(2)}</span>
      </div>

      <button onClick={handleConfirm} disabled={submitting} style={{
        width: '100%', padding: '14px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
        fontFamily: 'var(--font-body)', fontSize: '16px', cursor: submitting ? 'default' : 'pointer',
        background: 'var(--color-ink)', color: 'var(--color-paper)', opacity: submitting ? 0.6 : 1,
      }}>
        {submitting ? 'Placing order...' : 'Confirm & Order →'}
      </button>
    </div>
  )
}

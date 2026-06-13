import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'
import billTableLogo from '../assets/billtable-logo.png'

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
      <div style={{ minHeight: '100vh', background: '#FEFEFE', maxWidth: '480px', margin: '0 auto', padding: '32px 24px', textAlign: 'center', fontFamily: "'Patrick Hand', cursive" }}>
        <p style={{ color: '#888' }}>No order data found.</p>
        <button onClick={() => navigate('/history')} style={{ marginTop: '16px', padding: '14px 24px', background: '#1A1A1A', color: '#FEFEFE', border: 'none', borderRadius: '12px', fontFamily: "'Caveat', cursive", fontSize: '1.1rem', cursor: 'pointer' }}>back to orders</button>
      </div>
    )
  }

  const toggleSelected = (key) => {
    setItems(prev => prev.map(it => it.key === key ? { ...it, selected: !it.selected } : it))
  }

  const changeQty = (key, delta) => {
    setItems(prev => prev.map(it => {
      if (it.key !== key) return it
      return { ...it, quantity: Math.max(1, it.quantity + delta) }
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
    <div style={{ minHeight: '100vh', background: '#FEFEFE', maxWidth: '480px', margin: '0 auto', padding: '32px 24px 48px', fontFamily: "'Patrick Hand', cursive" }}>

      <button onClick={() => navigate('/history')}
        style={{ background: 'none', border: 'none', fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#999', cursor: 'pointer', padding: '0 0 24px', display: 'block' }}>
        back
      </button>

      <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', fontWeight: '700', color: '#1A1A1A', margin: '0 0 4px' }}>
        edit your order
      </h1>
      <p style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#999', margin: '0 0 28px' }}>
        keep what you want · uncheck the rest · adjust quantity
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <img src={billTableLogo} alt="BillTable" style={{ height: '22px', objectFit: 'contain' }} />
        <span style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#999' }}>from your last order</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
        {items.map((item) => {
          const isSelected = item.selected
          return (
            <div key={item.key}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px', borderRadius: '12px',
                border: isSelected ? '2px solid #1A1A1A' : '1.5px solid #D8D8D8',
                background: isSelected ? '#F4F4F4' : '#FEFEFE',
                transition: 'all 0.15s'
              }}>
              <div onClick={() => toggleSelected(item.key)}
                style={{
                  width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0, cursor: 'pointer',
                  border: '2px solid #1A1A1A',
                  background: isSelected ? '#1A1A1A' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                {isSelected && <span style={{ color: '#FEFEFE', fontSize: '13px' }}>✓</span>}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#1A1A1A' }}>{item.name}</p>
                <p style={{ margin: 0, fontFamily: "'Kalam', cursive", fontSize: '12px', color: '#888' }}>${item.unitPrice.toFixed(2)} each</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => changeQty(item.key, -1)} disabled={!isSelected}
                  style={{ width: '26px', height: '26px', border: '2px solid #1A1A1A', borderRadius: '8px', background: '#FEFEFE', cursor: isSelected ? 'pointer' : 'default', fontFamily: "'Patrick Hand', cursive", fontSize: '14px', opacity: isSelected ? 1 : 0.4 }}>-</button>
                <span style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '14px', minWidth: '18px', textAlign: 'center', color: '#1A1A1A' }}>{item.quantity}</span>
                <button onClick={() => changeQty(item.key, 1)} disabled={!isSelected}
                  style={{ width: '26px', height: '26px', border: '2px solid #1A1A1A', borderRadius: '8px', background: '#FEFEFE', cursor: isSelected ? 'pointer' : 'default', fontFamily: "'Patrick Hand', cursive", fontSize: '14px', opacity: isSelected ? 1 : 0.4 }}>+</button>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid #1A1A1A', paddingTop: '16px', marginBottom: '28px' }}>
        <span style={{ fontFamily: "'Caveat', cursive", fontSize: '1.3rem', color: '#1A1A1A' }}>Total</span>
        <span style={{ fontFamily: "'Caveat', cursive", fontSize: '1.3rem', color: '#1A1A1A' }}>${total.toFixed(2)}</span>
      </div>

      <button onClick={handleConfirm} disabled={submitting}
        style={{
          width: '100%', padding: '16px', background: '#1A1A1A', color: '#FEFEFE',
          border: 'none', borderRadius: '12px', fontFamily: "'Caveat', cursive",
          fontSize: '1.2rem', cursor: submitting ? 'default' : 'pointer', letterSpacing: '1px',
          opacity: submitting ? 0.6 : 1,
        }}>
        {submitting ? 'placing order...' : 'confirm & order →'}
      </button>

    </div>
  )
}

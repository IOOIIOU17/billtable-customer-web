import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function OrderHistory() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/orders')
      .then(res => {
        setOrders(res.data.data || res.data.orders || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const statusColor = (status) => {
    if (status === 'delivered') return '#1A1A1A'
    if (status === 'cancelled') return '#4A4A4A'
    return '#4A4A4A'
  }

  const handleReorder = (order) => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    api.post('/api/orders', {
      restaurantId: order.restaurant_id,
      items: (order.order_items || []).map(i => ({ name: i.item_name, quantity: i.quantity, unitPrice: i.unit_price }))
    }).then(res => {
      const newOrder = res.data.order || res.data
      navigate(`/tracking/${newOrder.id}`)
    }).catch(() => alert('Reorder failed. Please try again.'))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', padding: '32px 24px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/')} style={{ padding: '8px 16px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer', background: 'var(--color-paper)' }}>← Back</button>
        <h1 style={{ fontFamily: 'var(--font-logo)', fontSize: '28px' }}>My Orders</h1>
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-hint)', color: 'var(--color-pencil)' }}>Loading...</p>}

      {!loading && orders.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--color-pencil)' }}>No orders yet.</p>
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-light)', marginTop: '8px' }}>Your order history will appear here.</p>
          <button onClick={() => navigate('/')} style={{ marginTop: '24px', padding: '12px 24px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer', background: 'var(--color-ink)', color: 'var(--color-paper)' }}>Start an Order</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {orders.map(order => (
          <div key={order.id} style={{ border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', margin: '0 0 4px' }}>Order #{order.order_number?.slice(0, 8) || order.id?.toString().slice(0, 8)}</p>
                <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', margin: 0 }}>{order.guest_count} people · ${order.total_amount}</p>
                {order.theme && <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', margin: '4px 0 0' }}>Theme: {order.theme}</p>}
              </div>
              <span style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: statusColor(order.status), border: '1px solid var(--color-light)', borderRadius: '999px', padding: '4px 12px' }}>{order.status}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <button onClick={() => navigate(`/tracking/${order.id}`)} style={{ flex: 1, padding: '8px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '13px', cursor: 'pointer', background: 'var(--color-paper)' }}>Track Order</button>
              )}
              <button onClick={() => handleReorder(order)} style={{ flex: 1, padding: '8px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '13px', cursor: 'pointer', background: 'var(--color-ink)', color: 'var(--color-paper)' }}>Order Again</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

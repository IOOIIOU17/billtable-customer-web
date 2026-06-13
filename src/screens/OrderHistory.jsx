import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function OrderHistory() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratingDrafts, setRatingDrafts] = useState({}) // { [orderId]: { stars: 0, review: '' } }
  const [submitting, setSubmitting] = useState({}) // { [orderId]: true/false }

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

  const setDraft = (orderId, field, value) => {
    setRatingDrafts(prev => ({
      ...prev,
      [orderId]: { stars: 0, review: '', ...prev[orderId], [field]: value }
    }))
  }

  const handleSubmitRating = (order) => {
    const draft = ratingDrafts[order.id] || { stars: 0, review: '' }
    if (!draft.stars || draft.stars < 1 || draft.stars > 5) {
      alert('กรุณาเลือกจำนวนดาว (1-5)')
      return
    }
    setSubmitting(prev => ({ ...prev, [order.id]: true }))
    api.patch(`/api/orders/${order.id}/rating`, { rating: draft.stars, review: draft.review || null })
      .then(res => {
        const updated = res.data?.data?.order || res.data?.order
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, rating: updated?.rating ?? draft.stars, review: updated?.review ?? draft.review } : o))
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'ส่งรีวิวไม่สำเร็จ ลองใหม่อีกครั้ง')
      })
      .finally(() => {
        setSubmitting(prev => ({ ...prev, [order.id]: false }))
      })
  }

  const Star = ({ filled, onClick }) => (
    <span
      onClick={onClick}
      style={{
        fontSize: '24px',
        cursor: onClick ? 'pointer' : 'default',
        color: filled ? 'var(--color-ink)' : 'var(--color-light)',
        marginRight: '2px',
        lineHeight: 1,
      }}
    >★</span>
  )

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
        {orders.map(order => {
          const draft = ratingDrafts[order.id] || { stars: 0, review: '' }
          const isDelivered = order.status === 'delivered'
          const alreadyRated = order.rating !== null && order.rating !== undefined

          return (
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

              {isDelivered && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-light)' }}>
                  {alreadyRated ? (
                    <div>
                      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '12px', color: 'var(--color-pencil)', margin: '0 0 4px' }}>Your rating:</p>
                      <div>
                        {[1, 2, 3, 4, 5].map(n => <Star key={n} filled={n <= order.rating} />)}
                      </div>
                      {order.review && (
                        <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', marginTop: '8px', fontStyle: 'italic' }}>"{order.review}"</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '12px', color: 'var(--color-pencil)', margin: '0 0 6px' }}>How was your meal?</p>
                      <div style={{ marginBottom: '8px' }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star key={n} filled={n <= draft.stars} onClick={() => setDraft(order.id, 'stars', n)} />
                        ))}
                      </div>
                      <textarea
                        value={draft.review}
                        onChange={(e) => setDraft(order.id, 'review', e.target.value)}
                        placeholder="Leave a review (optional)..."
                        style={{
                          width: '100%',
                          minHeight: '60px',
                          padding: '8px',
                          border: '2px solid var(--color-ink)',
                          borderRadius: 'var(--radius)',
                          fontFamily: 'var(--font-hint)',
                          fontSize: '13px',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                          marginBottom: '8px',
                        }}
                      />
                      <button
                        onClick={() => handleSubmitRating(order)}
                        disabled={submitting[order.id]}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '2px solid var(--color-ink)',
                          borderRadius: 'var(--radius)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          cursor: submitting[order.id] ? 'default' : 'pointer',
                          background: 'var(--color-ink)',
                          color: 'var(--color-paper)',
                          opacity: submitting[order.id] ? 0.6 : 1,
                        }}
                      >
                        {submitting[order.id] ? 'Submitting...' : 'Submit Rating'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

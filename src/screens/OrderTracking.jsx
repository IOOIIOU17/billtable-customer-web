import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function OrderTracking() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const steps = ['pending', 'accepted', 'preparing', 'delivered']
  const stepLabels = { pending: 'Pending', accepted: 'Accepted', preparing: 'Preparing', delivered: 'Delivered' }
  const stepDesc = { pending: 'Waiting for restaurant to accept', accepted: 'Restaurant accepted your order', preparing: 'Restaurant is preparing your food', delivered: 'Your order has been delivered!' }

  const fetchOrder = () => {
    api.get(`/api/orders/${orderId}`)
      .then(res => {
        setOrder(res.data?.data?.order || res.data?.order || res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrder()
    const interval = setInterval(fetchOrder, 15000)
    return () => clearInterval(interval)
  }, [orderId])

  const currentStep = order ? steps.indexOf(order.status) : 0
  const [cancelling, setCancelling] = useState(false)
  const [cancelMsg, setCancelMsg] = useState('')

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order? You will receive a full refund.')) return
    setCancelling(true)
    try {
      const token = localStorage.getItem('token')
      await api.post(`/api/payments/refund`,
        { orderId: order.id, refundType: 'full' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCancelMsg('Order cancelled. Refund is being processed.')
      fetchOrder()
    } catch (err) {
      setCancelMsg(err.response?.data?.message || 'Could not cancel order.')
    }
    setCancelling(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', padding: '32px 24px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/history')} style={{ padding: '8px 16px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer', background: 'var(--color-paper)' }}>← Back</button>
        <h1 style={{ fontFamily: 'var(--font-logo)', fontSize: '28px' }}>Order Status</h1>
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-hint)', color: 'var(--color-pencil)' }}>Loading...</p>}

      {!loading && !order && (
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-pencil)' }}>Order not found.</p>
      )}

      {!loading && order && (
        <div>
          <div style={{ border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '24px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', margin: '0 0 4px' }}>Order #{order.order_number?.slice(0, 8) || order.id?.toString().slice(0, 8)}</p>
            <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', margin: 0 }}>{order.guest_count} people · ${order.total_amount}</p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            {steps.map((step, index) => {
              const done = index <= currentStep
              const active = index === currentStep
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--color-ink)', background: done ? 'var(--color-ink)' : 'var(--color-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {done && <span style={{ color: 'var(--color-paper)', fontSize: '14px' }}>✓</span>}
                    </div>
                    {index < steps.length - 1 && (
                      <div style={{ width: '2px', height: '32px', background: index < currentStep ? 'var(--color-ink)' : 'var(--color-light)', marginTop: '4px' }} />
                    )}
                  </div>
                  <div style={{ paddingTop: '4px' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: active ? '16px' : '14px', fontWeight: active ? 'bold' : 'normal', margin: '0 0 2px', color: done ? 'var(--color-ink)' : 'var(--color-light)' }}>{stepLabels[step]}</p>
                    {active && <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', margin: 0 }}>{stepDesc[step]}</p>}
                  </div>
                </div>
              )
            })}
          </div>

          {order.status === 'pending' && (
            <div style={{ marginBottom: '16px' }}>
              <button onClick={handleCancel} disabled={cancelling} style={{ width: '100%', padding: '12px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-ink)', background: 'var(--color-paper)', cursor: cancelling ? 'not-allowed' : 'pointer' }}>
                {cancelling ? 'Cancelling...' : 'Cancel Order (Full Refund)'}
              </button>
              {cancelMsg && <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-ink)', textAlign: 'center', marginTop: '8px' }}>{cancelMsg}</p>}
            </div>
          )}
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '12px', color: 'var(--color-pencil)', textAlign: 'center' }}>Auto-refreshes every 15 seconds</p>
        </div>
      )}
    </div>
  )
}

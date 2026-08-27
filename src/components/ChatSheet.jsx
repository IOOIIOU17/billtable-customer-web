import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';

// ChatSheet — real table chat, slides in from the RIGHT edge of the screen
// (not the bottom-sheet style used by Food/Members/Invite). Backed by
// GET/POST /api/orders/:orderId/messages, polled every 4s while open (no
// WebSocket infra needed). Messages auto-expire on the server 1 day after
// the table's delivery_time passes.
export default function ChatSheet({ open, onClose, orderId, myName }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef(null);
  const lastIdRef = useRef(null);
  const pollRef = useRef(null);

  // Keep the panel mounted briefly after close so the slide-out transition
  // can play instead of the panel just vanishing.
  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const id = setTimeout(() => setMounted(false), 220);
    return () => clearTimeout(id);
  }, [open]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  }, []);

  // Full history on open, then poll for anything new every 4s.
  useEffect(() => {
    if (!open || !orderId) return;

    let cancelled = false;

    const loadHistory = async () => {
      try {
        const res = await api.get(`/api/orders/${orderId}/messages`);
        if (cancelled) return;
        const msgs = res.data?.data?.messages || [];
        setMessages(msgs);
        lastIdRef.current = msgs.length ? msgs[msgs.length - 1].id : null;
        setError('');
        scrollToBottom();
      } catch {
        if (!cancelled) setError('Could not load chat. Pull down to try again.');
      }
    };

    const pollNew = async () => {
      try {
        const params = lastIdRef.current ? { sinceId: lastIdRef.current } : {};
        const res = await api.get(`/api/orders/${orderId}/messages`, { params });
        if (cancelled) return;
        const fresh = res.data?.data?.messages || [];
        if (fresh.length) {
          setMessages((prev) => [...prev, ...fresh]);
          lastIdRef.current = fresh[fresh.length - 1].id;
          scrollToBottom();
        }
      } catch {
        // silent — a missed poll isn't worth surfacing an error for
      }
    };

    loadHistory();
    pollRef.current = setInterval(pollNew, 4000);
    return () => {
      cancelled = true;
      clearInterval(pollRef.current);
    };
  }, [open, orderId, scrollToBottom]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !orderId || sending) return;
    setSending(true);
    setError('');
    try {
      const res = await api.post(`/api/orders/${orderId}/messages`, {
        senderName: myName || 'You',
        message: trimmed,
      });
      const saved = res.data?.data?.message;
      if (saved) {
        setMessages((prev) => [...prev, saved]);
        lastIdRef.current = saved.id;
        scrollToBottom();
      }
      setText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send that message.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 30,
        background: visible ? 'rgba(26,26,26,0.35)' : 'rgba(26,26,26,0)',
        transition: 'background 0.22s ease',
        display: 'flex', justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '85%', maxWidth: '380px',
          height: '100dvh',
          background: 'var(--color-paper)',
          borderLeft: '2px solid var(--color-ink)',
          padding: '20px 16px 16px',
          display: 'flex', flexDirection: 'column', gap: '12px',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.22s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
          <p style={{ fontFamily: 'var(--font-logo)', fontSize: '26px', margin: 0 }}>Chat</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-ink)' }}>✕</button>
        </div>

        <div
          ref={listRef}
          style={{
            flex: 1, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '10px',
            padding: '4px',
          }}
        >
          {messages.length === 0 && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 16px' }}>
              <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', margin: 0 }}>
                No messages yet. Say hi to your table.
              </p>
            </div>
          )}
          {messages.map((m) => {
            const mine = m.sender_name === (myName || 'You');
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start' }}>
                {!mine && (
                  <span style={{ fontFamily: 'var(--font-hint)', fontSize: '11px', color: 'var(--color-pencil)', margin: '0 4px 2px' }}>
                    {m.sender_name}
                  </span>
                )}
                <div style={{
                  maxWidth: '80%',
                  padding: '9px 13px',
                  borderRadius: 'var(--radius)',
                  border: '2px solid var(--color-ink)',
                  background: mine ? 'var(--color-ink)' : 'var(--color-paper)',
                  color: mine ? 'var(--color-paper)' : 'var(--color-ink)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  wordBreak: 'break-word',
                }}>
                  {m.message}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '12px', color: 'var(--color-ink)', margin: '0 4px' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: '8px', padding: '0 4px' }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message your table..."
            style={{
              flex: 1, padding: '10px 12px', fontSize: '15px', fontFamily: 'var(--font-body)',
              border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            style={{
              padding: '10px 16px', fontFamily: 'var(--font-body)', fontSize: '15px',
              border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
              background: text.trim() ? 'var(--color-ink)' : 'var(--color-light)',
              color: text.trim() ? 'var(--color-paper)' : 'var(--color-pencil)',
              cursor: text.trim() && !sending ? 'pointer' : 'not-allowed',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

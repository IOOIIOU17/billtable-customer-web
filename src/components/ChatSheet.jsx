import { useEffect, useState } from 'react';

// ChatSheet — a long panel that slides in from the RIGHT edge of the
// screen (not the bottom-sheet style used by Food/Members/Invite). Its own
// button on Table Home opens it. Placeholder content for now — real chat
// (Stream Chat, Phase 7) isn't wired up yet.
export default function ChatSheet({ open, onClose }) {
  // Keep the panel mounted briefly after close so the slide-out transition
  // can play instead of the panel just vanishing.
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // next tick, so the transform transition actually runs
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const id = setTimeout(() => setMounted(false), 220);
    return () => clearTimeout(id);
  }, [open]);

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
          padding: '20px',
          display: 'flex', flexDirection: 'column', gap: '16px',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.22s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: 'var(--font-logo)', fontSize: '26px', margin: 0 }}>Chat</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-ink)' }}>✕</button>
        </div>

        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '8px', textAlign: 'center',
        }}>
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '15px', color: 'var(--color-pencil)', margin: 0 }}>
            Chat is coming soon.
          </p>
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', margin: 0 }}>
            You'll be able to message everyone at this table here.
          </p>
        </div>
      </div>
    </div>
  );
}

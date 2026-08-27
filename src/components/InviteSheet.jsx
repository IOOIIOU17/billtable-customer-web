import { useState } from 'react';

// InviteSheet — lets the host share this table. The QR code is generated
// via a free no-key image API (api.qrserver.com) so there's nothing to
// install or configure; it just encodes the /join/:orderId link.
export default function InviteSheet({ open, onClose, orderId }) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const joinUrl = `${window.location.origin}/join/${orderId}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(joinUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — the link is still shown, they can select it manually
    }
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 30, background: 'rgba(26,26,26,0.35)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '480px', maxHeight: '85dvh', overflowY: 'auto',
          background: 'var(--color-paper)', border: '2px solid var(--color-ink)', borderBottom: 'none',
          borderRadius: '22px 22px 0 0', padding: '20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: 'var(--font-logo)', fontSize: '26px', margin: 0 }}>Invite to the table</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-ink)' }}>✕</button>
        </div>

        <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)', textAlign: 'center', margin: 0 }}>
          Anyone who scans this or opens the link joins straight into this table — no need to set anything up again.
        </p>

        <img src={qrSrc} alt="QR code to join this table" width={200} height={200} style={{ border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)' }} />

        <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
          <div style={{
            flex: 1, padding: '12px 14px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-hint)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {joinUrl}
          </div>
          <button
            onClick={handleCopy}
            style={{ padding: '12px 16px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', background: 'var(--color-ink)', color: 'var(--color-paper)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

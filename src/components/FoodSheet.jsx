import { useState } from 'react';

// FoodSheet — bottom sheet opened from the Bill Bar. Any Member can add
// items here (Feature 2: open ordering, no "one host orders for everyone"
// restriction). The first time someone without a saved name opens it,
// they're asked for a name once — that name is what tags every item they
// add ("added by ___"), and it's remembered for the rest of the session.
export default function FoodSheet({ open, onClose, menus, partyItems, myName, onSetMyName, onAddItem, onDecrementItem }) {
  const [nameInput, setNameInput] = useState('');

  if (!open) return null;

  const myItems = partyItems.filter((p) => p.addedBy === myName);
  const grouped = partyItems.reduce((acc, p) => {
    (acc[p.addedBy] = acc[p.addedBy] || []).push(p);
    return acc;
  }, {});

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 30,
        background: 'rgba(26,26,26,0.35)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '480px',
          maxHeight: '85dvh', overflowY: 'auto',
          background: 'var(--color-paper)',
          border: '2px solid var(--color-ink)', borderBottom: 'none',
          borderRadius: '22px 22px 0 0',
          padding: '20px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: 'var(--font-logo)', fontSize: '26px', margin: 0 }}>Add to the table</p>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-ink)' }}
          >
            ✕
          </button>
        </div>

        {!myName ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontFamily: 'var(--font-hint)', fontSize: '15px', color: 'var(--color-pencil)', margin: 0 }}>
              What's your name? So we know who ordered what.
            </p>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              style={{
                width: '100%', padding: '12px 14px', fontSize: '16px',
                fontFamily: 'var(--font-body)', border: '2px solid var(--color-ink)',
                borderRadius: 'var(--radius)', background: 'var(--color-paper)',
              }}
            />
            <button
              onClick={() => nameInput.trim() && onSetMyName(nameInput.trim())}
              disabled={!nameInput.trim()}
              style={{
                width: '100%', background: 'var(--color-ink)', color: 'var(--color-paper)',
                border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
                padding: '14px', fontFamily: 'var(--font-body)', fontSize: '17px',
                cursor: nameInput.trim() ? 'pointer' : 'not-allowed',
                opacity: nameInput.trim() ? 1 : 0.5,
              }}
            >
              Continue →
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', margin: 0 }}>
              Ordering as <strong style={{ color: 'var(--color-ink)' }}>{myName}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {menus.length === 0 && (
                <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>No menu items yet.</p>
              )}
              {menus.map((m, i) => {
                const mine = myItems.find((p) => p.menuItemId === (m.id ?? m.name));
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light)', paddingBottom: '10px' }}>
                    <div>
                      <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '16px' }}>{m.name}</p>
                      <p style={{ margin: 0, fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)' }}>${m.price ?? '-'}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {mine && (
                        <>
                          <button
                            onClick={() => onDecrementItem(mine.id)}
                            style={{ width: '30px', height: '30px', borderRadius: '999px', border: '2px solid var(--color-ink)', background: 'var(--color-paper)', fontSize: '16px', cursor: 'pointer' }}
                          >
                            −
                          </button>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', minWidth: '14px', textAlign: 'center' }}>{mine.quantity}</span>
                        </>
                      )}
                      <button
                        onClick={() => onAddItem({ menuItemId: m.id ?? m.name, name: m.name, price: m.price || 0, addedBy: myName })}
                        style={{ width: '30px', height: '30px', borderRadius: '999px', border: '2px solid var(--color-ink)', background: 'var(--color-ink)', color: 'var(--color-paper)', fontSize: '16px', cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {Object.keys(grouped).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '2px solid var(--color-ink)', paddingTop: '14px' }}>
                <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', margin: 0 }}>On the table so far</p>
                {Object.entries(grouped).map(([person, items]) => (
                  <div key={person}>
                    <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 'bold' }}>{person}</p>
                    {items.map((it) => (
                      <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-pencil)' }}>
                        <span>{it.quantity}× {it.name}</span>
                        <span>${(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

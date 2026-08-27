import { useState } from 'react';

// MemberPanel — Roster / Activities. Chat now lives in its own ChatSheet
// (opened from its own button on Table Home), not as a tab here.
export default function MemberPanel({ open, onClose, members, activities, onAddActivity }) {
  const [tab, setTab] = useState('roster');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  if (!open) return null;

  const tabs = [
    { key: 'roster', label: 'Members' },
    { key: 'activities', label: 'Activities' },
  ];

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
          <p style={{ fontFamily: 'var(--font-logo)', fontSize: '26px', margin: 0 }}>Your table</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-ink)' }}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: '10px', fontFamily: 'var(--font-body)', fontSize: '14px',
                border: '2px solid var(--color-ink)', borderRadius: '999px', cursor: 'pointer',
                background: tab === t.key ? 'var(--color-ink)' : 'var(--color-paper)',
                color: tab === t.key ? 'var(--color-paper)' : 'var(--color-ink)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'roster' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {members.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--color-light)', paddingBottom: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '999px',
                  border: '2px solid var(--color-ink)',
                  background: m.role === 'host' ? 'var(--color-ink)' : 'var(--color-paper)',
                  color: m.role === 'host' ? 'var(--color-paper)' : 'var(--color-ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-body)', fontSize: '14px', flexShrink: 0,
                }}>
                  {m.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '15px' }}>{m.name}</p>
                  <p style={{ margin: 0, fontFamily: 'var(--font-hint)', fontSize: '12px', color: 'var(--color-pencil)' }}>
                    {m.role === 'host' ? 'Host' : 'Guest'}{m.itemCount ? ` · ${m.itemCount} item${m.itemCount === 1 ? '' : 's'} added` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'activities' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activities.length === 0 && (
              <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>No activities added yet.</p>
            )}
            {activities.map((a) => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-light)', paddingBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px' }}>{a.title}</span>
                <span style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)' }}>{a.time}</span>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '2px solid var(--color-ink)', paddingTop: '14px' }}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Activity (e.g. Cake cutting)"
                style={{ width: '100%', padding: '10px 12px', fontSize: '15px', fontFamily: 'var(--font-body)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)' }}
              />
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Time (e.g. 7:30 PM)"
                style={{ width: '100%', padding: '10px 12px', fontSize: '15px', fontFamily: 'var(--font-body)', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)' }}
              />
              <button
                onClick={() => {
                  if (!title.trim()) return;
                  onAddActivity({ title: title.trim(), time: time.trim() || '-' });
                  setTitle(''); setTime('');
                }}
                disabled={!title.trim()}
                style={{
                  width: '100%', padding: '12px', fontFamily: 'var(--font-body)', fontSize: '15px',
                  border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)',
                  background: 'var(--color-ink)', color: 'var(--color-paper)',
                  cursor: title.trim() ? 'pointer' : 'not-allowed', opacity: title.trim() ? 1 : 0.5,
                }}
              >
                + Add Activity
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import TableRing from '../components/TableRing';

// TEMPORARY test screen for Phase 1 (Table Concept) — lets Tony check the
// TableRing component at different guest counts before it's wired into the
// real Table shell in Phase 2. Safe to delete once Phase 2 is done.
export default function TableRingPreview() {
  const [n, setN] = useState(6);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-paper)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 16px',
        gap: '24px',
      }}
    >
      <p style={{ fontFamily: 'var(--font-hint)', fontSize: '14px', color: 'var(--color-pencil)' }}>
        Phase 1 test screen — จะลบทิ้งหลัง Phase 2 เสร็จ
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label
          htmlFor="guestCount"
          style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--color-ink)' }}
        >
          Guest count:
        </label>
        <input
          id="guestCount"
          type="number"
          min="1"
          max="60"
          value={n}
          onChange={(e) => setN(Math.max(1, Number(e.target.value) || 1))}
          style={{
            width: '90px',
            padding: '8px 12px',
            border: '2px solid var(--color-ink)',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            textAlign: 'center',
            background: 'var(--color-paper)',
            color: 'var(--color-ink)',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[2, 4, 6, 8, 12, 20, 45].map((preset) => (
          <button
            key={preset}
            onClick={() => setN(preset)}
            style={{
              background: n === preset ? 'var(--color-ink)' : 'var(--color-paper)',
              color: n === preset ? 'var(--color-paper)' : 'var(--color-ink)',
              border: '2px solid var(--color-ink)',
              borderRadius: 'var(--radius)',
              padding: '6px 14px',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            {preset}
          </button>
        ))}
      </div>

      <TableRing guestCount={n} />
    </div>
  );
}

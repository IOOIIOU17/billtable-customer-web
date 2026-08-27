import { Outlet, useLocation } from 'react-router-dom';
import TableRing from './TableRing';
import useOrderStore from '../store/orderStore';
import './TableFlowLayout.css';

// Order of the floating-card steps for the Dots progress indicator.
// Each entry is a group of routes that count as ONE step (auth has two
// alternate routes — Sign Up and Log In — but they're the same step).
const STEP_GROUPS = [
  ['/signup', '/login'],
  ['/theme'],
  ['/guests'],
  ['/budget'],
  ['/taste'],
  ['/allergy'],
  ['/drinks'],
  ['/cake'],
  ['/time'],
  ['/matching'],
  ['/result'],
  ['/community'],
  ['/summary'],
  ['/payment'],
  ['/confirmation'],
];

function getStepIndex(pathname) {
  const idx = STEP_GROUPS.findIndex((group) => group.includes(pathname));
  return idx === -1 ? 0 : idx;
}

export default function TableFlowLayout() {
  const location = useLocation();
  const guestCount = useOrderStore((s) => s.guestCount);
  const stepIndex = getStepIndex(location.pathname);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100dvh',
        background: 'var(--color-paper)',
        overflow: 'hidden',
      }}
    >
      {/* Table — blurred, sits behind the card */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'blur(1px)',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      >
        <TableRing guestCount={guestCount || 6} />
      </div>

      {/* Dots progress */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          {STEP_GROUPS.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === stepIndex ? '18px' : '8px',
                height: '8px',
                borderRadius: '999px',
                background: i <= stepIndex ? 'var(--color-ink)' : 'var(--color-light)',
                transition: 'width 0.2s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating card — wraps whichever step screen matched the route */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: 'calc(100dvh - 48px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <div
          className="table-flow-outlet"
          style={{
            width: '100%',
            maxWidth: '420px',
            maxHeight: '85dvh',
            overflowY: 'auto',
            background: 'var(--color-paper)',
            border: '2px solid var(--color-ink)',
            borderRadius: '22px',
            boxShadow: '0 6px 0 rgba(26,26,26,0.08)',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

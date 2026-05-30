import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-paper)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      gap: '24px',
    }}>

      <h1 style={{
        fontFamily: 'var(--font-logo)',
        fontSize: '48px',
        color: 'var(--color-ink)',
        letterSpacing: '-1px',
      }}>
        BillTable
      </h1>

      <div style={{
        width: '200px',
        height: '200px',
        border: '2px solid var(--color-light)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-pencil)',
        fontFamily: 'var(--font-hint)',
        fontSize: '13px',
      }}>
        [ doodle here ]
      </div>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '18px',
        color: 'var(--color-pencil)',
        textAlign: 'center',
      }}>
        Table first. Food follows.
      </p>

      <button
        onClick={() => navigate('/signup')}
        style={{
          background: 'var(--color-ink)',
          color: 'var(--color-paper)',
          border: '2px solid var(--color-ink)',
          borderRadius: 'var(--radius)',
          padding: '14px 48px',
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        Start a Table
      </button>

    </div>
  );
}

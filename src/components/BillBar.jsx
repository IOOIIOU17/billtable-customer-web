// BillBar — sticky bottom bar on Table Home. Shows the live running total
// for the whole table (everyone's items combined) and opens the Food Sheet.
export default function BillBar({ itemCount, total, onOpenFood }) {
  return (
    <button
      onClick={onOpenFood}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--color-ink)',
        color: 'var(--color-paper)',
        border: 'none',
        borderTop: '2px solid var(--color-ink)',
        padding: '16px 20px',
        cursor: 'pointer',
      }}
    >
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}>
        {itemCount > 0 ? `${itemCount} item${itemCount === 1 ? '' : 's'} on the table` : 'Nothing on the table yet'}
      </span>
      <span style={{ fontFamily: 'var(--font-logo)', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ${total.toFixed(2)}
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', border: '1.5px solid var(--color-paper)', borderRadius: '999px', padding: '4px 10px' }}>
          + Add
        </span>
      </span>
    </button>
  );
}

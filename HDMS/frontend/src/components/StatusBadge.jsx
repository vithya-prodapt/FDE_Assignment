const STATUS_STYLES = {
  'Open':        { background: '#DBEAFE', color: '#1D4ED8' },
  'In Progress': { background: '#FEF3C7', color: '#B45309' },
  'Resolved':    { background: '#D1FAE5', color: '#065F46' },
  'Closed':      { background: '#F3F4F6', color: '#374151' },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || { background: '#F3F4F6', color: '#374151' };
  return (
    <span style={{
      ...style,
      padding: '3px 10px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}

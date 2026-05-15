const PRIORITY_STYLES = {
  'Low':      { background: '#D1FAE5', color: '#065F46' },
  'Medium':   { background: '#DBEAFE', color: '#1D4ED8' },
  'High':     { background: '#FEF3C7', color: '#B45309' },
  'Critical': { background: '#FEE2E2', color: '#991B1B' },
};

const PRIORITY_ICONS = {
  'Low':      'fa-arrow-down',
  'Medium':   'fa-minus',
  'High':     'fa-arrow-up',
  'Critical': 'fa-exclamation',
};

export default function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] || { background: '#F3F4F6', color: '#374151' };
  const icon = PRIORITY_ICONS[priority] || 'fa-minus';
  return (
    <span style={{
      ...style,
      padding: '3px 10px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
    }}>
      <i className={`fas ${icon}`} style={{ fontSize: '0.65rem' }}></i>
      {priority}
    </span>
  );
}

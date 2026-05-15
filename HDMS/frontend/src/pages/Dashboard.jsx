import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const STATUSES  = ['Open', 'In Progress', 'Resolved', 'Closed'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const STATUS_ICONS = {
  'Open':        { icon: 'fa-folder-open',  bg: '#DBEAFE', color: '#1D4ED8' },
  'In Progress': { icon: 'fa-rotate',       bg: '#FEF3C7', color: '#B45309' },
  'Resolved':    { icon: 'fa-circle-check', bg: '#D1FAE5', color: '#065F46' },
  'Closed':      { icon: 'fa-lock',         bg: '#F3F4F6', color: '#374151' },
};

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    ticketService.getAll()
      .then((res) => setTickets(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><i className="fas fa-spinner fa-spin"></i> Loading dashboard...</div>;
  if (error)   return <div className="alert alert-error"><i className="fas fa-triangle-exclamation"></i> {error}</div>;

  const countBy = (key, value) => tickets.filter((t) => t[key] === value).length;
  const recent  = [...tickets].slice(0, 5);

  return (
    <div className="page-fade">
      {/* Summary stat */}
      <div className="stat-hero">
        <div className="stat-hero-number">{tickets.length}</div>
        <div className="stat-hero-label">Total Tickets</div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/tickets/new')}>
          <i className="fas fa-plus"></i> New Ticket
        </button>
      </div>

      {/* Status cards */}
      <div className="section-title">By Status</div>
      <div className="cards-grid">
        {STATUSES.map((s) => {
          const meta = STATUS_ICONS[s];
          return (
            <div
              key={s}
              className="stat-card"
              style={{ '--card-accent': meta.color, cursor: 'pointer' }}
              onClick={() => navigate(`/tickets?status=${encodeURIComponent(s)}`)}
            >
              <div className="stat-card-icon" style={{ background: meta.bg, color: meta.color }}>
                <i className={`fas ${meta.icon}`}></i>
              </div>
              <div className="stat-card-body">
                <div className="stat-card-number">{countBy('status', s)}</div>
                <div className="stat-card-label">{s}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Priority cards */}
      <div className="section-title" style={{ marginTop: '2rem' }}>By Priority</div>
      <div className="cards-grid">
        {[
          { p: 'Low',      bg: '#D1FAE5', color: '#065F46', icon: 'fa-arrow-down'    },
          { p: 'Medium',   bg: '#DBEAFE', color: '#1D4ED8', icon: 'fa-minus'          },
          { p: 'High',     bg: '#FEF3C7', color: '#B45309', icon: 'fa-arrow-up'       },
          { p: 'Critical', bg: '#FEE2E2', color: '#991B1B', icon: 'fa-exclamation'    },
        ].map(({ p, bg, color, icon }) => (
          <div
            key={p}
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/tickets?priority=${encodeURIComponent(p)}`)}
          >
            <div className="stat-card-icon" style={{ background: bg, color }}>
              <i className={`fas ${icon}`}></i>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-number">{countBy('priority', p)}</div>
              <div className="stat-card-label">{p} Priority</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent tickets */}
      <div className="section-title" style={{ marginTop: '2rem' }}>Recent Tickets</div>
      {recent.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-ticket" style={{ fontSize: '2.5rem', color: '#CBD5E1' }}></i>
          <p>No tickets yet. <button className="link-btn" onClick={() => navigate('/tickets/new')}>Create the first one.</button></p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t.ticket_id}>
                  <td className="td-id">#{t.ticket_id}</td>
                  <td>
                    <div className="td-name">{t.employee_name}</div>
                    <div className="td-sub">{t.department}</div>
                  </td>
                  <td>{t.issue_category}</td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td><StatusBadge status={t.status} /></td>
                  <td className="td-sub">{new Date(t.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/tickets/${t.ticket_id}`)}>
                      View <i className="fas fa-arrow-right"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const CATEGORIES = [
  'VPN Issue', 'Password Reset', 'Software Installation',
  'Laptop Issue', 'Email Access', 'Network Connectivity',
  'Hardware Request', 'Other',
];

export default function SearchPage() {
  const [q, setQ]             = useState('');
  const [status, setStatus]   = useState('');
  const [category, setCat]    = useState('');
  const [priority, setPri]    = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (q)        params.q        = q;
      if (status)   params.status   = status;
      if (category) params.category = category;
      if (priority) params.priority = priority;
      const res = await ticketService.search(params);
      setResults(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQ(''); setStatus(''); setCat(''); setPri('');
    setResults(null);
  };

  return (
    <div className="page-fade">
      <div className="form-card">
        <div className="form-card-header">
          <i className="fas fa-magnifying-glass"></i> Search &amp; Filter Tickets
        </div>
        <form onSubmit={handleSearch}>
          <div className="search-input-wrap">
            <i className="fas fa-magnifying-glass search-icon"></i>
            <input
              className="form-input search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by keyword, employee name, description..."
            />
          </div>
          <div className="form-grid-3" style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Statuses</option>
                {['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={(e) => setCat(e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={priority} onChange={(e) => setPri(e.target.value)}>
                <option value="">All Priorities</option>
                {['Low', 'Medium', 'High', 'Critical'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Searching...</> : <><i className="fas fa-magnifying-glass"></i> Search</>}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-error"><i className="fas fa-triangle-exclamation"></i> {error}</div>}

      {results !== null && (
        <>
          <div className="section-title">{results.length} result{results.length !== 1 ? 's' : ''} found</div>
          {results.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-magnifying-glass" style={{ fontSize: '2.5rem', color: '#CBD5E1' }}></i>
              <p>No tickets matched your search criteria.</p>
            </div>
          ) : (
            <div className="card">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((t) => (
                    <tr key={t.ticket_id}>
                      <td className="td-id">#{t.ticket_id}</td>
                      <td>
                        <div className="td-name">{t.employee_name}</div>
                        <div className="td-sub">{t.department}</div>
                      </td>
                      <td><span className="category-chip">{t.issue_category}</span></td>
                      <td className="td-description">{t.description.length > 60 ? t.description.slice(0, 60) + '…' : t.description}</td>
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
        </>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ticketService from '../services/ticketService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ConfirmModal from '../components/ConfirmModal';

const CATEGORIES = [
  'VPN Issue', 'Password Reset', 'Software Installation',
  'Laptop Issue', 'Email Access', 'Network Connectivity',
  'Hardware Request', 'Other',
];

export default function TicketList() {
  const [tickets, setTickets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [deleting, setDeleting] = useState(null);
  const [modal, setModal]       = useState({ open: false, id: null });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    status:   searchParams.get('status')   || '',
    category: searchParams.get('category') || '',
    priority: searchParams.get('priority') || '',
  });

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.status)   params.status   = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;
      const res = await ticketService.getAll(params);
      setTickets(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const next = { ...filters, [name]: value };
    setFilters(next);
    const params = {};
    if (next.status)   params.status   = next.status;
    if (next.category) params.category = next.category;
    if (next.priority) params.priority = next.priority;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ status: '', category: '', priority: '' });
    setSearchParams({});
  };

  const confirmDelete = (id) => setModal({ open: true, id });
  const cancelDelete  = () => setModal({ open: false, id: null });

  const handleDelete = async () => {
    const id = modal.id;
    setModal({ open: false, id: null });
    setDeleting(id);
    try {
      await ticketService.remove(id);
      setTickets((prev) => prev.filter((t) => t.ticket_id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const activeFilters = [filters.status, filters.category, filters.priority].filter(Boolean).length;

  return (
    <div className="page-fade">
      {/* Filter bar */}
      <div className="filter-bar card">
        <div className="filter-bar-row">
          <select className="form-select filter-select" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            {['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="form-select filter-select" name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="form-select filter-select" name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">All Priorities</option>
            {['Low', 'Medium', 'High', 'Critical'].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          {activeFilters > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
              <i className="fas fa-xmark"></i> Clear ({activeFilters})
            </button>
          )}
          <span className="filter-count">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</span>
          <button className="btn btn-primary btn-sm ms-auto" onClick={() => navigate('/tickets/new')}>
            <i className="fas fa-plus"></i> New
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error"><i className="fas fa-triangle-exclamation"></i> {error}</div>}

      {loading ? (
        <div className="loading"><i className="fas fa-spinner fa-spin"></i> Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-inbox" style={{ fontSize: '2.5rem', color: '#CBD5E1' }}></i>
          <p>No tickets found. {activeFilters > 0 ? <button className="link-btn" onClick={clearFilters}>Clear filters</button> : <button className="link-btn" onClick={() => navigate('/tickets/new')}>Create one.</button>}</p>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.ticket_id} className={deleting === t.ticket_id ? 'row-deleting' : ''}>
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
                    <div className="action-btns">
                      <button className="btn btn-ghost btn-icon" title="View" onClick={() => navigate(`/tickets/${t.ticket_id}`)}>
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-icon-danger"
                        title="Delete"
                        onClick={() => confirmDelete(t.ticket_id)}
                        disabled={deleting === t.ticket_id}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={modal.open}
        title="Delete Ticket"
        message={`Are you sure you want to delete ticket #${modal.id}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

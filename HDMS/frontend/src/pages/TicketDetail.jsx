import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ConfirmModal from '../components/ConfirmModal';

const CATEGORIES = [
  'VPN Issue', 'Password Reset', 'Software Installation',
  'Laptop Issue', 'Email Access', 'Network Connectivity',
  'Hardware Request', 'Other',
];
const DEPARTMENTS = [
  'IT', 'HR', 'Finance', 'Operations', 'Sales',
  'Marketing', 'Engineering', 'Legal', 'Management', 'Other',
];

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saveMsg, setSaveMsg]   = useState('');
  const [saveErr, setSaveErr]   = useState('');
  const [showModal, setModal]   = useState(false);
  const [form, setForm]         = useState({});

  useEffect(() => {
    ticketService.getById(id)
      .then((res) => { setTicket(res.data); setForm(res.data); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    setSaveErr('');
    try {
      const res = await ticketService.update(id, {
        employee_name:   form.employee_name,
        department:      form.department,
        issue_category:  form.issue_category,
        description:     form.description,
        priority:        form.priority,
        status:          form.status,
        resolution_notes: form.resolution_notes,
      });
      setTicket(res.data);
      setForm(res.data);
      setEditing(false);
      setSaveMsg('Ticket updated successfully.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await ticketService.remove(id);
      navigate('/tickets');
    } catch (err) {
      setError(err.message);
      setModal(false);
    }
  };

  if (loading) return <div className="loading"><i className="fas fa-spinner fa-spin"></i> Loading ticket...</div>;
  if (error)   return <div className="alert alert-error"><i className="fas fa-triangle-exclamation"></i> {error}</div>;
  if (!ticket) return null;

  return (
    <div className="page-fade">
      {/* Header row */}
      <div className="detail-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tickets')}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <div className="detail-header-badges">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
        <div className="detail-header-actions">
          {!editing && (
            <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>
              <i className="fas fa-pen"></i> Edit
            </button>
          )}
          <button className="btn btn-danger btn-sm" onClick={() => setModal(true)}>
            <i className="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>

      {saveMsg && <div className="alert alert-success"><i className="fas fa-circle-check"></i> {saveMsg}</div>}
      {saveErr && <div className="alert alert-error"><i className="fas fa-triangle-exclamation"></i> {saveErr}</div>}

      <div className="detail-grid">
        {/* Left — info / edit form */}
        <div className="form-card">
          <div className="form-card-header">
            <i className="fas fa-ticket"></i> Ticket #{ticket.ticket_id}
            {editing && <span className="editing-pill">Editing</span>}
          </div>

          {editing ? (
            <form onSubmit={handleSave}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Employee Name</label>
                  <input className="form-input" name="employee_name" value={form.employee_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select" name="department" value={form.department} onChange={handleChange}>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="issue_category" value={form.issue_category} onChange={handleChange}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" name="priority" value={form.priority} onChange={handleChange}>
                    {['Low', 'Medium', 'High', 'Critical'].map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                  {['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Resolution Notes</label>
                <textarea
                  className="form-textarea"
                  name="resolution_notes"
                  value={form.resolution_notes || ''}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add resolution details..."
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setForm(ticket); }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-floppy-disk"></i> Save Changes</>}
                </button>
              </div>
            </form>
          ) : (
            <div className="detail-view">
              <div className="detail-grid-2">
                <div className="detail-field"><span className="detail-label">Employee</span><span className="detail-value">{ticket.employee_name}</span></div>
                <div className="detail-field"><span className="detail-label">Department</span><span className="detail-value">{ticket.department}</span></div>
                <div className="detail-field"><span className="detail-label">Category</span><span className="detail-value">{ticket.issue_category}</span></div>
                <div className="detail-field"><span className="detail-label">Priority</span><PriorityBadge priority={ticket.priority} /></div>
                <div className="detail-field"><span className="detail-label">Status</span><StatusBadge status={ticket.status} /></div>
                <div className="detail-field"><span className="detail-label">Created</span><span className="detail-value">{new Date(ticket.created_at).toLocaleString()}</span></div>
              </div>
              <div className="detail-field detail-full">
                <span className="detail-label">Description</span>
                <p className="detail-description">{ticket.description}</p>
              </div>
              {ticket.resolution_notes && (
                <div className="detail-field detail-full">
                  <span className="detail-label">Resolution Notes</span>
                  <p className="detail-description resolution-notes">{ticket.resolution_notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right — timeline */}
        <div className="timeline-card card">
          <div className="timeline-title"><i className="fas fa-clock-rotate-left"></i> Timeline</div>
          <div className="timeline-item">
            <div className="timeline-dot" style={{ background: '#2563EB' }}></div>
            <div>
              <div className="timeline-event">Ticket Created</div>
              <div className="timeline-time">{new Date(ticket.created_at).toLocaleString()}</div>
            </div>
          </div>
          {ticket.status !== 'Open' && (
            <div className="timeline-item">
              <div className="timeline-dot" style={{ background: '#F59E0B' }}></div>
              <div>
                <div className="timeline-event">Status: {ticket.status}</div>
                <div className="timeline-time">Updated</div>
              </div>
            </div>
          )}
          {ticket.resolution_notes && (
            <div className="timeline-item">
              <div className="timeline-dot" style={{ background: '#10B981' }}></div>
              <div>
                <div className="timeline-event">Resolution Added</div>
                <div className="timeline-time">By Support Admin</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showModal}
        title="Delete Ticket"
        message={`Delete ticket #${ticket.ticket_id} for ${ticket.employee_name}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setModal(false)}
      />
    </div>
  );
}

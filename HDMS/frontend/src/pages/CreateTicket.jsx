import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';

const CATEGORIES = [
  'VPN Issue', 'Password Reset', 'Software Installation',
  'Laptop Issue', 'Email Access', 'Network Connectivity',
  'Hardware Request', 'Other',
];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const DEPARTMENTS = [
  'IT', 'HR', 'Finance', 'Operations', 'Sales',
  'Marketing', 'Engineering', 'Legal', 'Management', 'Other',
];

const INITIAL = {
  employee_name: '',
  department: '',
  issue_category: '',
  description: '',
  priority: '',
  status: 'Open',
  resolution_notes: '',
};

export default function CreateTicket() {
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [submitting, setSub]  = useState(false);
  const [apiError, setApiErr] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.employee_name.trim())   e.employee_name   = 'Employee name is required';
    else if (form.employee_name.trim().length < 2) e.employee_name = 'Name must be at least 2 characters';
    if (!form.department)             e.department      = 'Department is required';
    if (!form.issue_category)         e.issue_category  = 'Category is required';
    if (!form.description.trim())     e.description     = 'Description is required';
    else if (form.description.trim().length < 10) e.description = 'Description must be at least 10 characters';
    if (!form.priority)               e.priority        = 'Priority is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSub(true);
    setApiErr('');
    try {
      const res = await ticketService.create(form);
      navigate(`/tickets/${res.data.ticket_id}`);
    } catch (err) {
      setApiErr(err.message);
    } finally {
      setSub(false);
    }
  };

  return (
    <div className="page-fade">
      <div className="form-card">
        <div className="form-card-header">
          <i className="fas fa-ticket"></i> New Support Ticket
        </div>

        {apiError && (
          <div className="alert alert-error">
            <i className="fas fa-triangle-exclamation"></i> {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid-2">
            {/* Employee Name */}
            <div className="form-group">
              <label className="form-label">Employee Name <span className="required">*</span></label>
              <input
                className={`form-input${errors.employee_name ? ' input-error' : ''}`}
                name="employee_name"
                value={form.employee_name}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
              />
              {errors.employee_name && <span className="field-error">{errors.employee_name}</span>}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label">Department <span className="required">*</span></label>
              <select
                className={`form-select${errors.department ? ' input-error' : ''}`}
                name="department"
                value={form.department}
                onChange={handleChange}
              >
                <option value="">-- Select Department --</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <span className="field-error">{errors.department}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Issue Category <span className="required">*</span></label>
              <select
                className={`form-select${errors.issue_category ? ' input-error' : ''}`}
                name="issue_category"
                value={form.issue_category}
                onChange={handleChange}
              >
                <option value="">-- Select Category --</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.issue_category && <span className="field-error">{errors.issue_category}</span>}
            </div>

            {/* Priority */}
            <div className="form-group">
              <label className="form-label">Priority <span className="required">*</span></label>
              <select
                className={`form-select${errors.priority ? ' input-error' : ''}`}
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="">-- Select Priority --</option>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.priority && <span className="field-error">{errors.priority}</span>}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description <span className="required">*</span></label>
            <textarea
              className={`form-textarea${errors.description ? ' input-error' : ''}`}
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the issue in detail..."
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/tickets')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : <><i className="fas fa-paper-plane"></i> Submit Ticket</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

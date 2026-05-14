import React, { useState, useEffect } from 'react';
import { getBorrowers, createBorrower, updateBorrower, deleteBorrower } from '../services/api';

const INITIAL_FORM = { borrower_name: '', email: '', phone: '' };

function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBorrower, setEditBorrower] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const fetchBorrowers = async () => {
    try {
      const res = await getBorrowers();
      setBorrowers(res.data);
    } catch {
      flash('danger', 'Failed to load borrowers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBorrowers(); }, []);

  const flash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const openAdd = () => {
    setEditBorrower(null);
    setForm(INITIAL_FORM);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditBorrower(b);
    setForm({ borrower_name: b.borrower_name, email: b.email, phone: b.phone });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.borrower_name.trim()) e.borrower_name = 'Name is required';
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Invalid email format';
    }
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      if (editBorrower) {
        await updateBorrower(editBorrower.borrower_id, form);
        flash('success', 'Borrower updated successfully');
      } else {
        await createBorrower(form);
        flash('success', 'Borrower added successfully');
      }
      setShowModal(false);
      fetchBorrowers();
    } catch (err) {
      flash('danger', err.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this borrower? This cannot be undone.')) return;
    try {
      await deleteBorrower(id);
      flash('success', 'Borrower deleted');
      fetchBorrowers();
    } catch {
      flash('danger', 'Failed to delete borrower');
    }
  };

  if (loading) return <div className="loading">Loading borrowers…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Borrower Management</h1>
          <p className="page-subtitle">{borrowers.length} registered borrower{borrowers.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Borrower</button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      <div className="card">
        {borrowers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-text">No borrowers yet</div>
            <div className="empty-state-subtext">Click "Add Borrower" to register one</div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {borrowers.map((b) => (
                  <tr key={b.borrower_id}>
                    <td style={{ color: '#94a3b8', fontWeight: 600 }}>{b.borrower_id}</td>
                    <td style={{ fontWeight: 600 }}>{b.borrower_name}</td>
                    <td style={{ color: '#2563eb' }}>{b.email}</td>
                    <td>{b.phone}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(b)}>
                          ✏️ Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.borrower_id)}>
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editBorrower ? 'Edit Borrower' : 'Add New Borrower'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className={`form-control${errors.borrower_name ? ' error' : ''}`}
                    value={form.borrower_name}
                    onChange={(e) => setForm({ ...form, borrower_name: e.target.value })}
                    placeholder="e.g. Jane Doe"
                  />
                  {errors.borrower_name && <div className="form-error">{errors.borrower_name}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className={`form-control${errors.email ? ' error' : ''}`}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. jane@example.com"
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className={`form-control${errors.phone ? ' error' : ''}`}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                  />
                  {errors.phone && <div className="form-error">{errors.phone}</div>}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editBorrower ? 'Update Borrower' : 'Add Borrower'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Borrowers;

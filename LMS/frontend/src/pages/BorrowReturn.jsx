import React, { useState, useEffect } from 'react';
import { getBooks, getBorrowers, getTransactions, borrowBook, returnBook } from '../services/api';

function BorrowReturn() {
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ book_id: '', borrower_id: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    try {
      const [bRes, brRes, txRes] = await Promise.all([
        getBooks(),
        getBorrowers(),
        getTransactions(),
      ]);
      setBooks(bRes.data);
      setBorrowers(brRes.data);
      setTransactions(txRes.data);
    } catch {
      flash('danger', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const flash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (!form.book_id || !form.borrower_id) {
      flash('danger', 'Please select both a book and a borrower');
      return;
    }
    setSubmitting(true);
    try {
      await borrowBook({ book_id: parseInt(form.book_id), borrower_id: parseInt(form.borrower_id) });
      flash('success', 'Book borrowed successfully!');
      setForm({ book_id: '', borrower_id: '' });
      fetchAll();
    } catch (err) {
      flash('danger', err.response?.data?.detail || 'Failed to borrow book');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = async (transactionId) => {
    if (!window.confirm('Confirm return of this book?')) return;
    try {
      await returnBook({ transaction_id: transactionId });
      flash('success', 'Book returned successfully!');
      fetchAll();
    } catch {
      flash('danger', 'Failed to return book');
    }
  };

  const availableBooks = books.filter((b) => b.availability_status === 'available');
  const activeTransactions = transactions.filter((t) => !t.return_date);
  const completedTransactions = transactions.filter((t) => t.return_date);

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Borrow &amp; Return</h1>
          <p className="page-subtitle">Manage book lending and returns</p>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}
           className="two-col">
        {/* Borrow Form */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-title">📤 Borrow a Book</div>
          <form onSubmit={handleBorrow}>
            <div className="form-group">
              <label className="form-label">Available Book</label>
              <select
                className="form-control"
                value={form.book_id}
                onChange={(e) => setForm({ ...form, book_id: e.target.value })}
              >
                <option value="">— Select a book —</option>
                {availableBooks.map((b) => (
                  <option key={b.book_id} value={b.book_id}>
                    {b.title} — {b.author}
                  </option>
                ))}
              </select>
              {availableBooks.length === 0 && (
                <div className="form-error">No books currently available</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Borrower</label>
              <select
                className="form-control"
                value={form.borrower_id}
                onChange={(e) => setForm({ ...form, borrower_id: e.target.value })}
              >
                <option value="">— Select a borrower —</option>
                {borrowers.map((b) => (
                  <option key={b.borrower_id} value={b.borrower_id}>
                    {b.borrower_name} ({b.email})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || availableBooks.length === 0}
              style={{ width: '100%' }}
            >
              {submitting ? 'Processing…' : '📤 Confirm Borrow'}
            </button>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-title">📊 Quick Stats</div>
          <div className="quick-stat-row">
            <span>Available Books</span>
            <strong style={{ color: '#16a34a' }}>{availableBooks.length}</strong>
          </div>
          <div className="quick-stat-row">
            <span>Active Borrows</span>
            <strong style={{ color: '#dc2626' }}>{activeTransactions.length}</strong>
          </div>
          <div className="quick-stat-row">
            <span>Total Borrowers</span>
            <strong style={{ color: '#2563eb' }}>{borrowers.length}</strong>
          </div>
          <div className="quick-stat-row">
            <span>Completed Returns</span>
            <strong style={{ color: '#64748b' }}>{completedTransactions.length}</strong>
          </div>
        </div>
      </div>

      {/* Active Borrows */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          🔴 Active Borrows ({activeTransactions.length})
        </div>
        {activeTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-text">No active borrows</div>
            <div className="empty-state-subtext">All books are currently available</div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Book</th>
                  <th>Borrower</th>
                  <th>Borrow Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeTransactions.map((t) => (
                  <tr key={t.transaction_id}>
                    <td style={{ color: '#94a3b8', fontWeight: 600 }}>#{t.transaction_id}</td>
                    <td style={{ fontWeight: 600 }}>
                      {t.book ? t.book.title : `Book #${t.book_id}`}
                    </td>
                    <td>{t.borrower ? t.borrower.borrower_name : `Borrower #${t.borrower_id}`}</td>
                    <td>{new Date(t.borrow_date).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleReturn(t.transaction_id)}
                      >
                        📥 Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Transactions History */}
      <div className="card">
        <div className="card-title">📋 Transaction History</div>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">No transactions yet</div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Book</th>
                  <th>Borrower</th>
                  <th>Borrow Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.transaction_id}>
                    <td style={{ color: '#94a3b8', fontWeight: 600 }}>#{t.transaction_id}</td>
                    <td style={{ fontWeight: 500 }}>
                      {t.book ? t.book.title : `Book #${t.book_id}`}
                    </td>
                    <td>{t.borrower ? t.borrower.borrower_name : `Borrower #${t.borrower_id}`}</td>
                    <td>{new Date(t.borrow_date).toLocaleDateString()}</td>
                    <td>{t.return_date ? new Date(t.return_date).toLocaleDateString() : '—'}</td>
                    <td>
                      <span className={`badge ${t.return_date ? 'badge-success' : 'badge-warning'}`}>
                        {t.return_date ? 'Returned' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BorrowReturn;

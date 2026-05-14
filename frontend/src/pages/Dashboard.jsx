import React, { useState, useEffect } from 'react';
import { getBooks, getTransactions } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, available: 0, borrowed: 0, active: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [booksRes, txnRes] = await Promise.all([getBooks(), getTransactions()]);
        const books = booksRes.data;
        const txns = txnRes.data;

        setStats({
          total: books.length,
          available: books.filter((b) => b.availability_status === 'available').length,
          borrowed: books.filter((b) => b.availability_status === 'borrowed').length,
          active: txns.filter((t) => !t.return_date).length,
        });
        setTransactions(txns.slice(0, 10));
      } catch {
        setError('Failed to load dashboard data. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="loading">Loading dashboard…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Library overview and recent activity</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">⚠️ {error}</div>}

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Books</div>
        </div>
        <div className="stat-card success">
          <div className="stat-value">{stats.available}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-value">{stats.borrowed}</div>
          <div className="stat-label">Borrowed</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active Transactions</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Recent Transactions</div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">No transactions yet</div>
            <div className="empty-state-subtext">Borrow a book to see activity here</div>
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

export default Dashboard;

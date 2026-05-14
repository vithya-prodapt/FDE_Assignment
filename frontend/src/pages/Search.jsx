import React, { useState } from 'react';
import { searchBooks } from '../services/api';

function Search() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (query.trim())    params.q        = query.trim();
      if (category.trim()) params.category = category.trim();
      if (author.trim())   params.author   = author.trim();
      const res = await searchBooks(params);
      setResults(res.data);
      setSearched(true);
    } catch {
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setCategory('');
    setAuthor('');
    setResults([]);
    setSearched(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Search Books</h1>
          <p className="page-subtitle">Search by title, author, or category</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="card">
        <form onSubmit={handleSearch}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: '16px',
              marginBottom: '16px',
            }}
            className="two-col"
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Keyword</label>
              <input
                className="form-control"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, or category…"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <input
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Fiction"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Author</label>
              <input
                className="form-control"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Tolkien"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching…' : '🔍 Search'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
              ✕ Clear
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {!searched ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">Enter keywords to search</div>
            <div className="empty-state-subtext">
              You can search by title, author, category, or any combination
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-title">
            {results.length === 0
              ? 'No results found'
              : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
          </div>

          {results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">No books match your search</div>
              <div className="empty-state-subtext">Try different keywords or broaden your filters</div>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>ISBN</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((book) => (
                    <tr key={book.book_id}>
                      <td style={{ color: '#94a3b8', fontWeight: 600 }}>{book.book_id}</td>
                      <td style={{ fontWeight: 600 }}>{book.title}</td>
                      <td>{book.author}</td>
                      <td>
                        <span className="badge badge-primary">{book.category}</span>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }}>
                        {book.isbn}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            book.availability_status === 'available' ? 'badge-success' : 'badge-danger'
                          }`}
                        >
                          {book.availability_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;

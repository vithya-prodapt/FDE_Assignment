import React, { useState, useEffect } from 'react';
import { getBooks, createBook, updateBook, deleteBook } from '../services/api';

const INITIAL_FORM = { title: '', author: '', category: '', isbn: '', availability_status: 'available' };

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch {
      flash('danger', 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const flash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const openAdd = () => {
    setEditBook(null);
    setForm(INITIAL_FORM);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (book) => {
    setEditBook(book);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      availability_status: book.availability_status,
    });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title    = 'Title is required';
    if (!form.author.trim())   e.author   = 'Author is required';
    if (!form.category.trim()) e.category = 'Category is required';
    if (!form.isbn.trim())     e.isbn     = 'ISBN is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      if (editBook) {
        await updateBook(editBook.book_id, form);
        flash('success', 'Book updated successfully');
      } else {
        await createBook(form);
        flash('success', 'Book added successfully');
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      flash('danger', err.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book? This cannot be undone.')) return;
    try {
      await deleteBook(id);
      flash('success', 'Book deleted');
      fetchBooks();
    } catch {
      flash('danger', 'Failed to delete book');
    }
  };

  if (loading) return <div className="loading">Loading books…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Book Management</h1>
          <p className="page-subtitle">{books.length} book{books.length !== 1 ? 's' : ''} in catalogue</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      <div className="card">
        {books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-text">No books yet</div>
            <div className="empty-state-subtext">Click "Add Book" to get started</div>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
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
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(book)}>
                          ✏️ Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book.book_id)}>
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
              <h3 className="modal-title">{editBook ? 'Edit Book' : 'Add New Book'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {[
                  { field: 'title',    label: 'Title',    placeholder: 'e.g. The Great Gatsby' },
                  { field: 'author',   label: 'Author',   placeholder: 'e.g. F. Scott Fitzgerald' },
                  { field: 'category', label: 'Category', placeholder: 'e.g. Fiction' },
                  { field: 'isbn',     label: 'ISBN',     placeholder: 'e.g. 978-3-16-148410-0' },
                ].map(({ field, label, placeholder }) => (
                  <div className="form-group" key={field}>
                    <label className="form-label">{label}</label>
                    <input
                      className={`form-control${errors[field] ? ' error' : ''}`}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      placeholder={placeholder}
                    />
                    {errors[field] && <div className="form-error">{errors[field]}</div>}
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Availability Status</label>
                  <select
                    className="form-control"
                    value={form.availability_status}
                    onChange={(e) => setForm({ ...form, availability_status: e.target.value })}
                  >
                    <option value="available">Available</option>
                    <option value="borrowed">Borrowed</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editBook ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Books;

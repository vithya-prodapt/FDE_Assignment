import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Borrowers from './pages/Borrowers';
import BorrowReturn from './pages/BorrowReturn';
import Search from './pages/Search';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="main-layout">
        <Navbar />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/borrowers" element={<Borrowers />} />
            <Route path="/borrow-return" element={<BorrowReturn />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

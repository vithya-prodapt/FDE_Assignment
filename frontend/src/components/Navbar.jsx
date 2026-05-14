import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',             icon: '📊', label: 'Dashboard'     },
  { to: '/books',        icon: '📚', label: 'Books'         },
  { to: '/borrowers',    icon: '👥', label: 'Borrowers'     },
  { to: '/borrow-return',icon: '🔄', label: 'Borrow / Return'},
  { to: '/search',       icon: '🔍', label: 'Search'        },
];

function Navbar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>📖 LibraryMS</h2>
        <p>Management System</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">Phase 1 &mdash; v1.0.0</div>
    </aside>
  );
}

export default Navbar;

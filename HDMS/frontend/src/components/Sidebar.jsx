import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', icon: 'fa-gauge-high',   label: 'Dashboard'     },
  { to: '/tickets',   icon: 'fa-ticket',        label: 'All Tickets'   },
  { to: '/tickets/new', icon: 'fa-circle-plus', label: 'Create Ticket' },
  { to: '/search',    icon: 'fa-magnifying-glass', label: 'Search'     },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <i className="fas fa-headset sidebar-brand-icon"></i>
        <div>
          <div className="sidebar-brand-name">HelpDesk</div>
          <div className="sidebar-brand-sub">Ticket Management</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Main Menu</div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' sidebar-link-active' : ''}`
            }
          >
            <i className={`fas ${item.icon} sidebar-link-icon`}></i>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <i className="fas fa-circle-info"></i>&nbsp; Phase 1 &mdash; v1.0.0
      </div>
    </aside>
  );
}

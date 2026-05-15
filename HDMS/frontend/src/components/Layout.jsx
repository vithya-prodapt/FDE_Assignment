import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const PAGE_TITLES = {
  '/dashboard':   'Dashboard',
  '/tickets':     'All Tickets',
  '/tickets/new': 'Create Ticket',
  '/search':      'Search Tickets',
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || (pathname.startsWith('/tickets/') ? 'Ticket Details' : 'HelpDesk');

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <header className="topbar">
          <h1 className="topbar-title">{title}</h1>
          <div className="topbar-meta">
            <i className="fas fa-circle-dot" style={{ color: '#10B981', marginRight: 6 }}></i>
            System Online
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

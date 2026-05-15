import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout      from './components/Layout';
import Dashboard   from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketList  from './pages/TicketList';
import TicketDetail from './pages/TicketDetail';
import SearchPage  from './pages/SearchPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"   element={<Dashboard />} />
          <Route path="tickets"     element={<TicketList />} />
          <Route path="tickets/new" element={<CreateTicket />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
          <Route path="search"      element={<SearchPage />} />
          <Route path="*"           element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

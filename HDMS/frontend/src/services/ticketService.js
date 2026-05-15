import api from '../api';

const ticketService = {
  getAll: (params = {}) => api.get('/tickets', { params }),
  getById: (id) => api.get(`/tickets/${id}`),
  create: (data) => api.post('/tickets', data),
  update: (id, data) => api.put(`/tickets/${id}`, data),
  remove: (id) => api.delete(`/tickets/${id}`),
  search: (params = {}) => api.get('/search', { params }),
};

export default ticketService;

import { API_BASE_URL } from './config.js';

const TOKEN_KEY = 'gimarry_admin_token';

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || '';
}

export function setToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers['X-Admin-Token'] = token;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    cache: 'no-store',
    ...options,
    headers,
  });

  let data = null;
  const type = (res.headers.get('content-type') || '').toLowerCase();
  if (type.includes('json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || 'Resposta inválida' };
    }
  }

  if (!res.ok) {
    const err = new Error((data && data.error) || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const apiClient = {
  getCatalog: () => request('/catalog'),
  createOrder: (payload) =>
    request('/orders', { method: 'POST', body: JSON.stringify(payload) }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request('/auth/logout', { method: 'POST', body: '{}' }),
  me: () => request('/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    request('/auth/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getOrders: () => request('/orders'),
  createAdminOrder: (payload) =>
    request('/orders/admin', { method: 'POST', body: JSON.stringify(payload) }),
  updateOrder: (id, payload) =>
    request(`/orders/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteOrder: (id) =>
    request(`/orders/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  getProducts: () => request('/products'),
  saveProduct: (payload, id) =>
    id
      ? request(`/products/${encodeURIComponent(id)}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      : request('/products', { method: 'POST', body: JSON.stringify(payload) }),
  deleteProduct: (id) =>
    request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  getCategories: () => request('/categories'),
  saveCategory: (payload, id) =>
    id
      ? request(`/categories/${encodeURIComponent(id)}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      : request('/categories', { method: 'POST', body: JSON.stringify(payload) }),
  deleteCategory: (id) =>
    request(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  getClients: () => request('/clients'),
  saveClient: (payload, id) =>
    id
      ? request(`/clients/${encodeURIComponent(id)}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      : request('/clients', { method: 'POST', body: JSON.stringify(payload) }),
  deleteClient: (id) =>
    request(`/clients/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  getSettings: () => request('/settings'),
  saveSettings: (payload) =>
    request('/settings', { method: 'PUT', body: JSON.stringify(payload) }),

  financeSummary: (period = 'all') =>
    request(`/finance/summary?period=${encodeURIComponent(period)}`),

  pullAdminData: () => request('/admin/data'),
  pushAdminData: (payload) =>
    request('/admin/data', { method: 'POST', body: JSON.stringify(payload) }),
};

export default apiClient;

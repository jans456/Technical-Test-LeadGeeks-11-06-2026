import { Ticket, TicketFormData, Stats } from './types';
import { getToken } from './auth';

const BASE = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(path: string, options?: RequestInit, auth = false): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { headers, ...options });
  if (res.status === 204) return undefined as T;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    request<void>('/logout', { method: 'POST' }, true),
  getStats: () => request<Stats>('/tickets/stats'),
  getTickets: () => request<Ticket[]>('/tickets'),
  createTicket: (data: TicketFormData) =>
    request<Ticket>('/tickets', { method: 'POST', body: JSON.stringify(data) }),
  updateTicket: (id: number, data: Partial<TicketFormData>) =>
    request<Ticket>(`/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
  deleteTicket: (id: number) =>
    request<void>(`/tickets/${id}`, { method: 'DELETE' }, true),
};

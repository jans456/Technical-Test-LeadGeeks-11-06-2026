'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Ticket } from '@/lib/types';

const CATEGORIES = ['Hardware', 'Software', 'Network', 'Access', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const statusColor: Record<string, string> = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Resolved: 'bg-green-100 text-green-700',
  Closed: 'bg-gray-100 text-gray-600',
};

const priorityColor: Record<string, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-orange-100 text-orange-700',
  High: 'bg-red-100 text-red-700',
  Critical: 'bg-red-200 text-red-800 font-semibold',
};

const emptyForm = { requester_name: '', title: '', category: 'Hardware', priority: 'Low' };

export default function UserPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loadTickets = useCallback(async () => {
    const data = await api.getTickets();
    setTickets(data);
  }, []);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createTicket({
        title: form.title,
        requester_name: form.requester_name,
        category: form.category,
        priority: form.priority as 'Low' | 'Medium' | 'High' | 'Critical',
        status: 'Open',
        assigned_person: 'Belum Ditugaskan',
      });
      setForm(emptyForm);
      setSubmitted(true);
      await loadTickets();
      setTimeout(() => setSubmitted(false), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: keyof typeof emptyForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-semibold text-gray-800">Laporkan Masalah IT</h2>
          <p className="mb-5 text-sm text-gray-500">
            Isi form di bawah untuk membuat tiket baru. Tim IT akan segera menangani laporan Anda.
          </p>

          {submitted && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Tiket berhasil dikirim. Tim IT akan segera menghubungi Anda.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nama Anda</label>
              <input
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama lengkap Anda"
                {...field('requester_name')}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Judul Masalah</label>
              <input
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Deskripsikan masalah secara singkat"
                {...field('title')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...field('category')}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Prioritas</label>
                <select
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...field('priority')}
                >
                  {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? 'Mengirim...' : 'Kirim Laporan'}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">
            Status Tiket
            <span className="ml-2 text-sm font-normal text-gray-400">({tickets.length} tiket)</span>
          </h2>

          {tickets.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">Belum ada tiket.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="py-3 pr-4">Nama Pelapor</th>
                    <th className="py-3 pr-4">Judul Masalah</th>
                    <th className="py-3 pr-4">Kategori</th>
                    <th className="py-3 pr-4">Prioritas</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4 text-gray-600">{t.requester_name ?? '-'}</td>
                      <td className="py-3 pr-4 font-medium text-gray-800">{t.title}</td>
                      <td className="py-3 pr-4 text-gray-600">{t.category}</td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs ${priorityColor[t.priority]}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs ${statusColor[t.status]}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">
                        {new Date(t.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

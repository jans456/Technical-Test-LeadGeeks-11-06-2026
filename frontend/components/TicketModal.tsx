'use client';

import { useState } from 'react';
import { Ticket, TicketFormData, Priority, Status } from '@/lib/types';

const CATEGORIES = ['Hardware', 'Software', 'Network', 'Access', 'Other'];
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES: Status[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

interface Props {
  ticket?: Ticket | null;
  onClose: () => void;
  onSave: (data: TicketFormData) => Promise<void>;
}

const empty: TicketFormData = {
  title: '',
  requester_name: null,
  category: 'Hardware',
  priority: 'Low',
  status: 'Open',
  assigned_person: '',
};

export default function TicketModal({ ticket, onClose, onSave }: Props) {
  const [form, setForm] = useState<TicketFormData>(() =>
    ticket
      ? {
          title: ticket.title,
          requester_name: ticket.requester_name,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          assigned_person: ticket.assigned_person,
        }
      : empty
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          {ticket ? 'Edit Tiket' : 'Tambah Tiket'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nama Pelapor</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nama karyawan pelapor (opsional)"
              value={form.requester_name ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, requester_name: e.target.value || null }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Judul Tiket</label>
            <input
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan judul tiket"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Kategori</label>
              <select
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Prioritas</label>
              <select
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.priority}
                onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as Priority }))}
              >
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Status }))}
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Penanggung Jawab</label>
            <input
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nama staf IT"
              value={form.assigned_person}
              onChange={(e) => setForm((prev) => ({ ...prev, assigned_person: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

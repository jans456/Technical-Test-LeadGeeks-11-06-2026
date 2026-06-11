'use client';

import { Ticket, Status } from '@/lib/types';

const STATUSES: Status[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

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

interface Props {
  tickets: Ticket[];
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
  onStatusChange: (ticket: Ticket, status: Status) => Promise<void>;
}

export default function TicketTable({ tickets, onEdit, onDelete, onStatusChange }: Props) {
  if (tickets.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400">Belum ada tiket. Tambahkan tiket pertama.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="py-3 pr-4">Judul Tiket</th>
            <th className="py-3 pr-4">Pelapor</th>
            <th className="py-3 pr-4">Kategori</th>
            <th className="py-3 pr-4">Prioritas</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Penanggung Jawab</th>
            <th className="py-3 pr-4">Tanggal Dibuat</th>
            <th className="py-3">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tickets.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="py-3 pr-4 font-medium text-gray-800">{t.title}</td>
              <td className="py-3 pr-4 text-gray-500">{t.requester_name ?? '-'}</td>
              <td className="py-3 pr-4 text-gray-600">{t.category}</td>
              <td className="py-3 pr-4">
                <span className={`rounded-full px-2.5 py-0.5 text-xs ${priorityColor[t.priority]}`}>
                  {t.priority}
                </span>
              </td>
              <td className="py-3 pr-4">
                <select
                  value={t.status}
                  onChange={(e) => onStatusChange(t, e.target.value as Status)}
                  className={`rounded-full px-2.5 py-0.5 text-xs border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${statusColor[t.status]}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td className="py-3 pr-4 text-gray-600">{t.assigned_person}</td>
              <td className="py-3 pr-4 text-gray-500">
                {new Date(t.created_at).toLocaleDateString('id-ID')}
              </td>
              <td className="py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(t)}
                    className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(t)}
                    className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

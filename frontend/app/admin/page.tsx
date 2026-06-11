'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Ticket, TicketFormData, Stats, Status } from '@/lib/types';
import StatsCard from '@/components/StatsCard';
import TicketTable from '@/components/TicketTable';
import TicketModal from '@/components/TicketModal';
import DeleteConfirm from '@/components/DeleteConfirm';

export default function AdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, open: 0, in_progress: 0, high_priority: 0 });
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deletingTicket, setDeletingTicket] = useState<Ticket | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = useCallback(async () => {
    const [t, s] = await Promise.all([api.getTickets(), api.getStats()]);
    setTickets(t);
    setStats(s);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (data: TicketFormData) => {
    if (editingTicket) {
      await api.updateTicket(editingTicket.id, data);
    } else {
      await api.createTicket(data);
    }
    await loadData();
  };

  const handleStatusChange = async (ticket: Ticket, status: Status) => {
    await api.updateTicket(ticket.id, { status });
    await loadData();
  };

  const handleDelete = async () => {
    if (!deletingTicket) return;
    await api.deleteTicket(deletingTicket.id);
    setDeletingTicket(null);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatsCard label="Total Tiket" value={stats.total} color="bg-slate-600" />
          <StatsCard label="Tiket Terbuka" value={stats.open} color="bg-blue-600" />
          <StatsCard label="Sedang Dikerjakan" value={stats.in_progress} color="bg-yellow-500" />
          <StatsCard label="Prioritas Tinggi" value={stats.high_priority} color="bg-red-600" />
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">Daftar Tiket</h2>
            <button
              onClick={() => { setEditingTicket(null); setShowAddModal(true); }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Tambah Tiket
            </button>
          </div>
          <TicketTable
            tickets={tickets}
            onEdit={(t) => { setEditingTicket(t); setShowAddModal(true); }}
            onDelete={setDeletingTicket}
            onStatusChange={handleStatusChange}
          />
        </div>
      </main>

      {showAddModal && (
        <TicketModal
          ticket={editingTicket}
          onClose={() => { setShowAddModal(false); setEditingTicket(null); }}
          onSave={handleSave}
        />
      )}

      {deletingTicket && (
        <DeleteConfirm
          ticket={deletingTicket}
          onCancel={() => setDeletingTicket(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Ticket } from '@/lib/types';

interface Props {
  ticket: Ticket;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteConfirm({ ticket, onCancel, onConfirm }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Hapus Tiket</h2>
        <p className="mb-5 text-sm text-gray-600">
          Yakin ingin menghapus tiket <span className="font-medium">&quot;{ticket.title}&quot;</span>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

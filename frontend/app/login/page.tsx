'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setToken } from '@/lib/auth';
import AlertModal from '@/components/AlertModal';

interface AlertState {
  type: 'success' | 'error';
  title: string;
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = (type: AlertState['type'], title: string, message: string) =>
    setAlert({ type, title, message });

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();

    // Validasi client-side sebelum kirim ke API
    if (!email.trim()) {
      showAlert('error', 'Email Wajib Diisi', 'Masukkan alamat email akun admin Anda.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('error', 'Format Email Tidak Valid', 'Pastikan email memiliki format yang benar, contoh: admin@leadgeeks.com');
      return;
    }
    if (!password) {
      showAlert('error', 'Password Wajib Diisi', 'Masukkan password akun admin Anda.');
      return;
    }
    if (password.length < 6) {
      showAlert('error', 'Password Terlalu Pendek', 'Password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const { token } = await api.login(email, password);
      setToken(token);
      router.push('/admin');
    } catch {
      showAlert(
        'error',
        'Login Gagal',
        'Email atau password yang Anda masukkan salah. Periksa kembali kredensial Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-gray-800">Login Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Dashboard Tiket IT Internal</p>
          <p className="mt-0.5 text-xs text-gray-400">PT Lead Geeks Indonesia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@leadgeeks.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a10.05 10.05 0 011.875.175M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 3-4 7-9 7-.34 0-.676-.02-1.006-.06M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-5 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
          <p className="mb-1 text-xs font-medium text-gray-500">Akun Demo</p>
          <p className="text-xs text-gray-600">Email: <span className="font-mono font-medium">admin@leadgeeks.com</span></p>
          <p className="text-xs text-gray-600">Password: <span className="font-mono font-medium">admin123</span></p>
        </div>
      </div>

      {alert && (
        <AlertModal
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { clearToken } from '@/lib/auth';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname === '/admin';
  const isUser = pathname === '/';

  const handleLogout = async () => {
    try { await api.logout(); } catch { /* token mungkin sudah expired */ }
    clearToken();
    router.push('/login');
  };

  if (pathname === '/login') return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Dashboard Tiket IT Internal</h1>
          <p className="text-sm text-gray-500">PT Lead Geeks Indonesia</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <nav className="flex gap-1 rounded-lg bg-gray-100 p-1">
              <Link
                href="/"
                className="rounded-md px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
              >
                Portal User
              </Link>
              <span className="rounded-md bg-white px-4 py-1.5 text-sm font-medium text-gray-800 shadow-sm">
                Admin
              </span>
            </nav>
          )}
          {isAdmin && (
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Logout
            </button>
          )}
          {isUser && (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Login Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

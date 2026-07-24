'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('access_token'));
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 text-blue-900 text-2xl shadow-md">
              ⚡
            </span>
            <h1 className="text-3xl font-bold tracking-tight">SEPE Campo</h1>
          </div>
          <p className="text-blue-200 mb-4 ml-1">Sistema de Verificación de Obra Eléctrica</p>

          {isAuthenticated && (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <nav className="flex gap-4 flex-wrap">
                <Link
                  href="/"
                  className={`px-4 py-2 rounded transition ${
                    isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-800'
                  }`}
                >
                  📊 INFORME TOTAL
                </Link>
                <Link
                  href="/visitas"
                  className={`px-4 py-2 rounded transition ${
                    isActive('/visitas') ? 'bg-blue-700' : 'hover:bg-blue-800'
                  }`}
                >
                  📋 VISITAS
                </Link>
                <Link
                  href="/visitas/crear"
                  className={`px-4 py-2 rounded transition ${
                    isActive('/visitas/crear') ? 'bg-blue-700' : 'hover:bg-blue-800'
                  }`}
                >
                  ➕ NUEVA VISITA
                </Link>
              </nav>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition font-medium"
              >
                🚪 Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

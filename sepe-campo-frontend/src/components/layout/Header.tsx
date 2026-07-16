'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-4">
          <h1 className="text-3xl font-bold mb-4">🔧 SEPE Campo</h1>
          <p className="text-blue-200 mb-4">Sistema de Verificación de Obra Eléctrica</p>
          
          <nav className="flex gap-4 flex-wrap">
            <Link
              href="/"
              className={`px-4 py-2 rounded transition ${
                isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-800'
              }`}
            >
              🏠 Dashboard
            </Link>
            <Link
              href="/visitas"
              className={`px-4 py-2 rounded transition ${
                isActive('/visitas') ? 'bg-blue-700' : 'hover:bg-blue-800'
              }`}
            >
              📋 Visitas
            </Link>
            <Link
              href="/visitas/crear"
              className={`px-4 py-2 rounded transition ${
                isActive('/visitas/crear') ? 'bg-blue-700' : 'hover:bg-blue-800'
              }`}
            >
              ➕ Nueva Visita
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

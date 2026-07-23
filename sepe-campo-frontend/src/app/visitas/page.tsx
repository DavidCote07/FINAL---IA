'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import VisitasList from '@/components/VisitasList';
import { visitasApi } from '@/lib/api/client';
import { Visita } from '@/types';

export default function VisitasPage() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarVisitas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await visitasApi.getAll();
      setVisitas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setVisitas([]);
      setError('No se pudieron cargar las visitas. Verifica que el backend esté disponible.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarVisitas();
  }, [cargarVisitas]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta visita? Esta acción no se puede deshacer.')) return;
    try {
      await visitasApi.delete(id);
      setVisitas((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar la visita.');
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Visitas</h1>
          <p className="text-gray-600">Visitas de verificación de obra registradas</p>
        </div>
        <Link
          href="/visitas/crear"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
        >
          ➕ Nueva Visita
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Cargando visitas...</p>
      ) : visitas.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Aún no hay visitas registradas.</p>
          <Link
            href="/visitas/crear"
            className="text-blue-600 hover:text-blue-900 font-medium"
          >
            Crear la primera visita →
          </Link>
        </div>
      ) : (
        <VisitasList visitas={visitas} onDelete={handleDelete} />
      )}
    </Layout>
  );
}

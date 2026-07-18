'use client';

import { useEffect, useState } from 'react';
import { visitasApi } from '../../src/lib/api/client';
import { Visita } from '../../src/types';
import { Layout } from '../../src/components/layout';
import VisitasList from '../../src/components/VisitasList';

export default function Page() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadVisitas();
  }, []);

  const loadVisitas = async () => {
    try {
      setLoading(true);
      const data = await visitasApi.getAll();
      setVisitas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar visitas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta visita?')) return;
    try {
      await visitasApi.delete(id);
      setVisitas(visitas.filter((v) => v.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Mis Visitas</h1>
        <p className="text-gray-600">Gestiona todas tus visitas de verificación de obra</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando visitas...</p>
        </div>
      ) : visitas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600 mb-4">No hay visitas registradas</p>
          <a
            href="/visitas/crear"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Crear Primera Visita
          </a>
        </div>
      ) : (
        <VisitasList visitas={visitas} onDelete={handleDelete} />
      )}
    </Layout>
  );
}

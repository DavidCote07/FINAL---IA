'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { consolidadoApi } from '@/lib/api/client';
import { Layout } from '@/components/layout';

export default function ConsolidadoVisitaPage() {
  const params = useParams();
  const visitaId = params.id as string;

  const [estructuras, setEstructuras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visitaId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitaId]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await consolidadoApi.getEstructuras(visitaId);
      setEstructuras(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando consolidado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">🔎 Consolidado - Estructuras</h1>
        <p className="text-gray-600">Resumen de estructuras y conteos por visita</p>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700">{error}</div>}

      {loading ? (
        <div className="text-center py-12">Cargando consolidado...</div>
      ) : estructuras.length === 0 ? (
        <div className="text-center py-12">No se encontraron estructuras</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {estructuras.map((e: any) => (
            <div key={e.id || `${e.tipo}-${e.numero}`} className="p-4 border rounded bg-white">
              <h3 className="font-semibold">{e.tipo || 'Estructura'}</h3>
              <p className="text-sm text-gray-600">Número: {e.numero ?? '—'}</p>
              <p className="text-sm text-gray-600">Material: {e.material ?? '—'}</p>
              <p className="mt-2 text-gray-800">Conteo: {e.conteo ?? e.cantidad ?? '—'}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

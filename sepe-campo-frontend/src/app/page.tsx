'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { informeApi } from '@/lib/api/client';
import { InformeTotal } from '@/types';
import { Layout } from '@/components/layout';

export default function DashboardPage() {
  const [informe, setInforme] = useState<InformeTotal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void cargarInformeTotal();
  }, []);

  const cargarInformeTotal = async () => {
    try {
      setLoading(true);
      setError('');
      const result = (await informeApi.getTotal()) as InformeTotal;
      setInforme(result);
    } catch (err) {
      console.error('Error loading informe total:', err);
      setError('No se pudo cargar el informe total');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando informe total...</p>
        </div>
      </Layout>
    );
  }

  if (error || !informe) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'No se pudo cargar el informe'}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Informe Total</h1>
        <p className="text-gray-600">Cantidades consolidadas de todas las visitas registradas</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Visitas</p>
          <p className="text-3xl font-bold text-blue-600">{informe.total_visitas}</p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Usuarios</p>
          <p className="text-3xl font-bold text-green-600">{informe.total_usuarios}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Apoyos</p>
          <p className="text-3xl font-bold text-blue-600">{informe.total_apoyos}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Tramos</p>
          <p className="text-3xl font-bold text-purple-600">{informe.total_tramos}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Longitud Total (m)</p>
          <p className="text-2xl font-bold text-gray-800">{informe.total_longitud_ml}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600 text-sm">ACSR Total (m)</p>
          <p className="text-2xl font-bold text-gray-800">{informe.total_acsr}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Total Perchas</p>
          <p className="text-2xl font-bold text-gray-800">{informe.total_perchas}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Total Templetes BT</p>
          <p className="text-2xl font-bold text-gray-800">{informe.total_templetes_bt}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Total Tierras BT</p>
          <p className="text-2xl font-bold text-gray-800">{informe.total_tierras_bt}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Total Conectores</p>
          <p className="text-2xl font-bold text-gray-800">{informe.total_conectores}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Medidores Tipo A1</p>
          <p className="text-2xl font-bold text-gray-800">{informe.total_medidores_a1}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Medidores Tipo A3</p>
          <p className="text-2xl font-bold text-gray-800">{informe.total_medidores_a3}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Cable Dúplex Total (m)</p>
          <p className="text-2xl font-bold text-gray-800">{informe.total_cable_duplex_ml}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Cable Triplex Total (m)</p>
          <p className="text-2xl font-bold text-gray-800">{informe.total_cable_triplex_ml}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Postes Nuevos</p>
          <p className="text-2xl font-bold text-gray-800">{informe.total_postes_nuevos}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Postes Existentes</p>
          <p className="text-2xl font-bold text-gray-800">{informe.total_postes_existentes}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Visitas Incluidas</h3>
        {informe.visitas.length === 0 ? (
          <p className="text-gray-600">No hay visitas registradas todavía.</p>
        ) : (
          <div className="space-y-2">
            {informe.visitas.map((v) => (
              <Link
                key={v.id}
                href={`/visitas/${v.id}`}
                className="block p-3 border border-gray-200 rounded hover:bg-gray-50 transition"
              >
                <p className="font-semibold">{v.contrato}</p>
                <p className="text-sm text-gray-600">
                  {v.vereda} - {v.municipio} | {new Date(v.fecha).toLocaleDateString('es-ES')} | Técnico: {v.tecnico_id}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

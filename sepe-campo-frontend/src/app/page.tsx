'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout';
import { visitasApi } from '@/lib/api/client';
import { Visita } from '@/types';
import Link from 'next/link';

export default function Dashboard() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
  });

  useEffect(() => {
    loadVisitas();
  }, []);

  const loadVisitas = async () => {
    try {
      setLoading(true);
      const data = await visitasApi.getAll();
      setVisitas(data);

      const now = new Date();
      const thisMonth = data.filter((v) => {
        const fecha = new Date(v.fecha);
        return fecha.getMonth() === now.getMonth() && fecha.getFullYear() === now.getFullYear();
      });

      const thisWeek = data.filter((v) => {
        const fecha = new Date(v.fecha);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return fecha >= weekAgo;
      });

      setStats({
        total: data.length,
        thisMonth: thisMonth.length,
        thisWeek: thisWeek.length,
      });
    } catch (err) {
      console.error('Error loading visitas:', err);
    } finally {
      setLoading(false);
    }
  };

  const recentVisitas = visitas.slice(0, 5);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">🏠 Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido al Sistema SEPE Campo</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm uppercase">Total de Visitas</p>
              <p className="text-4xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="text-4xl opacity-20">📋</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm uppercase">Este Mes</p>
              <p className="text-4xl font-bold mt-2">{stats.thisMonth}</p>
            </div>
            <div className="text-4xl opacity-20">📅</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm uppercase">Esta Semana</p>
              <p className="text-4xl font-bold mt-2">{stats.thisWeek}</p>
            </div>
            <div className="text-4xl opacity-20">📊</div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">⚡ Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/visitas/crear"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center"
          >
            ➕ Nueva Visita
          </Link>
          <Link
            href="/visitas"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center"
          >
            📋 Ver Todas las Visitas
          </Link>
          <a
            href="http://localhost:3000/api"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center"
          >
            🔌 API Backend
          </a>
        </div>
      </div>

      {/* Visitas Recientes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">📋 Visitas Recientes</h2>

        {loading ? (
          <p className="text-gray-600">Cargando...</p>
        ) : recentVisitas.length === 0 ? (
          <p className="text-gray-600">No hay visitas registradas</p>
        ) : (
          <div className="space-y-4">
            {recentVisitas.map((visita) => (
              <Link
                key={visita.id}
                href={`/visitas/${visita.id}`}
                className="flex justify-between items-center p-4 border border-gray-200 rounded hover:bg-blue-50 transition"
              >
                <div>
                  <p className="font-semibold text-gray-900">{visita.contrato}</p>
                  <p className="text-sm text-gray-600">
                    {visita.vereda} - {visita.municipio}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(visita.fecha).toLocaleDateString('es-ES')}
                  </p>
                  <p className="text-sm text-gray-500">Técnico: {visita.tecnico_id}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Información de Ayuda */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Información Útil</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ El backend está disponible en http://localhost:3000</li>
          <li>✓ Todos los datos se sincronizan automáticamente</li>
          <li>✓ Las validaciones se ejecutan automáticamente al verificar inconsistencias</li>
          <li>✓ Los informes incluyen consolidado de cantidades y exportación a Excel</li>
        </ul>
      </div>
    </Layout>
  );
}

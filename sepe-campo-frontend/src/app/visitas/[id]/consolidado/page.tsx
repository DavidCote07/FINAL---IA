'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import {
  visitasApi,
  consolidadoApi,
  exportacionApi,
  validacionesApi,
} from '@/lib/api/client';
import { Visita, Consolidado, Inconsistencia } from '@/types';

export default function ConsolidadoPage() {
  const params = useParams();
  const visitaId = params?.id as string;

  const [visita, setVisita] = useState<Visita | null>(null);
  const [consolidado, setConsolidado] = useState<Consolidado | null>(null);
  const [estructuras, setEstructuras] = useState<Record<string, number>>({});
  const [inconsistencias, setInconsistencias] = useState<Inconsistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [sinDatos, setSinDatos] = useState(false);
  const [error, setError] = useState('');
  const [descargando, setDescargando] = useState(false);

  const cargar = useCallback(async () => {
    if (!visitaId) return;
    setLoading(true);
    setError('');
    setSinDatos(false);
    try {
      const visitaData = await visitasApi.getById(visitaId);
      setVisita(visitaData);

      try {
        const [consolidadoData, estructurasData, inconsistenciasData] = await Promise.all([
          consolidadoApi.getByVisita(visitaId),
          consolidadoApi.getEstructuras(visitaId),
          validacionesApi.getInconsistencias(visitaId),
        ]);
        setConsolidado(consolidadoData);
        setEstructuras(estructurasData?.estructuras || {});
        setInconsistencias(Array.isArray(inconsistenciasData) ? inconsistenciasData : []);
      } catch (innerErr) {
        // El backend responde 404 cuando la visita todavía no tiene
        // apoyos, usuarios ni tramos registrados.
        console.warn(innerErr);
        setSinDatos(true);
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la visita.');
    } finally {
      setLoading(false);
    }
  }, [visitaId]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const handleDescargarExcel = async () => {
    setDescargando(true);
    try {
      await exportacionApi.downloadExcel(visitaId);
    } catch (err) {
      console.error(err);
      alert('No se pudo descargar el Excel.');
    } finally {
      setDescargando(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <p className="text-gray-600">Cargando consolidado...</p>
      </Layout>
    );
  }

  if (error || !visita) {
    return (
      <Layout>
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error || 'Visita no encontrada.'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Consolidado — {visita.contrato}
          </h1>
          <p className="text-gray-600">
            {visita.vereda}, {visita.municipio}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/visitas/${visitaId}`}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            ← Volver a la visita
          </Link>
          <button
            onClick={handleDescargarExcel}
            disabled={sinDatos || descargando}
            className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 disabled:bg-gray-400"
          >
            {descargando ? 'Generando...' : '📥 Descargar Excel'}
          </button>
        </div>
      </div>

      {sinDatos || !consolidado ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-2">
            Todavía no hay datos suficientes para calcular el consolidado.
          </p>
          <p className="text-gray-500 mb-4 text-sm">
            Registra al menos un usuario beneficiario, un apoyo o un tramo en la ficha de la
            visita.
          </p>
          <Link href={`/visitas/${visitaId}`} className="text-blue-600 hover:text-blue-900 font-medium">
            Ir a diligenciar información →
          </Link>
        </div>
      ) : (
        <>
          {/* Totales generales */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Stat label="Usuarios" value={consolidado.total_usuarios} />
            <Stat label="Apoyos" value={consolidado.total_apoyos} />
            <Stat label="Tramos" value={consolidado.total_tramos} />
            <Stat label="Transformadores" value={consolidado.total_transformadores} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Componentes de apoyo */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Consolidado de componentes</h2>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <Row label="Perchas" value={consolidado.total_perchas} />
                <Row label="Templetes BT" value={consolidado.total_templetes_bt} />
                <Row label="Templetes MT" value={consolidado.total_templetes_mt} />
                <Row label="Tierras BT" value={consolidado.total_tierras_bt} />
                <Row label="Tierras MT" value={consolidado.total_tierras_mt} />
                <Row label="Conectores" value={consolidado.total_conectores} />
                <Row label="Longitud total (m)" value={consolidado.total_longitud_ml} />
                <Row label="Conductor ACSR total (m)" value={consolidado.total_acsr} />
              </dl>
            </div>

            {/* Por nivel de tensión */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Por nivel de tensión</h2>
              {Object.keys(consolidado.by_nivel_tension).length === 0 ? (
                <p className="text-gray-500 text-sm">Sin datos por nivel de tensión.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2">Nivel</th>
                      <th className="pb-2">Apoyos</th>
                      <th className="pb-2">Tramos</th>
                      <th className="pb-2">Longitud (m)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(consolidado.by_nivel_tension).map(([nivel, datos]) => (
                      <tr key={nivel} className="border-t border-gray-100">
                        <td className="py-2 font-medium">{nivel}</td>
                        <td className="py-2">{datos.apoyos}</td>
                        <td className="py-2">{datos.tramos}</td>
                        <td className="py-2">{datos.longitud_ml}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {Object.keys(estructuras).length > 0 && (
                <>
                  <h3 className="text-sm font-semibold mt-6 mb-2 text-gray-700">
                    Estructuras MT por código
                  </h3>
                  <ul className="text-sm space-y-1">
                    {Object.entries(estructuras).map(([codigo, cantidad]) => (
                      <li key={codigo} className="flex justify-between">
                        <span>{codigo}</span>
                        <span className="font-medium">{cantidad}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Inconsistencias */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Inconsistencias ({inconsistencias.length})
            </h2>
            {inconsistencias.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No se han registrado inconsistencias. Ejecuta la validación desde la ficha de la
                visita si aún no lo has hecho.
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {inconsistencias.map((inc) => (
                  <div key={inc.id} className="py-3 flex items-start gap-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        inc.severidad === 'ERROR'
                          ? 'bg-red-100 text-red-700'
                          : inc.severidad === 'WARNING'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {inc.severidad}
                    </span>
                    <p className="text-sm text-gray-900">{inc.mensaje}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <p className="text-2xl font-bold text-blue-700">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900 text-right">{value}</dd>
    </>
  );
}

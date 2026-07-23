'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout';

type Apoyo = {
  id: string;
  numero: number;
  nivel_tension: string;
};

export default function TestTramosPage() {
  const [apoyos, setApoyos] = useState<Apoyo[]>([]);
  const [origenId, setOrigenId] = useState('');
  const [destinoId, setDestinoId] = useState('');
  const [longitud, setLongitud] = useState('');
  const [tension, setTension] = useState('BT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApoyos = async () => {
      try {
        const response = await fetch('http://localhost:3001/apoyos');
        if (!response.ok) {
          throw new Error(`Error al cargar apoyos: ${response.status}`);
        }
        const data = await response.json();
        setApoyos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los apoyos.');
      }
    };

    void fetchApoyos();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        apoyo_origen_id: origenId,
        apoyo_destino_id: destinoId,
        nivel_tension: tension,
        longitud_ml: Number(longitud),
        observaciones: '',
      };

      const response = await fetch('http://localhost:3001/tramos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error en el servidor: ${response.status} ${text}`);
      }

      setOrigenId('');
      setDestinoId('');
      setLongitud('');
      setTension('BT');
      alert('Tramo creado con éxito');
    } catch (err) {
      console.error(err);
      setError('No se pudo crear el tramo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">Crear Tramo</h1>
          <p className="text-sm text-slate-500 mb-6">
            Formulario simple para seleccionar apoyos y enviar un nuevo tramo a la API.
          </p>

          {error ? (
            <div className="rounded-md bg-red-50 border border-red-200 p-4 mb-6 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Apoyo Origen</span>
              <select
                value={origenId}
                onChange={(e) => setOrigenId(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Selecciona apoyo origen</option>
                {apoyos.map((apoyo) => (
                  <option key={apoyo.id} value={apoyo.id}>
                    {`Apoyo ${apoyo.numero} (${apoyo.nivel_tension})`}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Apoyo Destino</span>
              <select
                value={destinoId}
                onChange={(e) => setDestinoId(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Selecciona apoyo destino</option>
                {apoyos.map((apoyo) => (
                  <option key={apoyo.id} value={apoyo.id}>
                    {`Apoyo ${apoyo.numero} (${apoyo.nivel_tension})`}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Longitud (m)</span>
              <input
                type="number"
                value={longitud}
                onChange={(e) => setLongitud(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tensión</span>
              <select
                value={tension}
                onChange={(e) => setTension(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="BT">BT</option>
                <option value="MT">MT</option>
              </select>
            </label>

            <div className="block">
              <span className="text-sm font-medium text-slate-700">&nbsp;</span>
              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex h-full w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? 'Guardando...' : 'Crear Tramo'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  </Layout>
  );
}

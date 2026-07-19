'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  visitasApi,
  usuariosApi,
  apoyosApi,
  tramosApi,
  validacionesApi,
  informeApi,
  exportacionApi,
} from '../../../src/lib/api/client';
import {
  Visita,
  UsuarioBeneficiario,
  Apoyo,
  Tramo,
  Inconsistencia,
  InformeTecnico,
} from '../../../src/types';
import { Layout } from '../../../src/components/layout';
import { FormField, Form } from '../../../src/components/forms/FormFields';

export default function Page() {
  const params = useParams();
  const visitaId = params.id as string;

  const [visita, setVisita] = useState<Visita | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioBeneficiario[]>([]);
  const [apoyos, setApoyos] = useState<Apoyo[]>([]);
  const [tramos, setTramos] = useState<Tramo[]>([]);
  const [inconsistencias, setInconsistencias] = useState<Inconsistencia[]>([]);
  const [informe, setInforme] = useState<InformeTecnico | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'usuarios' | 'apoyos' | 'tramos' | 'validaciones' | 'informe'>('general');

  const [usuarioForm, setUsuarioForm] = useState({
    nombre: '',
    num_medidor: '',
    tipo_medidor: '',
    acometida: '',
    observaciones: '',
  });

  const [apoyoForm, setApoyoForm] = useState({
    numero: 1,
    nivel_tension: 'BT',
    tipo_poste: '',
    perchas: 0,
    templetes_bt: 0,
    templetes_mt: 0,
    tierras_bt: 0,
    tierras_mt: 0,
    conectores: 0,
    transformador: false,
  });

  const [tramoForm, setTramoForm] = useState({
    apoyo_origen_id: '',
    apoyo_destino_id: '',
    nivel_tension: 'BT',
    longitud_ml: '',
    observaciones: '',
  });

  const [observacionesInforme, setObservacionesInforme] = useState('');

  const handleAgregarTramo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!tramoForm.apoyo_origen_id || !tramoForm.apoyo_destino_id) {
        throw new Error('Selecciona ambos apoyos');
      }

      if (tramoForm.apoyo_origen_id === tramoForm.apoyo_destino_id) {
        throw new Error('El apoyo origen y destino deben ser distintos');
      }

      await tramosApi.create({
        visita_id: visitaId,
        ...tramoForm,
        longitud_ml: Number(tramoForm.longitud_ml),
      });

      setTramoForm({
        apoyo_origen_id: '',
        apoyo_destino_id: '',
        nivel_tension: 'BT',
        longitud_ml: '',
        observaciones: '',
      });

      await loadData();
    } catch (err) {
      console.error('Error adding tramo:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [visitaId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [visitaData, usuariosData, apoyosData, tramosData] = await Promise.all([
        visitasApi.getById(visitaId),
        usuariosApi.getByVisita(visitaId),
        apoyosApi.getByVisita(visitaId),
        tramosApi.getByVisita(visitaId),
      ]) as [Visita, UsuarioBeneficiario[], Apoyo[], Tramo[]];

      setVisita(visitaData);
      setUsuarios(usuariosData);
      setApoyos(apoyosData);
      setTramos(tramosData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidar = async () => {
    try {
      const result = (await validacionesApi.validar(visitaId)) as { inconsistencias: Inconsistencia[] };
      setInconsistencias(result.inconsistencias);
      setActiveTab('validaciones');
    } catch (err) {
      console.error('Error validating:', err);
    }
  };

  const handleVerInforme = async () => {
    try {
      const result = (await informeApi.getCompleto(visitaId)) as InformeTecnico;
      setInforme(result);
      setActiveTab('informe');
    } catch (err) {
      console.error('Error loading informe:', err);
    }
  };

  const handleDescargarExcel = async () => {
    try {
      await exportacionApi.downloadExcel(visitaId);
    } catch (err) {
      console.error('Error downloading Excel:', err);
    }
  };

  const handleAgregarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usuariosApi.create({
        visita_id: visitaId,
        ...usuarioForm,
      });
      setUsuarioForm({
        nombre: '',
        num_medidor: '',
        tipo_medidor: '',
        acometida: '',
        observaciones: '',
      });
      await loadData();
    } catch (err) {
      console.error('Error adding usuario:', err);
    }
  };

  const handleAgregarApoyo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apoyosApi.create({
        visita_id: visitaId,
        ...apoyoForm,
      });
      setApoyoForm({
        numero: apoyos.length + 1,
        nivel_tension: 'BT',
        tipo_poste: '',
        perchas: 0,
        templetes_bt: 0,
        templetes_mt: 0,
        tierras_bt: 0,
        tierras_mt: 0,
        conectores: 0,
        transformador: false,
      });
      await loadData();
    } catch (err) {
      console.error('Error adding apoyo:', err);
    }
  };

  const tramosConInconsistencias = tramos.filter(
    (tramo) => tramo.nivel_tension === 'BT' && Number(tramo.longitud_ml) > 45,
  );

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </Layout>
    );
  }

  if (!visita) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">Visita no encontrada</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📍 {visita.contrato}</h1>
        <p className="text-gray-600">
          {visita.vereda} - {visita.municipio}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={handleValidar}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          ✓ Validar Inconsistencias
        </button>
        <button
          onClick={handleVerInforme}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📄 Ver Informe
        </button>
        <button
          onClick={handleDescargarExcel}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📊 Descargar Excel
        </button>
      </div>

      <div className="flex gap-2 mb-8 border-b">
        {(['general', 'usuarios', 'apoyos', 'tramos', 'validaciones', 'informe'] as const).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'general' && '📋 General'}
              {tab === 'usuarios' && '👥 Usuarios'}
              {tab === 'apoyos' && '📌 Apoyos'}
              {tab === 'tramos' && '〰️ Tramos'}
              {tab === 'validaciones' && '⚠️ Validaciones'}
              {tab === 'informe' && '📄 Informe'}
            </button>
          ),
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'general' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Contrato</p>
              <p className="text-xl font-semibold">{visita.contrato}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Técnico</p>
              <p className="text-xl font-semibold">{visita.tecnico_id}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Vereda</p>
              <p className="text-xl font-semibold">{visita.vereda}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Municipio</p>
              <p className="text-xl font-semibold">{visita.municipio}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Fecha</p>
              <p className="text-xl font-semibold">
                {new Date(visita.fecha).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Resumen</p>
              <p className="text-xl font-semibold">
                👥 {usuarios.length} | 📌 {apoyos.length} | 〰️ {tramos.length}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Usuarios Beneficiarios</h3>

            <Form onSubmit={handleAgregarUsuario}>
              <h4 className="text-lg font-semibold mb-4 text-gray-700">Agregar Usuario</h4>
              <FormField
                label="Nombre"
                name="nombre"
                value={usuarioForm.nombre}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, nombre: e.target.value })}
              />
              <FormField
                label="Número de Medidor"
                name="num_medidor"
                value={usuarioForm.num_medidor}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, num_medidor: e.target.value })}
              />
              <FormField
                label="Tipo de Medidor"
                name="tipo_medidor"
                value={usuarioForm.tipo_medidor}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, tipo_medidor: e.target.value })}
              />
              <FormField
                label="Acometida"
                name="acometida"
                value={usuarioForm.acometida}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, acometida: e.target.value })}
              />
              <FormField
                label="Observaciones"
                name="observaciones"
                type="textarea"
                value={usuarioForm.observaciones}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, observaciones: e.target.value })}
              />
            </Form>

            <h4 className="text-lg font-semibold mt-8 mb-4">Usuarios Registrados</h4>
            {usuarios.length === 0 ? (
              <p className="text-gray-600">No hay usuarios registrados</p>
            ) : (
              <div className="space-y-4">
                {usuarios.map((usuario) => (
                  <div key={usuario.id} className="p-4 border border-gray-200 rounded">
                    <p className="font-semibold">{usuario.nombre || 'Sin nombre'}</p>
                    <p className="text-sm text-gray-600">Medidor: {usuario.num_medidor || 'Por confirmar'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'apoyos' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Apoyos (Postes)</h3>

            <Form onSubmit={handleAgregarApoyo}>
              <h4 className="text-lg font-semibold mb-4 text-gray-700">Agregar Apoyo</h4>
              <FormField
                label="Número de Apoyo"
                name="numero"
                type="number"
                value={apoyoForm.numero}
                onChange={(e) => setApoyoForm({ ...apoyoForm, numero: parseInt(e.target.value) })}
              />
              <FormField
                label="Nivel de Tensión"
                name="nivel_tension"
                type="select"
                value={apoyoForm.nivel_tension}
                options={[
                  { value: 'BT', label: 'Baja Tensión (BT)' },
                  { value: 'MT', label: 'Media Tensión (MT)' },
                ]}
                onChange={(e) => setApoyoForm({ ...apoyoForm, nivel_tension: e.target.value })}
              />
              <FormField
                label="Tipo de Poste"
                name="tipo_poste"
                value={apoyoForm.tipo_poste}
                onChange={(e) => setApoyoForm({ ...apoyoForm, tipo_poste: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Perchas"
                  name="perchas"
                  type="number"
                  value={apoyoForm.perchas}
                  onChange={(e) => setApoyoForm({ ...apoyoForm, perchas: parseInt(e.target.value) })}
                />
                <FormField
                  label="Templetes BT"
                  name="templetes_bt"
                  type="number"
                  value={apoyoForm.templetes_bt}
                  onChange={(e) => setApoyoForm({ ...apoyoForm, templetes_bt: parseInt(e.target.value) })}
                />
                <FormField
                  label="Templetes MT"
                  name="templetes_mt"
                  type="number"
                  value={apoyoForm.templetes_mt}
                  onChange={(e) => setApoyoForm({ ...apoyoForm, templetes_mt: parseInt(e.target.value) })}
                />
                <FormField
                  label="Tierras BT"
                  name="tierras_bt"
                  type="number"
                  value={apoyoForm.tierras_bt}
                  onChange={(e) => setApoyoForm({ ...apoyoForm, tierras_bt: parseInt(e.target.value) })}
                />
              </div>
            </Form>

            <h4 className="text-lg font-semibold mt-8 mb-4">Apoyos Registrados</h4>
            {apoyos.length === 0 ? (
              <p className="text-gray-600">No hay apoyos registrados</p>
            ) : (
              <div className="space-y-4">
                {apoyos.map((apoyo) => (
                  <div key={apoyo.id} className="p-4 border border-gray-200 rounded">
                    <p className="font-semibold">Apoyo {apoyo.numero} - {apoyo.nivel_tension}</p>
                    <p className="text-sm text-gray-600">
                      Perchas: {apoyo.perchas} | Templetes BT: {apoyo.templetes_bt} | Templetes MT: {apoyo.templetes_mt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tramos' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Tramos</h3>

            <form onSubmit={handleAgregarTramo} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-700">Nuevo Tramo</h4>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Apoyo Origen</span>
                  <select
                    value={tramoForm.apoyo_origen_id}
                    onChange={(e) => setTramoForm({ ...tramoForm, apoyo_origen_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  <span className="text-sm font-medium text-gray-700">Apoyo Destino</span>
                  <select
                    value={tramoForm.apoyo_destino_id}
                    onChange={(e) => setTramoForm({ ...tramoForm, apoyo_destino_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Nivel de Tensión</span>
                  <select
                    value={tramoForm.nivel_tension}
                    onChange={(e) => setTramoForm({ ...tramoForm, nivel_tension: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="BT">BT</option>
                    <option value="MT">MT</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Longitud (m)</span>
                  <input
                    type="number"
                    value={tramoForm.longitud_ml}
                    onChange={(e) => setTramoForm({ ...tramoForm, longitud_ml: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Observaciones</span>
                  <input
                    type="text"
                    value={tramoForm.observaciones}
                    onChange={(e) => setTramoForm({ ...tramoForm, observaciones: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
                >
                  Guardar Tramo
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4">Tramos Registrados</h4>
              {tramos.length === 0 ? (
                <p className="text-gray-600">No hay tramos registrados</p>
              ) : (
                <div className="space-y-4">
                  {tramos.map((tramo) => (
                    <div key={tramo.id} className="p-4 border border-gray-200 rounded">
                      <p className="font-semibold">
                        Apoyo {tramo.apoyo_origen?.numero} → Apoyo {tramo.apoyo_destino?.numero}
                      </p>
                      <p className="text-sm text-gray-600">
                        Longitud: {tramo.longitud_ml} ml | Tensión: {tramo.nivel_tension}
                      </p>
                      {tramo.observaciones && (
                        <p className="text-sm text-gray-600 mt-2">Observaciones: {tramo.observaciones}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'validaciones' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Inconsistencias Detectadas</h3>
            {tramosConInconsistencias.length > 0 ? (
              <div className="space-y-4">
                {tramosConInconsistencias.map((tramo) => (
                  <div
                    key={tramo.id}
                    className="p-4 border border-red-400 bg-yellow-50 rounded"
                  >
                    <p className="font-semibold text-red-700">
                      Inconsistencia: Tramo {tramo.apoyo_origen?.numero} → Apoyo {tramo.apoyo_destino?.numero} excede la distancia máxima permitida para BT (45m).
                    </p>
                    <p className="text-sm text-red-700 mt-2">
                      Longitud registrada: {tramo.longitud_ml}m
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-600 font-semibold">✓ No hay inconsistencias</p>
            )}
          </div>
        )}

        {activeTab === 'informe' && (
          <div>
            <h3 className="text-3xl font-bold mb-6">Resumen del Informe Técnico</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm text-slate-500 mb-2">Total de Apoyos Registrados</p>
                <p className="text-4xl font-bold text-slate-900">{apoyos.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm text-slate-500 mb-2">Total de Tramos Conectados</p>
                <p className="text-4xl font-bold text-slate-900">{tramos.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm text-slate-500 mb-2">Alertas Técnicas Detectadas</p>
                <p className="text-4xl font-bold text-slate-900">{tramosConInconsistencias.length}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Observaciones Generales</h4>
              <textarea
                value={observacionesInforme}
                onChange={(e) => setObservacionesInforme(e.target.value)}
                placeholder="Escribe aquí las observaciones del inspector..."
                className="w-full min-h-[160px] rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

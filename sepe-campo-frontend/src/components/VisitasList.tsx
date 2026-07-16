'use client';

import { Visita } from '@/types';
import Link from 'next/link';

interface VisitasListProps {
  visitas: Visita[];
  onDelete?: (id: string) => void;
}

export default function VisitasList({ visitas, onDelete }: VisitasListProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contrato</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vereda</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Municipio</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Técnico</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {visitas.map((visita) => (
            <tr key={visita.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{visita.contrato}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{visita.vereda}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{visita.municipio}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{visita.tecnico_id}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(visita.fecha).toLocaleDateString('es-ES')}
              </td>
              <td className="px-6 py-4 text-sm space-x-2">
                <Link
                  href={`/visitas/${visita.id}`}
                  className="text-blue-600 hover:text-blue-900 font-medium"
                >
                  Ver
                </Link>
                {onDelete && (
                  <button
                    onClick={() => onDelete(visita.id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { visitasApi } from '../../../src/lib/api/client';
import { FormField, Form } from '../../../src/components/forms/FormFields';
import { Layout } from '../../../src/components/layout';

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    contrato: '',
    vereda: '',
    municipio: '',
    tecnico_id: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await visitasApi.create(formData);
      router.push(`/visitas/${result.id}`);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">➕ Nueva Visita</h1>
        <p className="text-gray-600">Crea una nueva visita de verificación de obra</p>
      </div>

      <div className="max-w-2xl">
        <Form onSubmit={handleSubmit} isLoading={isLoading}>
          <FormField
            label="Contrato"
            name="contrato"
            placeholder="CONT-2024-001"
            value={formData.contrato}
            onChange={handleChange}
            required
          />
          <FormField
            label="Vereda"
            name="vereda"
            placeholder="San Fernando"
            value={formData.vereda}
            onChange={handleChange}
            required
          />
          <FormField
            label="Municipio"
            name="municipio"
            placeholder="Bogotá"
            value={formData.municipio}
            onChange={handleChange}
            required
          />
          <FormField
            label="Técnico Responsable"
            name="tecnico_id"
            placeholder="tech-001"
            value={formData.tecnico_id}
            onChange={handleChange}
            required
          />
          <FormField
            label="Fecha de Visita"
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </Form>
      </div>
    </Layout>
  );
}

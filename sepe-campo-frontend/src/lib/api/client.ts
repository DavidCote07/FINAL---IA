// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Cliente HTTP genérico
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    const errorData = contentType.includes('application/json')
      ? await response.json().catch(() => ({}))
      : { message: await response.text().catch(() => response.statusText) };

    throw new Error(
      errorData?.message || `API Error: ${response.statusText}`,
    );
  }

  return response.json();
}

// ===== VISITAS =====
export const visitasApi = {
  create: (data: any) =>
    apiCall('/visitas', { method: 'POST', body: JSON.stringify(data) }),
  
  getAll: (tecnicoId?: string) => {
    const url = tecnicoId ? `/visitas?tecnico_id=${tecnicoId}` : '/visitas';
    return apiCall(url);
  },
  
  getById: (id: string) =>
    apiCall(`/visitas/${id}`),
  
  update: (id: string, data: any) =>
    apiCall(`/visitas/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  
  delete: (id: string) =>
    apiCall(`/visitas/${id}`, { method: 'DELETE' }),
};

// ===== USUARIOS BENEFICIARIOS =====
export const usuariosApi = {
  create: (data: any) =>
    apiCall('/usuarios-beneficiarios', { method: 'POST', body: JSON.stringify(data) }),
  
  getByVisita: (visitaId: string) =>
    apiCall(`/usuarios-beneficiarios?visita_id=${visitaId}`),
  
  getById: (id: string) =>
    apiCall(`/usuarios-beneficiarios/${id}`),
  
  update: (id: string, data: any) =>
    apiCall(`/usuarios-beneficiarios/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  
  delete: (id: string) =>
    apiCall(`/usuarios-beneficiarios/${id}`, { method: 'DELETE' }),
};

// ===== APOYOS =====
export const apoyosApi = {
  create: (data: any) =>
    apiCall('/apoyos', { method: 'POST', body: JSON.stringify(data) }),
  
  getByVisita: (visitaId: string) =>
    apiCall(`/apoyos?visita_id=${visitaId}`),
  
  getById: (id: string) =>
    apiCall(`/apoyos/${id}`),
  
  update: (id: string, data: any) =>
    apiCall(`/apoyos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  
  delete: (id: string) =>
    apiCall(`/apoyos/${id}`, { method: 'DELETE' }),
};

// ===== TRAMOS =====
export const tramosApi = {
  create: (data: any) =>
    apiCall('/tramos', { method: 'POST', body: JSON.stringify(data) }),
  
  getByVisita: (visitaId: string) =>
    apiCall(`/tramos?visita_id=${visitaId}`),
  
  getById: (id: string) =>
    apiCall(`/tramos/${id}`),
  
  getAcsrTotal: (visitaId: string) =>
    apiCall(`/tramos/${visitaId}/acsr-total`),
  
  update: (id: string, data: any) =>
    apiCall(`/tramos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  
  delete: (id: string) =>
    apiCall(`/tramos/${id}`, { method: 'DELETE' }),
};

// ===== VALIDACIONES =====
export const validacionesApi = {
  validar: (visitaId: string) =>
    apiCall(`/validaciones/validar/${visitaId}`, { method: 'POST' }),
  
  getInconsistencias: (visitaId: string) =>
    apiCall(`/validaciones/inconsistencias?visita_id=${visitaId}`),
  
  limpiar: (visitaId: string) =>
    apiCall(`/validaciones/limpiar/${visitaId}`, { method: 'POST' }),
};

// ===== CONSOLIDADO =====
export const consolidadoApi = {
  getByVisita: (visitaId: string) =>
    apiCall(`/consolidado/${visitaId}`),
  
  getEstructuras: (visitaId: string) =>
    apiCall(`/consolidado/${visitaId}/estructuras`),
};

// ===== INFORME TÉCNICO =====
export const informeApi = {
  getCompleto: (visitaId: string) =>
    apiCall(`/informe-tecnico/${visitaId}`),
  
  getResumen: (visitaId: string) =>
    apiCall(`/informe-tecnico/${visitaId}/resumen`),
};

// ===== EXPORTACIÓN EXCEL =====
export const exportacionApi = {
  downloadExcel: async (visitaId: string) => {
    const url = `${API_BASE_URL}/exportacion-excel/descargar/${visitaId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al descargar Excel');
    }
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Informe_${visitaId}_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

// ===== AUTH =====
export const authApi = {
  login: async (data: { username: string; password: string }) =>
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: async (data: { username: string; password: string }) =>
    apiCall('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
};


// Tipos principales del sistema SEPE Campo

export interface Visita {
  id: string;
  contrato: string;
  vereda: string;
  municipio: string;
  tecnico_id: string;
  fecha: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitaDto {
  contrato: string;
  vereda: string;
  municipio: string;
  tecnico_id: string;
  fecha: string;
}

export interface UsuarioBeneficiario {
  id: string;
  visita_id: string;
  nombre?: string;
  num_medidor?: string;
  tipo_medidor?: string;
  acometida?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUsuarioBeneficiarioDto {
  visita_id: string;
  nombre?: string;
  num_medidor?: string;
  tipo_medidor?: string;
  acometida?: string;
  observaciones?: string;
}

export interface EstructuraApoyo {
  id: string;
  codigo: string;
  cantidad: number;
}

export interface Apoyo {
  id: string;
  visita_id: string;
  numero: number;
  nivel_tension: string;
  tipo_poste?: string;
  perchas: number;
  templetes_bt: number;
  templetes_mt: number;
  tierras_bt: number;
  tierras_mt: number;
  conectores: number;
  transformador: boolean;
  coord_x?: number;
  coord_y?: number;
  coord_z?: number;
  observaciones?: string;
  estructuras: EstructuraApoyo[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateApoyoDto {
  visita_id: string;
  numero: number;
  nivel_tension: string;
  tipo_poste?: string;
  perchas?: number;
  templetes_bt?: number;
  templetes_mt?: number;
  tierras_bt?: number;
  tierras_mt?: number;
  conectores?: number;
  transformador?: boolean;
  coord_x?: number;
  coord_y?: number;
  coord_z?: number;
  observaciones?: string;
  estructuras?: EstructuraApoyo[];
}

export interface Tramo {
  id: string;
  visita_id: string;
  apoyo_origen_id: string;
  apoyo_destino_id: string;
  nivel_tension: string;
  longitud_ml: number;
  observaciones?: string;
  apoyo_origen?: { numero: number };
  apoyo_destino?: { numero: number };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTramoDto {
  visita_id: string;
  apoyo_origen_id: string;
  apoyo_destino_id: string;
  nivel_tension: string;
  longitud_ml: number;
  observaciones?: string;
}

export interface Inconsistencia {
  id: string;
  numero_regla: number;
  descripcion: string;
  mensaje: string;
  severidad: string;
  apoyo_id?: string;
  usuario_id?: string;
  tramo_id?: string;
  apoyo_numero?: number;
  usuario_nombre?: string;
  createdAt: string;
}

export interface Consolidado {
  total_apoyos: number;
  total_usuarios: number;
  total_tramos: number;
  total_acsr: number;
  total_perchas: number;
  total_templetes_bt: number;
  total_templetes_mt: number;
  total_tierras_bt: number;
  total_tierras_mt: number;
  total_conectores: number;
  total_transformadores: number;
  total_longitud_ml: number;
  by_nivel_tension: {
    [key: string]: {
      apoyos: number;
      tramos: number;
      longitud_ml: number;
    };
  };
}

export interface InformeTecnico {
  visita: {
    id: string;
    contrato: string;
    vereda: string;
    municipio: string;
    tecnico_id: string;
    fecha: string;
    fecha_informe: string;
  };
  resumen_ejecutivo: {
    total_apoyos: number;
    total_usuarios: number;
    total_tramos: number;
    total_acsr: number;
    total_longitud_ml: number;
  };
  usuarios_beneficiarios: UsuarioBeneficiario[];
  apoyos: Apoyo[];
  tramos: Tramo[];
  consolidado: Consolidado;
  inconsistencias: Inconsistencia[];
}

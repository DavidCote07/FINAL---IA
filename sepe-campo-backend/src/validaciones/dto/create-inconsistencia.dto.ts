export class CreateInconsistenciaDto {
  visita_id: string;
  apoyo_id?: string;
  usuario_id?: string;
  tramo_id?: string;
  numero_regla: number;
  descripcion: string;
  mensaje: string;
  severidad?: string;
}

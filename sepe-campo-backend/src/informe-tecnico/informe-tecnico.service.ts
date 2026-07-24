import { Injectable, NotFoundException } from '@nestjs/common';
import { VisitasService } from '../visitas/visitas.service';
import { ApoyosService } from '../apoyos/apoyos.service';
import { TramosService } from '../tramos/tramos.service';
import { UsuariosBeneficiariosService } from '../usuarios-beneficiarios/usuarios-beneficiarios.service';
import { ValidacionesService } from '../validaciones/validaciones.service';
import { ConsolidadoService } from '../consolidado/consolidado.service';

interface InformeTecnico {
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
    total_perchas: number;
    total_templetes_bt: number;
    total_medidores_a1: number;
    total_medidores_a3: number;
    total_cable_duplex_ml: number;
    total_cable_triplex_ml: number;
    total_postes_nuevos: number;
    total_postes_existentes: number;
  };

  usuarios_beneficiarios: any[];
  apoyos: any[];
  tramos: any[];
  consolidado: any;
  inconsistencias: any[];
}

export interface InformeTotal {
  total_visitas: number;
  total_apoyos: number;
  total_usuarios: number;
  total_tramos: number;
  total_acsr: number;
  total_longitud_ml: number;
  total_perchas: number;
  total_templetes_bt: number;
  total_tierras_bt: number;
  total_conectores: number;
  total_medidores_a1: number;
  total_medidores_a3: number;
  total_cable_duplex_ml: number;
  total_cable_triplex_ml: number;
  total_postes_nuevos: number;
  total_postes_existentes: number;
  visitas: Array<{
    id: string;
    contrato: string;
    vereda: string;
    municipio: string;
    fecha: string;
    tecnico_id: string;
  }>;
}

@Injectable()
export class InformeTecnicoService {
  constructor(
    private visitasService: VisitasService,
    private apoyosService: ApoyosService,
    private tramosService: TramosService,
    private usuariosService: UsuariosBeneficiariosService,
    private validacionesService: ValidacionesService,
    private consolidadoService: ConsolidadoService,
  ) {}

  /**
   * Genera el informe técnico completo para una visita
   */
  async generateInforme(visitaId: string): Promise<InformeTecnico> {
    // Obtener visita
    const visita = await this.visitasService.findOne(visitaId);
    if (!visita) {
      throw new NotFoundException(`Visita ${visitaId} no encontrada`);
    }

    // Obtener datos de la visita
    const usuarios = await this.usuariosService.findAll(visitaId);
    const apoyos = await this.apoyosService.findAll(visitaId);
    const tramos = await this.tramosService.findAll(visitaId);
    const consolidado = await this.consolidadoService.calculateConsolidado(
      visitaId,
    );
    const inconsistencias = await this.validacionesService.findByVisita(
      visitaId,
    );

    // Calcular ACSR
    const totalAcsr = await this.tramosService.calculateTotalACsr(visitaId);

    const totalMedidoresA1 = usuarios.filter(
      (u) => this.normalizar(u.tipo_medidor) === 'A1',
    ).length;
    const totalMedidoresA3 = usuarios.filter(
      (u) => this.normalizar(u.tipo_medidor) === 'A3',
    ).length;
    const totalCableDuplexMl = tramos
      .filter((t) => this.normalizar(t.tipo_cable) === 'DUPLEX')
      .reduce((sum, t) => sum + Number(t.longitud_ml), 0);
    const totalCableTriplexMl = tramos
      .filter((t) => this.normalizar(t.tipo_cable) === 'TRIPLEX')
      .reduce((sum, t) => sum + Number(t.longitud_ml), 0);
    const totalPostesNuevos = apoyos.filter((a) => a.poste_nuevo).length;
    const totalPostesExistentes = apoyos.length - totalPostesNuevos;

    // Construir informe
    const informe: InformeTecnico = {
      visita: {
        id: visita.id,
        contrato: visita.contrato,
        vereda: visita.vereda,
        municipio: visita.municipio,
        tecnico_id: visita.tecnico_id,
        fecha: visita.fecha,
        fecha_informe: new Date().toISOString(),
      },

      resumen_ejecutivo: {
        total_apoyos: apoyos.length,
        total_usuarios: usuarios.length,
        total_tramos: tramos.length,
        total_acsr: totalAcsr,
        total_longitud_ml: tramos.reduce(
          (sum, t) => sum + Number(t.longitud_ml),
          0,
        ),
        total_perchas: consolidado.total_perchas,
        total_templetes_bt: consolidado.total_templetes_bt,
        total_medidores_a1: totalMedidoresA1,
        total_medidores_a3: totalMedidoresA3,
        total_cable_duplex_ml: totalCableDuplexMl,
        total_cable_triplex_ml: totalCableTriplexMl,
        total_postes_nuevos: totalPostesNuevos,
        total_postes_existentes: totalPostesExistentes,
      },

      usuarios_beneficiarios: usuarios.map((u) => ({
        id: u.id,
        nombre: u.nombre || 'Por confirmar',
        num_medidor: u.num_medidor || 'Por confirmar',
        tipo_medidor: u.tipo_medidor || 'Por confirmar',
        observaciones: u.observaciones,
      })),

      apoyos: apoyos.map((a) => ({
        id: a.id,
        numero: a.numero,
        nivel_tension: a.nivel_tension,
        tipo_poste: a.tipo_poste,
        poste_nuevo: a.poste_nuevo,
        componentes: {
          perchas: a.perchas,
          templetes_bt: a.templetes_bt,
          tierras_bt: a.tierras_bt,
          conectores: a.conectores,
        },
        coordenadas: {
          x: a.coord_x,
          y: a.coord_y,
          z: a.coord_z,
        },
        estructuras: a.estructuras || [],
        observaciones: a.observaciones,
      })),

      tramos: tramos.map((t) => ({
        id: t.id,
        apoyo_origen: t.apoyo_origen?.numero,
        apoyo_destino: t.apoyo_destino?.numero,
        nivel_tension: t.nivel_tension,
        tipo_cable: t.tipo_cable,
        longitud_ml: t.longitud_ml,
        observaciones: t.observaciones,
      })),

      consolidado: consolidado,

      inconsistencias: inconsistencias.map((i) => ({
        id: i.id,
        numero_regla: i.numero_regla,
        descripcion: i.descripcion,
        mensaje: i.mensaje,
        severidad: i.severidad,
        apoyo_numero: i.apoyo?.numero,
        usuario_nombre: i.usuario?.nombre,
      })),
    };

    return informe;
  }

  private normalizar(valor?: string | null): string {
    return String(valor ?? '').trim().toUpperCase();
  }

  /**
   * Genera el informe total consolidando las cantidades de todas las visitas
   */
  async generateInformeTotal(): Promise<InformeTotal> {
    const visitas = await this.visitasService.findAll();
    const apoyos = await this.apoyosService.findAll();
    const tramos = await this.tramosService.findAll();
    const usuarios = await this.usuariosService.findAll();

    const totalLongitudMl = tramos.reduce(
      (sum, t) => sum + Number(t.longitud_ml),
      0,
    );
    const totalMedidoresA1 = usuarios.filter(
      (u) => this.normalizar(u.tipo_medidor) === 'A1',
    ).length;
    const totalMedidoresA3 = usuarios.filter(
      (u) => this.normalizar(u.tipo_medidor) === 'A3',
    ).length;
    const totalCableDuplexMl = tramos
      .filter((t) => this.normalizar(t.tipo_cable) === 'DUPLEX')
      .reduce((sum, t) => sum + Number(t.longitud_ml), 0);
    const totalCableTriplexMl = tramos
      .filter((t) => this.normalizar(t.tipo_cable) === 'TRIPLEX')
      .reduce((sum, t) => sum + Number(t.longitud_ml), 0);
    const totalPostesNuevos = apoyos.filter((a) => a.poste_nuevo).length;
    const totalPostesExistentes = apoyos.length - totalPostesNuevos;

    return {
      total_visitas: visitas.length,
      total_apoyos: apoyos.length,
      total_usuarios: usuarios.length,
      total_tramos: tramos.length,
      total_acsr: totalLongitudMl * 2,
      total_longitud_ml: totalLongitudMl,
      total_perchas: apoyos.reduce((sum, a) => sum + a.perchas, 0),
      total_templetes_bt: apoyos.reduce((sum, a) => sum + a.templetes_bt, 0),
      total_tierras_bt: apoyos.reduce((sum, a) => sum + a.tierras_bt, 0),
      total_conectores: apoyos.reduce((sum, a) => sum + a.conectores, 0),
      total_medidores_a1: totalMedidoresA1,
      total_medidores_a3: totalMedidoresA3,
      total_cable_duplex_ml: totalCableDuplexMl,
      total_cable_triplex_ml: totalCableTriplexMl,
      total_postes_nuevos: totalPostesNuevos,
      total_postes_existentes: totalPostesExistentes,
      visitas: visitas.map((v) => ({
        id: v.id,
        contrato: v.contrato,
        vereda: v.vereda,
        municipio: v.municipio,
        fecha: v.fecha,
        tecnico_id: v.tecnico_id,
      })),
    };
  }

  /**
   * Genera un resumen ejecutivo de la visita
   */
  async generateResumen(visitaId: string): Promise<any> {
    const visita = await this.visitasService.findOne(visitaId);
    if (!visita) {
      throw new NotFoundException(`Visita ${visitaId} no encontrada`);
    }

    const apoyos = await this.apoyosService.findAll(visitaId);
    const tramos = await this.tramosService.findAll(visitaId);
    const usuarios = await this.usuariosService.findAll(visitaId);
    const consolidado = await this.consolidadoService.calculateConsolidado(
      visitaId,
    );
    const inconsistencias = await this.validacionesService.findByVisita(
      visitaId,
    );

    const totalAcsr = await this.tramosService.calculateTotalACsr(visitaId);

    return {
      visita: {
        contrato: visita.contrato,
        vereda: visita.vereda,
        municipio: visita.municipio,
        fecha: visita.fecha,
        tecnico_id: visita.tecnico_id,
      },
      resumen: {
        total_apoyos: apoyos.length,
        total_usuarios: usuarios.length,
        total_tramos: tramos.length,
        total_acsr: totalAcsr,
        total_longitud_ml: consolidado.total_longitud_ml,
        por_nivel_tension: consolidado.by_nivel_tension,
      },
      componentes_totales: {
        perchas: consolidado.total_perchas,
        templetes_bt: consolidado.total_templetes_bt,
        tierras_bt: consolidado.total_tierras_bt,
        conectores: consolidado.total_conectores,
      },
      alertas: {
        total: inconsistencias.length,
        warnings: inconsistencias.filter((i) => i.severidad === 'WARNING')
          .length,
        info: inconsistencias.filter((i) => i.severidad === 'INFO').length,
      },
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { ApoyosService } from '../apoyos/apoyos.service';
import { TramosService } from '../tramos/tramos.service';
import { UsuariosBeneficiariosService } from '../usuarios-beneficiarios/usuarios-beneficiarios.service';

interface ConsolidadoQuantities {
  total_apoyos: number;
  total_usuarios: number;
  total_tramos: number;
  total_acsr: number;

  // Componentes de apoyo
  total_perchas: number;
  total_templetes_bt: number;
  total_tierras_bt: number;
  total_conectores: number;

  // Longitud total
  total_longitud_ml: number;

  // Por nivel de tensión
  by_nivel_tension: {
    [key: string]: {
      apoyos: number;
      tramos: number;
      longitud_ml: number;
    };
  };
}

@Injectable()
export class ConsolidadoService {
  constructor(
    private apoyosService: ApoyosService,
    private tramosService: TramosService,
    private usuariosService: UsuariosBeneficiariosService,
  ) {}

  /**
   * Calcula el consolidado de cantidades para una visita
   */
  async calculateConsolidado(visitaId: string): Promise<ConsolidadoQuantities> {
    // Obtener datos de la visita
    const apoyos = await this.apoyosService.findAll(visitaId);
    const tramos = await this.tramosService.findAll(visitaId);
    const usuarios = await this.usuariosService.findAll(visitaId);

    if (
      apoyos.length === 0 &&
      tramos.length === 0 &&
      usuarios.length === 0
    ) {
      throw new NotFoundException(
        'No se encontraron datos para la visita especificada',
      );
    }

    // Inicializar consolidado
    const consolidado: ConsolidadoQuantities = {
      total_apoyos: apoyos.length,
      total_usuarios: usuarios.length,
      total_tramos: tramos.length,
      total_acsr: 0,

      // Componentes
      total_perchas: 0,
      total_templetes_bt: 0,
      total_tierras_bt: 0,
      total_conectores: 0,

      // Longitud
      total_longitud_ml: 0,

      // Por nivel de tensión
      by_nivel_tension: {},
    };

    // Sumar componentes de apoyos
    for (const apoyo of apoyos) {
      consolidado.total_perchas += apoyo.perchas;
      consolidado.total_templetes_bt += apoyo.templetes_bt;
      consolidado.total_tierras_bt += apoyo.tierras_bt;
      consolidado.total_conectores += apoyo.conectores;

      // Agregar por nivel de tensión
      if (!consolidado.by_nivel_tension[apoyo.nivel_tension]) {
        consolidado.by_nivel_tension[apoyo.nivel_tension] = {
          apoyos: 0,
          tramos: 0,
          longitud_ml: 0,
        };
      }
      consolidado.by_nivel_tension[apoyo.nivel_tension].apoyos += 1;
    }

    // Sumar longitudes de tramos y calcular ACSR
    for (const tramo of tramos) {
      consolidado.total_longitud_ml += Number(tramo.longitud_ml);

      // Agregar por nivel de tensión
      if (!consolidado.by_nivel_tension[tramo.nivel_tension]) {
        consolidado.by_nivel_tension[tramo.nivel_tension] = {
          apoyos: 0,
          tramos: 0,
          longitud_ml: 0,
        };
      }
      consolidado.by_nivel_tension[tramo.nivel_tension].tramos += 1;
      consolidado.by_nivel_tension[tramo.nivel_tension].longitud_ml +=
        Number(tramo.longitud_ml);
    }

    // Calcular ACSR total (longitud × 2 conductores)
    consolidado.total_acsr = consolidado.total_longitud_ml * 2;

    return consolidado;
  }

  /**
   * Obtiene un resumen de cantidades por tipo de estructura
   */
  async getStructuresSummary(
    visitaId: string,
  ): Promise<{ [key: string]: number }> {
    const apoyos = await this.apoyosService.findAll(visitaId);
    const summary: { [key: string]: number } = {};

    for (const apoyo of apoyos) {
      if (apoyo.estructuras && apoyo.estructuras.length > 0) {
        for (const estructura of apoyo.estructuras) {
          if (!summary[estructura.codigo]) {
            summary[estructura.codigo] = 0;
          }
          summary[estructura.codigo] += estructura.cantidad;
        }
      }
    }

    return summary;
  }
}

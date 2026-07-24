import { Controller, Get, Param } from '@nestjs/common';
import { ConsolidadoService } from './consolidado.service';

interface ConsolidadoQuantities {
  total_apoyos: number;
  total_usuarios: number;
  total_tramos: number;
  total_acsr: number;
  total_perchas: number;
  total_templetes_bt: number;
  total_tierras_bt: number;
  total_conectores: number;
  total_longitud_ml: number;
  by_nivel_tension: {
    [key: string]: {
      apoyos: number;
      tramos: number;
      longitud_ml: number;
    };
  };
}

@Controller('consolidado')
export class ConsolidadoController {
  constructor(private readonly consolidadoService: ConsolidadoService) {}

  /**
   * Obtiene el consolidado de cantidades para una visita
   */
  @Get(':visita_id')
  async getConsolidado(
    @Param('visita_id') visitaId: string,
  ): Promise<ConsolidadoQuantities> {
    return this.consolidadoService.calculateConsolidado(visitaId);
  }

  /**
   * Obtiene un resumen de estructuras por tipo
   */
  @Get(':visita_id/estructuras')
  async getStructuresSummary(@Param('visita_id') visitaId: string) {
    const summary = await this.consolidadoService.getStructuresSummary(
      visitaId,
    );
    return { visita_id: visitaId, estructuras: summary };
  }
}

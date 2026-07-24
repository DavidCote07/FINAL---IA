import { Controller, Get, Param } from '@nestjs/common';
import { InformeTecnicoService, InformeTotal } from './informe-tecnico.service';

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
  };
  usuarios_beneficiarios: any[];
  apoyos: any[];
  tramos: any[];
  consolidado: any;
  inconsistencias: any[];
}

@Controller('informe-tecnico')
export class InformeTecnicoController {
  constructor(
    private readonly informeTecnicoService: InformeTecnicoService,
  ) {}

  /**
   * Genera el informe total consolidando todas las visitas
   */
  @Get('total')
  async generateInformeTotal(): Promise<InformeTotal> {
    return this.informeTecnicoService.generateInformeTotal();
  }

  /**
   * Genera el informe técnico completo para una visita
   */
  @Get(':visita_id')
  async generateInforme(
    @Param('visita_id') visitaId: string,
  ): Promise<InformeTecnico> {
    return this.informeTecnicoService.generateInforme(visitaId);
  }

  /**
   * Genera solo el resumen ejecutivo
   */
  @Get(':visita_id/resumen')
  async generateResumen(@Param('visita_id') visitaId: string) {
    return this.informeTecnicoService.generateResumen(visitaId);
  }
}

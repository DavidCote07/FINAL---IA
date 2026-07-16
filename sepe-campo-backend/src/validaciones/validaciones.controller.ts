import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ValidacionesService } from './validaciones.service';

@Controller('validaciones')
export class ValidacionesController {
  constructor(private readonly validacionesService: ValidacionesService) {}

  /**
   * Obtiene todas las inconsistencias de una visita
   */
  @Get('inconsistencias')
  async getInconsistencias(@Query('visita_id') visitaId: string) {
    return this.validacionesService.findByVisita(visitaId);
  }

  /**
   * Ejecuta validación en una visita y retorna inconsistencias
   */
  @Post('validar/:visita_id')
  async validar(@Param('visita_id') visitaId: string) {
    const inconsistencias =
      await this.validacionesService.validarVisita(visitaId);
    return {
      visita_id: visitaId,
      total_inconsistencias: inconsistencias.length,
      inconsistencias,
    };
  }

  /**
   * Limpia todas las inconsistencias de una visita
   */
  @Post('limpiar/:visita_id')
  async limpiar(@Param('visita_id') visitaId: string) {
    await this.validacionesService.clearByVisita(visitaId);
    return { message: 'Inconsistencias eliminadas', visita_id: visitaId };
  }
}

import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ExportacionExcelService } from './exportacion-excel.service';

@Controller('exportacion-excel')
export class ExportacionExcelController {
  constructor(
    private readonly exportacionExcelService: ExportacionExcelService,
  ) {}

  /**
   * Genera y descarga el Excel corporativo para una visita
   */
  @Get('descargar/:visita_id')
  async downloadExcel(
    @Param('visita_id') visitaId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.exportacionExcelService.generateExcel(visitaId);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Informe_${visitaId}_${new Date().toISOString().split('T')[0]}.xlsx"`,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.send(buffer);
  }

  /**
   * Guarda el Excel en el servidor
   */
  @Get('generar/:visita_id')
  async generateExcel(@Param('visita_id') visitaId: string) {
    const filePath = await this.exportacionExcelService.saveExcelFile(visitaId);
    return {
      message: 'Archivo Excel generado exitosamente',
      file_path: filePath,
    };
  }
}

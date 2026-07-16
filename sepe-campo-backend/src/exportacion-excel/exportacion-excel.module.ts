import { Module } from '@nestjs/common';
import { ExportacionExcelService } from './exportacion-excel.service';
import { ExportacionExcelController } from './exportacion-excel.controller';
import { InformeTecnicoModule } from '../informe-tecnico/informe-tecnico.module';

@Module({
  imports: [InformeTecnicoModule],
  controllers: [ExportacionExcelController],
  providers: [ExportacionExcelService],
})
export class ExportacionExcelModule {}

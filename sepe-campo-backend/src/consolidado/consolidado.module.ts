import { Module } from '@nestjs/common';
import { ConsolidadoService } from './consolidado.service';
import { ConsolidadoController } from './consolidado.controller';
import { ApoyosModule } from '../apoyos/apoyos.module';
import { TramosModule } from '../tramos/tramos.module';
import { UsuariosBeneficiariosModule } from '../usuarios-beneficiarios/usuarios-beneficiarios.module';

@Module({
  imports: [ApoyosModule, TramosModule, UsuariosBeneficiariosModule],
  controllers: [ConsolidadoController],
  providers: [ConsolidadoService],
  exports: [ConsolidadoService],
})
export class ConsolidadoModule {}

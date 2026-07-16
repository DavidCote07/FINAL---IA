import { Module } from '@nestjs/common';
import { InformeTecnicoService } from './informe-tecnico.service';
import { InformeTecnicoController } from './informe-tecnico.controller';
import { VisitasModule } from '../visitas/visitas.module';
import { ApoyosModule } from '../apoyos/apoyos.module';
import { TramosModule } from '../tramos/tramos.module';
import { UsuariosBeneficiariosModule } from '../usuarios-beneficiarios/usuarios-beneficiarios.module';
import { ValidacionesModule } from '../validaciones/validaciones.module';
import { ConsolidadoModule } from '../consolidado/consolidado.module';

@Module({
  imports: [
    VisitasModule,
    ApoyosModule,
    TramosModule,
    UsuariosBeneficiariosModule,
    ValidacionesModule,
    ConsolidadoModule,
  ],
  controllers: [InformeTecnicoController],
  providers: [InformeTecnicoService],
  exports: [InformeTecnicoService],
})
export class InformeTecnicoModule {}

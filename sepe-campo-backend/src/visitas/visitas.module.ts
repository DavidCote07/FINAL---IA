import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitasService } from './visitas.service';
import { VisitasController } from './visitas.controller';
import { Visita } from './entities/visita.entity';
import { ApoyosModule } from '../apoyos/apoyos.module';
import { TramosModule } from '../tramos/tramos.module';
import { UsuariosBeneficiariosModule } from '../usuarios-beneficiarios/usuarios-beneficiarios.module';
import { ValidacionesModule } from '../validaciones/validaciones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Visita]),
    ApoyosModule,
    TramosModule,
    UsuariosBeneficiariosModule,
    ValidacionesModule,
  ],
  controllers: [VisitasController],
  providers: [VisitasService],
  exports: [VisitasService],
})
export class VisitasModule {}

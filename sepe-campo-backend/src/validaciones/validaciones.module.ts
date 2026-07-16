import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidacionesService } from './validaciones.service';
import { ValidacionesController } from './validaciones.controller';
import { Inconsistencia } from './entities/inconsistencia.entity';
import { ApoyosModule } from '../apoyos/apoyos.module';
import { UsuariosBeneficiariosModule } from '../usuarios-beneficiarios/usuarios-beneficiarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inconsistencia]),
    ApoyosModule,
    UsuariosBeneficiariosModule,
  ],
  controllers: [ValidacionesController],
  providers: [ValidacionesService],
  exports: [ValidacionesService],
})
export class ValidacionesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosBeneficiariosService } from './usuarios-beneficiarios.service';
import { UsuariosBeneficiariosController } from './usuarios-beneficiarios.controller';
import { UsuarioBeneficiario } from './entities/usuario-beneficiario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioBeneficiario])],
  controllers: [UsuariosBeneficiariosController],
  providers: [UsuariosBeneficiariosService],
  exports: [UsuariosBeneficiariosService],
})
export class UsuariosBeneficiariosModule {}

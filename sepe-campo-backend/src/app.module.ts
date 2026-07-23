import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisitasModule } from './visitas/visitas.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosBeneficiariosModule } from './usuarios-beneficiarios/usuarios-beneficiarios.module';
import { ApoyosModule } from './apoyos/apoyos.module';
import { TramosModule } from './tramos/tramos.module';
import { ValidacionesModule } from './validaciones/validaciones.module';
import { ConsolidadoModule } from './consolidado/consolidado.module';
import { InformeTecnicoModule } from './informe-tecnico/informe-tecnico.module';
import { ExportacionExcelModule } from './exportacion-excel/exportacion-excel.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    VisitasModule,
    UsuariosBeneficiariosModule,
    ApoyosModule,
    TramosModule,
    ValidacionesModule,
    ConsolidadoModule,
    InformeTecnicoModule,
    ExportacionExcelModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApoyosService } from './apoyos.service';
import { ApoyosController } from './apoyos.controller';
import { Apoyo } from './entities/apoyo.entity';
import { EstructuraApoyo } from './entities/estructura-apoyo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Apoyo, EstructuraApoyo])],
  controllers: [ApoyosController],
  providers: [ApoyosService],
  exports: [ApoyosService],
})
export class ApoyosModule {}

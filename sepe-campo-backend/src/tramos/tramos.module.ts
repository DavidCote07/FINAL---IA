import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TramosService } from './tramos.service';
import { TramosController } from './tramos.controller';
import { Tramo } from './entities/tramo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tramo])],
  controllers: [TramosController],
  providers: [TramosService],
  exports: [TramosService],
})
export class TramosModule {}

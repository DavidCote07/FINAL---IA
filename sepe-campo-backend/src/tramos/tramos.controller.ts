import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TramosService } from './tramos.service';
import { CreateTramoDto } from './dto/create-tramo.dto';
import { UpdateTramoDto } from './dto/update-tramo.dto';

@Controller('tramos')
export class TramosController {
  constructor(private readonly tramosService: TramosService) {}

  @Post()
  async create(@Body() createTramoDto: CreateTramoDto) {
    return this.tramosService.create(createTramoDto);
  }

  @Get()
  async findAll(@Query('visita_id') visitaId: string) {
    return this.tramosService.findAll(visitaId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tramosService.findOne(id);
  }

  @Get(':visita_id/acsr-total')
  async getTotalACsr(@Param('visita_id') visitaId: string) {
    const total = await this.tramosService.calculateTotalACsr(visitaId);
    return { visita_id: visitaId, total_acsr: total };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTramoDto: UpdateTramoDto,
  ) {
    return this.tramosService.update(id, updateTramoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.tramosService.remove(id);
    return { message: 'Tramo eliminado correctamente' };
  }
}

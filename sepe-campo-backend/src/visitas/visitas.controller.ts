import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VisitasService } from './visitas.service';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';

@Controller('visitas')
export class VisitasController {
  constructor(private readonly visitasService: VisitasService) {}

  @Post()
  async create(@Body() createVisitaDto: CreateVisitaDto) {
    return this.visitasService.create(createVisitaDto);
  }

  @Get()
  async findAll(@Query('tecnico_id') tecnicoId?: string) {
    return this.visitasService.findAll(tecnicoId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.visitasService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVisitaDto: UpdateVisitaDto,
  ) {
    return this.visitasService.update(id, updateVisitaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.visitasService.remove(id);
    return { message: 'Visita eliminada correctamente' };
  }
}

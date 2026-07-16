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
import { ApoyosService } from './apoyos.service';
import { CreateApoyoDto } from './dto/create-apoyo.dto';
import { UpdateApoyoDto } from './dto/update-apoyo.dto';

@Controller('apoyos')
export class ApoyosController {
  constructor(private readonly apoyosService: ApoyosService) {}

  @Post()
  async create(@Body() createApoyoDto: CreateApoyoDto) {
    return this.apoyosService.create(createApoyoDto);
  }

  @Get()
  async findAll(@Query('visita_id') visitaId: string) {
    return this.apoyosService.findAll(visitaId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.apoyosService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApoyoDto: UpdateApoyoDto,
  ) {
    return this.apoyosService.update(id, updateApoyoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.apoyosService.remove(id);
    return { message: 'Apoyo eliminado correctamente' };
  }
}

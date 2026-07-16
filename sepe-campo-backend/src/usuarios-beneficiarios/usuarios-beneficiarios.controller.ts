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
import { UsuariosBeneficiariosService } from './usuarios-beneficiarios.service';
import { CreateUsuarioBeneficiarioDto } from './dto/create-usuario-beneficiario.dto';
import { UpdateUsuarioBeneficiarioDto } from './dto/update-usuario-beneficiario.dto';

@Controller('usuarios-beneficiarios')
export class UsuariosBeneficiariosController {
  constructor(
    private readonly usuariosService: UsuariosBeneficiariosService,
  ) {}

  @Post()
  async create(@Body() createUsuarioBeneficiarioDto: CreateUsuarioBeneficiarioDto) {
    return this.usuariosService.create(createUsuarioBeneficiarioDto);
  }

  @Get()
  async findAll(@Query('visita_id') visitaId: string) {
    return this.usuariosService.findAll(visitaId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioBeneficiarioDto: UpdateUsuarioBeneficiarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioBeneficiarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usuariosService.remove(id);
    return { message: 'Usuario beneficiario eliminado correctamente' };
  }
}

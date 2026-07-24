import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioBeneficiario } from './entities/usuario-beneficiario.entity';
import { CreateUsuarioBeneficiarioDto } from './dto/create-usuario-beneficiario.dto';
import { UpdateUsuarioBeneficiarioDto } from './dto/update-usuario-beneficiario.dto';

@Injectable()
export class UsuariosBeneficiariosService {
  constructor(
    @InjectRepository(UsuarioBeneficiario)
    private usuariosRepository: Repository<UsuarioBeneficiario>,
  ) {}

  async create(
    createUsuarioBeneficiarioDto: CreateUsuarioBeneficiarioDto,
  ): Promise<UsuarioBeneficiario> {
    const usuario = this.usuariosRepository.create(
      createUsuarioBeneficiarioDto,
    );
    return this.usuariosRepository.save(usuario);
  }

  async findAll(visitaId?: string): Promise<UsuarioBeneficiario[]> {
    const where = visitaId ? { visita_id: visitaId } : {};
    return this.usuariosRepository.find({
      where,
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<UsuarioBeneficiario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario beneficiario ${id} no encontrado`);
    }

    return usuario;
  }

  async update(
    id: string,
    updateUsuarioBeneficiarioDto: UpdateUsuarioBeneficiarioDto,
  ): Promise<UsuarioBeneficiario> {
    await this.findOne(id); // Valida que existe
    await this.usuariosRepository.update(id, updateUsuarioBeneficiarioDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuariosRepository.remove(usuario);
  }

  async removeByVisita(visitaId: string): Promise<void> {
    await this.usuariosRepository.delete({ visita_id: visitaId });
  }
}

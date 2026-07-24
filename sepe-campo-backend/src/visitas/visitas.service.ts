import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visita } from './entities/visita.entity';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { ApoyosService } from '../apoyos/apoyos.service';
import { TramosService } from '../tramos/tramos.service';
import { UsuariosBeneficiariosService } from '../usuarios-beneficiarios/usuarios-beneficiarios.service';
import { ValidacionesService } from '../validaciones/validaciones.service';

@Injectable()
export class VisitasService {
  constructor(
    @InjectRepository(Visita)
    private visitasRepository: Repository<Visita>,
    private apoyosService: ApoyosService,
    private tramosService: TramosService,
    private usuariosService: UsuariosBeneficiariosService,
    private validacionesService: ValidacionesService,
  ) {}

  async create(createVisitaDto: CreateVisitaDto): Promise<Visita> {
    const visita = this.visitasRepository.create(createVisitaDto);
    return this.visitasRepository.save(visita);
  }

  async findAll(tecnicoId?: string): Promise<Visita[]> {
    if (tecnicoId) {
      return this.visitasRepository.find({
        where: { tecnico_id: tecnicoId },
        order: { fecha: 'DESC' },
      });
    }
    return this.visitasRepository.find({
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Visita> {
    const visita = await this.visitasRepository.findOne({
      where: { id },
    });

    if (!visita) {
      throw new NotFoundException(`Visita ${id} no encontrada`);
    }

    return visita;
  }

  async update(id: string, updateVisitaDto: UpdateVisitaDto): Promise<Visita> {
    await this.findOne(id); // Valida que existe
    await this.visitasRepository.update(id, updateVisitaDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const visita = await this.findOne(id);

    // Elimina primero todo lo que depende de la visita para no violar
    // las llaves foráneas (inconsistencias -> tramos/usuarios -> apoyos -> visita)
    await this.validacionesService.clearByVisita(id);
    await this.tramosService.removeByVisita(id);
    await this.usuariosService.removeByVisita(id);
    await this.apoyosService.removeByVisita(id);

    await this.visitasRepository.remove(visita);
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tramo } from './entities/tramo.entity';
import { CreateTramoDto } from './dto/create-tramo.dto';
import { UpdateTramoDto } from './dto/update-tramo.dto';

@Injectable()
export class TramosService {
  constructor(
    @InjectRepository(Tramo)
    private tramosRepository: Repository<Tramo>,
  ) {}

  async create(createTramoDto: CreateTramoDto): Promise<Tramo> {
    // Validar que apoyo origen sea diferente a apoyo destino
    if (createTramoDto.apoyo_origen_id === createTramoDto.apoyo_destino_id) {
      throw new BadRequestException(
        'El apoyo de origen no puede ser igual al apoyo de destino',
      );
    }

    // Validar que la longitud sea >= 0
    if (createTramoDto.longitud_ml < 0) {
      throw new BadRequestException('La longitud debe ser mayor o igual a cero');
    }

    const tramo = this.tramosRepository.create(createTramoDto);
    return this.tramosRepository.save(tramo);
  }

  async findAll(visitaId?: string): Promise<Tramo[]> {
    const where = visitaId ? { visita_id: visitaId } : {};
    return this.tramosRepository.find({
      where,
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Tramo> {
    const tramo = await this.tramosRepository.findOne({
      where: { id },
    });

    if (!tramo) {
      throw new NotFoundException(`Tramo ${id} no encontrado`);
    }

    return tramo;
  }

  async update(id: string, updateTramoDto: UpdateTramoDto): Promise<Tramo> {
    // Validaciones
    if (
      updateTramoDto.apoyo_origen_id &&
      updateTramoDto.apoyo_destino_id &&
      updateTramoDto.apoyo_origen_id === updateTramoDto.apoyo_destino_id
    ) {
      throw new BadRequestException(
        'El apoyo de origen no puede ser igual al apoyo de destino',
      );
    }

    if (
      updateTramoDto.longitud_ml !== undefined &&
      updateTramoDto.longitud_ml < 0
    ) {
      throw new BadRequestException('La longitud debe ser mayor o igual a cero');
    }

    await this.findOne(id); // Valida que existe
    await this.tramosRepository.update(id, updateTramoDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const tramo = await this.findOne(id);
    await this.tramosRepository.remove(tramo);
  }

  async removeByVisita(visitaId: string): Promise<void> {
    await this.tramosRepository.delete({ visita_id: visitaId });
  }

  /**
   * Calcula el total de replanteo (metros) para una visita
   * Total = suma de metros de cable dúplex + triplex de todos los tramos
   */
  async calculateTotalACsr(visitaId: string): Promise<number> {
    const tramos = await this.findAll(visitaId);
    return tramos.reduce((sum, tramo) => sum + Number(tramo.longitud_ml), 0);
  }
}

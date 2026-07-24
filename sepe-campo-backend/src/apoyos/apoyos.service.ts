import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apoyo } from './entities/apoyo.entity';
import { EstructuraApoyo } from './entities/estructura-apoyo.entity';
import { CreateApoyoDto } from './dto/create-apoyo.dto';
import { UpdateApoyoDto } from './dto/update-apoyo.dto';

@Injectable()
export class ApoyosService {
  constructor(
    @InjectRepository(Apoyo)
    private apoyosRepository: Repository<Apoyo>,
    @InjectRepository(EstructuraApoyo)
    private estructurasRepository: Repository<EstructuraApoyo>,
  ) {}

  async create(createApoyoDto: CreateApoyoDto): Promise<Apoyo> {
    // Validar que las cantidades sean >= 0
    this.validateQuantities(createApoyoDto);

    const { estructuras, ...apoyoData } = createApoyoDto;

    const numero = await this.nextNumero(createApoyoDto.visita_id);
    const apoyo = this.apoyosRepository.create({ ...apoyoData, numero });

    // Si hay estructuras, agregarlas
    if (estructuras && estructuras.length > 0) {
      apoyo.estructuras = estructuras.map((est) =>
        this.estructurasRepository.create(est),
      );
    }

    return this.apoyosRepository.save(apoyo);
  }

  async findAll(visitaId?: string): Promise<Apoyo[]> {
    const where = visitaId ? { visita_id: visitaId } : {};
    return this.apoyosRepository.find({
      where,
      order: { numero: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Apoyo> {
    const apoyo = await this.apoyosRepository.findOne({
      where: { id },
    });

    if (!apoyo) {
      throw new NotFoundException(`Apoyo ${id} no encontrado`);
    }

    return apoyo;
  }

  async update(id: string, updateApoyoDto: UpdateApoyoDto): Promise<Apoyo> {
    // Validar que las cantidades sean >= 0
    this.validateQuantities(updateApoyoDto);

    await this.findOne(id); // Valida que existe

    const { estructuras, ...apoyoData } = updateApoyoDto;

    // Actualizar datos del apoyo
    await this.apoyosRepository.update(id, apoyoData);

    // Si se envían estructuras, reemplazarlas
    if (estructuras) {
      // Eliminar estructuras existentes
      await this.estructurasRepository.delete({ apoyo_id: id });

      // Crear nuevas estructuras
      if (estructuras.length > 0) {
        const newEstructuras = estructuras.map((est) =>
          this.estructurasRepository.create({
            ...est,
            apoyo_id: id,
          }),
        );
        await this.estructurasRepository.save(newEstructuras);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const apoyo = await this.findOne(id);
    await this.apoyosRepository.remove(apoyo);
  }

  async removeByVisita(visitaId: string): Promise<void> {
    await this.apoyosRepository.delete({ visita_id: visitaId });
  }

  private async nextNumero(visitaId: string): Promise<number> {
    const result = await this.apoyosRepository
      .createQueryBuilder('apoyo')
      .select('MAX(apoyo.numero)', 'max')
      .where('apoyo.visita_id = :visitaId', { visitaId })
      .getRawOne<{ max: number | null }>();

    return Number(result?.max ?? 0) + 1;
  }

  private validateQuantities(dto: CreateApoyoDto | UpdateApoyoDto): void {
    const quantities = {
      perchas: dto.perchas,
      templetes_bt: dto.templetes_bt,
      tierras_bt: dto.tierras_bt,
      conectores: dto.conectores,
    };

    for (const [field, value] of Object.entries(quantities)) {
      if (value !== undefined && value !== null) {
        if (!Number.isInteger(value) || value < 0) {
          throw new BadRequestException(
            `${field} debe ser un número entero mayor o igual a cero`,
          );
        }
      }
    }

    if (dto.estructuras) {
      for (const estructura of dto.estructuras) {
        if (!Number.isInteger(estructura.cantidad) || estructura.cantidad < 0) {
          throw new BadRequestException(
            'Cantidad de estructura debe ser un número entero >= 0',
          );
        }
      }
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';

@Injectable()
export class VisitasService {
  create(createVisitaDto: CreateVisitaDto) {
    return 'This action adds a new visita';
  }

  findAll() {
    return `This action returns all visitas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} visita`;
  }

  update(id: number, updateVisitaDto: UpdateVisitaDto) {
    return `This action updates a #${id} visita`;
  }

  remove(id: number) {
    return `This action removes a #${id} visita`;
  }
}

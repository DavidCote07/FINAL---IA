import { PartialType } from '@nestjs/mapped-types';
import { CreateEstructuraApoyoDto } from './create-estructura-apoyo.dto';

export class UpdateEstructuraApoyoDto extends PartialType(
  CreateEstructuraApoyoDto,
) {}

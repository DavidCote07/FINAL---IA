import { PartialType } from '@nestjs/mapped-types';
import { CreateApoyoDto } from './create-apoyo.dto';

export class UpdateApoyoDto extends PartialType(CreateApoyoDto) {}

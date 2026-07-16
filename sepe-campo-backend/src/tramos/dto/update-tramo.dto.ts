import { PartialType } from '@nestjs/mapped-types';
import { CreateTramoDto } from './create-tramo.dto';

export class UpdateTramoDto extends PartialType(CreateTramoDto) {}

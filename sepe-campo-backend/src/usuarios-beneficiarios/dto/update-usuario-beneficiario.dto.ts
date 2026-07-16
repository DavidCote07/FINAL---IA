import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioBeneficiarioDto } from './create-usuario-beneficiario.dto';

export class UpdateUsuarioBeneficiarioDto extends PartialType(
  CreateUsuarioBeneficiarioDto,
) {}

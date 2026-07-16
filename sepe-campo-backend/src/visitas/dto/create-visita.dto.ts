import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateVisitaDto {
  @IsString()
  @IsNotEmpty()
  contrato: string;

  @IsString()
  @IsNotEmpty()
  vereda: string;

  @IsString()
  @IsNotEmpty()
  municipio: string;

  @IsString()
  @IsNotEmpty()
  tecnico_id: string;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;
}

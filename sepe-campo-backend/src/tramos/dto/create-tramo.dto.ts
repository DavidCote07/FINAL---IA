import { IsNotEmpty, IsNumber, Min, IsString, IsOptional, IsIn } from 'class-validator';

export class CreateTramoDto {
  @IsNotEmpty()
  visita_id: string;

  @IsNotEmpty()
  apoyo_origen_id: string;

  @IsNotEmpty()
  apoyo_destino_id: string;

  @IsString()
  @IsNotEmpty()
  nivel_tension: string;

  @IsString()
  @IsIn(['DUPLEX', 'TRIPLEX'])
  tipo_cable: string;

  @IsNumber()
  @Min(0)
  longitud_ml: number;

  @IsString()
  @IsOptional()
  observaciones?: string;
}

import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, Min, IsNotEmpty } from 'class-validator';
import { CreateEstructuraApoyoDto } from './create-estructura-apoyo.dto';

export class CreateApoyoDto {
  @IsNotEmpty()
  visita_id: string;

  @IsString()
  @IsNotEmpty()
  nivel_tension: string;

  @IsString()
  @IsOptional()
  tipo_poste?: string;

  @IsString()
  @IsOptional()
  codigo?: string;

  @IsBoolean()
  @IsOptional()
  poste_nuevo?: boolean = true;

  @IsNumber()
  @Min(0)
  @IsOptional()
  perchas?: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  templetes_bt?: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  tierras_bt?: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  conectores?: number = 0;

  @IsOptional()
  @Type(() => Number)
  coord_x?: number;

  @IsOptional()
  @Type(() => Number)
  coord_y?: number;

  @IsOptional()
  @Type(() => Number)
  coord_z?: number;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsOptional()
  @Type(() => CreateEstructuraApoyoDto)
  estructuras?: CreateEstructuraApoyoDto[];
}

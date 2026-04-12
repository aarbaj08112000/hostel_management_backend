import {
  IsString,
  IsInt,
  IsOptional,
  IsJSON,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class LookupDTO {
  @IsInt()
  @IsNotEmpty()
  entity_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  entity_name: string;

  @IsOptional()
  @IsJSON()
  entity_json?: object;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}

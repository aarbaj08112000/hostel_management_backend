import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ArrayMinSize,
  IsInt,
  IsDateString,
  IsDate,
} from 'class-validator';

export class ActivityLogAddDto {
  @IsString()
  @IsNotEmpty()
  activity_code: string;

  @IsString()
  @IsOptional()
  value_json: string;

  @IsString()
  @IsNotEmpty()
  module_code: string;

  @IsString()
  @IsOptional()
  request_id: number;

  @IsString()
  @IsOptional()
  added_by: number;
}

export class ActivityLogUploadDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Date must be a valid date' })
  date: Date;
}
export class ActivityLogListDto {
  @IsOptional()
  @IsArray({ message: 'module_code must be an array' })
  @ArrayMinSize(1, { message: 'At least one Module must be provided.' })
  @IsString({ each: true, message: 'module name must be a string' })
  module_code: string;

  @IsString()
  @IsOptional()
  request_id: number;

  @IsString()
  @IsOptional()
  car_id: number;

  @IsInt()
  @IsOptional()
  page: number;

  @IsInt()
  @IsOptional()
  limit: number;

  @IsArray()
  @IsOptional()
  sort: any;

  @IsArray()
  @IsOptional()
  filters: any;

  @IsString()
  @IsOptional()
  keyword: string;
}

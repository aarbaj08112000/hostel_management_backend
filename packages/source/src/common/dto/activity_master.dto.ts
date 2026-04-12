import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import * as custom from '@repo/source/utilities/custom-helper';
export class ActivityMasterAddDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  template?: string;

  @IsOptional()
  params?: any;

  @IsIn(['User', 'Brand', 'Color', 'Car', 'Bank'])
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  added_by: string;

  @IsIn(['Active', 'Inactive'])
  @IsNotEmpty()
  status: string;
}
export class ActivityMasterUpdateDto extends PartialType(ActivityMasterAddDto) {
  @IsString()
  @IsNotEmpty({
    message: () =>
      custom.lang('Please enter a value for the activity master id field.'),
  })
  id: string;

  @IsString()
  @IsOptional()
  updated_by: string;
}

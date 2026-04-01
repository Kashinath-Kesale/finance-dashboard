/* eslint-disable prettier/prettier */
import {IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min,} from 'class-validator';
import { RecordType } from '@prisma/client';

export class UpdateRecordDto {
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsEnum(RecordType)
  type?: RecordType;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
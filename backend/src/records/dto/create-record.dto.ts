/* eslint-disable prettier/prettier */
import {IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { RecordType } from '@prisma/client';

export class CreateRecordDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(RecordType)
  type: RecordType;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
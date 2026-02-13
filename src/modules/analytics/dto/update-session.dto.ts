import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class InteractionDto {
  @IsString()
  type: string;

  @IsString()
  target: string;

  @IsDateString()
  timestamp: string;

  @IsOptional()
  metadata?: any;
}

export class UpdateSessionDto {
  @IsString()
  sessionId: string;

  @IsDateString()
  exitTime: string;

  @IsNumber()
  @Min(0)
  duration: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  scrollDepth: number;

  @IsArray()
  @IsString({ each: true })
  sectionsViewed: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InteractionDto)
  @IsOptional()
  interactions?: InteractionDto[];
}

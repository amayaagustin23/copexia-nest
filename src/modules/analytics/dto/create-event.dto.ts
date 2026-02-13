import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  sessionId: string;

  @IsString()
  eventType: string;

  @IsOptional()
  eventData?: any;

  @IsDateString()
  timestamp: string;

  @IsString()
  page: string;
}

import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class DeviceInfoDto {
  @IsString()
  type: string;

  @IsString()
  browser: string;

  @IsString()
  os: string;
}

class ScreenInfoDto {
  @IsString()
  resolution: string;

  @IsString()
  viewport: string;
}

export class CreateVisitDto {
  @IsString()
  sessionId: string;

  @IsString()
  page: string;

  @IsString()
  @IsOptional()
  referrer?: string;

  @IsString()
  userAgent: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo: DeviceInfoDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ScreenInfoDto)
  screenInfo: ScreenInfoDto;

  @IsString()
  language: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LikePostDto {
  @ApiProperty({ description: 'IP del usuario', required: false })
  @IsOptional()
  @IsString()
  userIp?: string;

  @ApiProperty({ description: 'User Agent del navegador', required: false })
  @IsOptional()
  @IsString()
  userAgent?: string;
}

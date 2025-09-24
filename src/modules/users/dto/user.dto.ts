import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@gmail.com',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.validations.isNotEmpty'),
  })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('errors.validations.isEmail'),
    },
  )
  email: string;

  @ApiProperty({
    description: 'Contraseña',
    example: 'Pass1234',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.validations.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('errors.validations.isString'),
  })
  @MinLength(8, {
    message: i18nValidationMessage('errors.validations.minLength'),
  })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d).{8,}$/, {
    message: i18nValidationMessage('errors.validations.isPassword'),
  })
  password: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.validations.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('errors.validations.isString'),
  })
  name: string;

  @ApiProperty({
    enum: Role,
    example: Role.ADMIN,
    required: false,
    default: Role.ADMIN,
  })
  @IsOptional()
  @IsEnum(Role, {
    message: i18nValidationMessage('errors.validations.isEnum'),
  })
  role?: Role;
}

export class RecoverPasswordDto {
  @ApiProperty({
    description: 'User email',
    example: 'joe@gmail.com',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.validations.isNotEmpty'),
  })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('errors.validations.isEmail'),
    },
  )
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'User password',
    example: 'Pass1234',
  })
  @IsString({
    message: i18nValidationMessage('errors.validations.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.validations.isNotEmpty'),
  })
  @MinLength(8)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d).{8,}$/, {
    message: i18nValidationMessage('errors.validations.isPassword'),
  })
  password: string;

  @ApiProperty({
    description: 'User password confirmation',
    example: 'Pass1234',
  })
  @IsString({
    message: i18nValidationMessage('errors.validations.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.validations.isNotEmpty'),
  })
  @MinLength(8)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d).{8,}$/, {
    message: i18nValidationMessage('errors.validations.isPassword'),
  })
  confirmPassword: string;
}

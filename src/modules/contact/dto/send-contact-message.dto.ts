import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SendContactMessageDto {
  @IsNotEmpty({ message: 'El nombre completo es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  fullName: string;

  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  email: string;

  @IsNotEmpty({ message: 'El asunto es requerido' })
  @IsString({ message: 'El asunto debe ser una cadena de texto' })
  @MinLength(5, { message: 'El asunto debe tener al menos 5 caracteres' })
  @MaxLength(200, { message: 'El asunto no puede exceder los 200 caracteres' })
  subject: string;

  @IsNotEmpty({ message: 'El mensaje es requerido' })
  @IsString({ message: 'El mensaje debe ser una cadena de texto' })
  @MinLength(10, { message: 'El mensaje debe tener al menos 10 caracteres' })
  @MaxLength(2000, {
    message: 'El mensaje no puede exceder los 2000 caracteres',
  })
  message: string;
}

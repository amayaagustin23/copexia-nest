import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { SendContactMessageDto } from './dto/send-contact-message.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('send-message')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar mensaje de contacto',
    description:
      'Envía un mensaje desde el formulario de contacto público al equipo de Copexia',
  })
  @ApiResponse({
    status: 200,
    description: 'Mensaje enviado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Mensaje enviado exitosamente' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos del formulario inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['El nombre completo es requerido'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async sendContactMessage(@Body() contactData: SendContactMessageDto) {
    const success = await this.contactService.sendContactMessage(contactData);

    if (success) {
      return {
        success: true,
        message: 'Mensaje enviado exitosamente. Te responderemos pronto.',
      };
    } else {
      return {
        success: false,
        message:
          'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.',
      };
    }
  }
}

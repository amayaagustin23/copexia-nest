import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../services/email/email.service';
import { PrismaService } from '../../services/prisma/prisma.service';
import { SendContactMessageDto } from './dto/send-contact-message.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async sendContactMessage(contactData: SendContactMessageDto): Promise<boolean> {
    const admin = await this.prisma.user.findFirst({
      where: {
        role: 'ADMIN',
      },
    });
    if (!admin) {
        throw new Error('No se encontró el administrador');
    }
    return await this.emailService.sendContactMessage(
      contactData.fullName,
      contactData.email,
      contactData.subject,
      contactData.message,
      admin.email,
    );
  }

}

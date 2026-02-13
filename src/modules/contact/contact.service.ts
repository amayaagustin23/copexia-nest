import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagingService } from '../../services/messaging/messaging.service';
import { PrismaService } from '../../services/prisma/prisma.service';
import { SendContactMessageDto } from './dto/send-contact-message.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly messagingService: MessagingService,
  ) {}

  async sendContactMessage(
    contactData: SendContactMessageDto,
  ): Promise<boolean> {
    // Logic to find admin email if needed, or rely on default
    // Assuming logic exists to get admin email or pass undefined
    // For now, passing necessary args
    return await this.messagingService.sendContactMessage(
      contactData.fullName,
      contactData.email,
      contactData.subject,
      contactData.message,
      // admin email optional
    );
  }
}

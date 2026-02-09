import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../../services/email/email.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

import { MessagingModule } from '../../services/messaging/messaging.module';

@Module({
  imports: [ConfigModule, EmailModule, PrismaModule, MessagingModule],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule { }

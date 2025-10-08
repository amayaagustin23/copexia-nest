import { Module, Provider } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { MessagingService } from './messaging.service';
import { EMAIL_PROVIDER } from './messaging.types';
import { MailjetService } from './providers/mailjet.service';

const mailServiceProvider: Provider = {
  provide: EMAIL_PROVIDER,
  useClass: MailjetService,
};

@Module({
  providers: [mailServiceProvider, MessagingService, EmailService],
  exports: [MessagingService],
})
export class MessagingModule {}

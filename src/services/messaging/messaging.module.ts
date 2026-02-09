import { Module, Provider } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { MessagingService } from './messaging.service';
import { EMAIL_PROVIDER } from './messaging.types';
import { SmtpService } from './providers/smtp.service';

const mailServiceProvider: Provider = {
  provide: EMAIL_PROVIDER,
  useClass: SmtpService,
};

@Module({
  providers: [mailServiceProvider, MessagingService, EmailService],
  exports: [MessagingService],
})
export class MessagingModule { }

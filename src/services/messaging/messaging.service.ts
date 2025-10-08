import { Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { EmailService as StyledEmailService } from '../email/email.service';
import { EMAIL_PROVIDER, EmailService } from './messaging.types';

@Injectable()
export class MessagingService {
  constructor(
    @Inject(EMAIL_PROVIDER) private readonly emailService: EmailService,
    private readonly i18n: I18nService,
    private readonly styledEmailService: StyledEmailService,
  ) {}

  async sendRegisterUserEmail(input: {
    from: string;
    to: string;
    redirectUrl: string;
  }) {
    const { from, to, redirectUrl } = input;
    const subject = this.i18n.t('emails.newPassword.subject');
    const lang = 'es'; // Default to Spanish, can be enhanced later with proper i18n context
    const body = this.styledEmailService.generateNewPasswordTemplate(
      redirectUrl,
      lang,
    );

    await this.emailService.send({
      from,
      to,
      subject,
      body,
    });
  }

  async sendResetPasswordEmail(input: { from: string; to: string }) {
    const { from, to } = input;
    const subject = this.i18n.t('emails.resetPassword.subject');
    const lang = 'es'; // Default to Spanish, can be enhanced later with proper i18n context
    const body = this.styledEmailService.generatePasswordChangedTemplate(lang);

    await this.emailService.send({
      from,
      to,
      subject,
      body,
    });
  }

  async sendRecoverPasswordEmail(input: {
    from: string;
    to: string;
    redirectUrl: string;
  }) {
    const { from, to, redirectUrl } = input;
    const subject = this.i18n.t('emails.recoverPassword.subject');
    const lang = 'es'; // Default to Spanish, can be enhanced later with proper i18n context
    const body = this.styledEmailService.generateRecoverPasswordTemplate(
      redirectUrl,
      lang,
    );

    await this.emailService.send({
      from,
      to,
      subject,
      body,
    });
  }
}

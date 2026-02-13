import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { EmailService as StyledEmailService } from '../email/email.service';
import { EMAIL_PROVIDER, EmailService } from './messaging.types';

@Injectable()
export class MessagingService {
  constructor(
    @Inject(EMAIL_PROVIDER) private readonly emailService: EmailService,
    private readonly i18n: I18nService,
    private readonly styledEmailService: StyledEmailService,
    private readonly configService: ConfigService,
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

  async sendCommentNotification(input: {
    postTitle: string;
    slug: string;
    commentAuthor: string;
    commentContent: string;
    from?: string;
    to?: string;
  }) {
    const {
      postTitle,
      slug,
      commentAuthor,
      commentContent,
      from = this.configService.get('EMAIL_SENDER'),
      to = this.configService.get('ADMIN_EMAIL'),
    } = input;

    const subject = `Nuevo comentario: ${postTitle}`;
    const body = this.styledEmailService.generateCommentNotificationTemplate(
      postTitle,
      slug,
      commentAuthor,
      commentContent,
    );

    await this.emailService.send({
      from,
      to,
      subject,
      body,
    });
  }

  async sendViewMilestoneNotification(
    postTitle: string,
    slug: string,
    viewCount: number,
    adminEmail?: string,
  ) {
    const email = adminEmail || this.configService.get('ADMIN_EMAIL');
    const subject = `🎉 ¡Hito alcanzado! Post "${postTitle}" llegó a ${viewCount} visualizaciones`;
    const body = this.styledEmailService.generateViewMilestoneTemplate(
      postTitle,
      slug,
      viewCount,
    );
    const textPart = `¡Felicitaciones! El post "${postTitle}" ha alcanzado ${viewCount} visualizaciones.`;

    await this.emailService.send({
      to: email,
      subject,
      body,
      text: textPart,
    });
  }

  async sendContactMessage(
    fullName: string,
    email: string,
    subject: string,
    message: string,
    adminEmail?: string,
  ): Promise<boolean> {
    const toEmail = adminEmail || this.configService.get('ADMIN_EMAIL');
    const emailSubject = `[Formulario de Contacto] ${subject}`;
    const body = this.styledEmailService.generateContactMessageTemplate(
      fullName,
      email,
      subject,
      message,
    );
    const textPart = this.styledEmailService.generateContactMessageText(
      fullName,
      email,
      subject,
      message,
    );

    try {
      await this.emailService.send({
        to: toEmail,
        subject: emailSubject,
        body,
        text: textPart,
        replyTo: { name: fullName, email },
      });
      return true;
    } catch (error) {
      console.error('Failed to send contact message:', error);
      return false;
    }
  }
}

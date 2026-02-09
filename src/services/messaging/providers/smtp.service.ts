import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Email, EmailService } from '../messaging.types';

@Injectable()
export class SmtpService implements EmailService {
    private readonly logger = new Logger(SmtpService.name);
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.initializeTransporter();
    }

    private initializeTransporter() {
        const host = this.configService.get<string>('SMTP_HOST');
        const port = this.configService.get<number>('SMTP_PORT');
        const user = this.configService.get<string>('SMTP_USER');
        const pass = this.configService.get<string>('SMTP_PASSWORD');

        if (!host || !port || !user || !pass) {
            this.logger.error('SMTP configuration missing: check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD');
            return;
        }

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465, // true for 465, false for other ports (usually 587 which uses STARTTLS)
            auth: {
                user,
                pass,
            },
        });
    }

    async send(input: Email): Promise<void> {
        if (!this.transporter) {
            this.initializeTransporter();
            if (!this.transporter) {
                this.logger.error('Cannot send email: Transporter not initialized due to missing config.');
                return;
            }
        }

        const { from, to, subject, body, text, replyTo } = input;
        const defaultSender = this.configService.get<string>('EMAIL_SENDER');

        try {
            await this.transporter.sendMail({
                from: from || defaultSender,
                to,
                subject,
                html: body,
                text,
                replyTo: typeof replyTo === 'object' ? `"${replyTo.name}" <${replyTo.email}>` : replyTo,
            });
            this.logger.log(`Email sent successfully to ${to}`);
        } catch (error) {
            this.logger.error(`Error sending email to ${to}: ${error.message}`, error.stack);
            throw error;
        }
    }
}

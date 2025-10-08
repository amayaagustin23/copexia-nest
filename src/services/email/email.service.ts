import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendCommentNotification(
    postTitle: string,
    slug: string,
    commentAuthor: string,
    commentContent: string,
    adminEmail: string = 'amayaagustin.2395@gmail.com',
  ) {

    try {
      const mailjetApiKey = this.configService.get<string>('MAILJET_API_KEY');
      const mailjetSecretKey = this.configService.get<string>('MAILJET_SECRET_KEY');
      const senderEmail = this.configService.get<string>('EMAIL_SENDER');

      if (!mailjetApiKey || !mailjetSecretKey || !senderEmail) {
        this.logger.error('Mailjet credentials not configured');
        return false;
      }

      // Importar Mailjet dinámicamente
      const mailjet = require('node-mailjet').apiConnect(mailjetApiKey, mailjetSecretKey);

      const emailData = {
        Messages: [
          {
            From: {
              Email: senderEmail,
              Name: 'Copexia Admin',
            },
            To: [
              {
                Email: adminEmail,
                Name: 'Administrador',
              },
            ],
            Subject: `Nuevo comentario en: ${postTitle}`,
            HTMLPart: this.generateCommentNotificationTemplate(
              postTitle,
              slug,
              commentAuthor,
              commentContent,
            ),
            TextPart: `Nuevo comentario en el post "${postTitle}" por ${commentAuthor}: ${commentContent}`,
          },
        ],
      };

      const result = await mailjet.post('send', { version: 'v3.1' }).request(emailData);
      
      this.logger.log(`Email notification sent successfully to ${adminEmail}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to send email notification:', error);
      return false;
    }
  }

  private generateBaseTemplate(
    title: string,
    icon: string,
    content: string,
    actions?: string,
    lang: string = 'es'
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - Copexia</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #e3e8f0;
            background: radial-gradient(1200px 600px at 95% -10%, rgba(223, 205, 129, 0.07), transparent 60%), 
                        radial-gradient(900px 520px at 0% 110%, rgba(183, 150, 83, 0.06), transparent 55%), 
                        #0f1c2e;
            min-height: 100vh;
            padding: 20px;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #182335;
            border-radius: 0.625rem;
            border: 1px solid rgba(255, 255, 255, 0.14);
            box-shadow: 0 10px 30px rgba(15, 28, 46, 0.3);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #dfcd81 0%, #b79653 45%, #ac7400 100%);
            padding: 30px 25px;
            text-align: center;
            position: relative;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
            pointer-events: none;
          }
          
          .header h1 {
            color: #0a0a0a;
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            position: relative;
            z-index: 1;
          }
          
          .header .icon {
            font-size: 32px;
            margin-bottom: 10px;
            display: block;
          }
          
          .content {
            padding: 30px 25px;
            background: #182335;
          }
          
          .content p {
            margin-bottom: 20px;
            color: #d7deea;
            font-size: 16px;
          }
          
          .highlight-box {
            background: #1a2436;
            border: 1px solid rgba(255, 255, 255, 0.14);
            border-radius: 0.625rem;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #dfcd81;
            position: relative;
          }
          
          .highlight-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0));
            border-radius: 0.625rem;
            pointer-events: none;
          }
          
          .highlight-content {
            color: #e3e8f0;
            font-size: 15px;
            line-height: 1.7;
            position: relative;
            z-index: 1;
          }
          
          .actions {
            margin-top: 30px;
            text-align: center;
          }
          
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #dfcd81 0%, #b79653 45%, #ac7400 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 0.625rem;
            font-weight: 600;
            font-size: 14px;
            margin: 0 10px 10px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(223, 205, 129, 0.3);
            position: relative;
            overflow: hidden;
          }
          
          .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }
          
          .btn:hover::before {
            left: 100%;
          }
          
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(223, 205, 129, 0.4);
            color: #ffffff !important;
          }
          
          .btn-secondary {
            background: #1a2436;
            color: #dfcd81;
            border: 1px solid #dfcd81;
            box-shadow: 0 4px 15px rgba(26, 36, 54, 0.3);
          }
          
          .btn-secondary:hover {
            background: #dfcd81;
            color: #0a0a0a;
            box-shadow: 0 6px 20px rgba(223, 205, 129, 0.4);
          }
          
          .footer {
            background: #1a2436;
            padding: 20px 25px;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.14);
            font-size: 12px;
            color: #b79653;
          }
          
          .footer p {
            margin: 5px 0;
            color: #b79653;
          }
          
          .logo {
            font-size: 18px;
            font-weight: 700;
            background: linear-gradient(135deg, #dfcd81 0%, #b79653 45%, #ac7400 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
          }
          
          @media (max-width: 600px) {
            body {
              padding: 10px;
            }
            
            .container {
              margin: 0;
              border-radius: 0;
            }
            
            .content, .header, .footer {
              padding: 20px 15px;
            }
            
            .btn {
              display: block;
              margin: 10px 0;
              text-align: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="icon">${icon}</span>
            <h1>${title}</h1>
          </div>
          
          <div class="content">
            ${content}
            ${actions ? `<div class="actions">${actions}</div>` : ''}
          </div>
          
          <div class="footer">
            <div class="logo">Copexia</div>
            <p>Este es un email automático del sistema.</p>
            <p>Si no deseas recibir estas notificaciones, contacta al administrador.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateCommentNotificationTemplate(
    postTitle: string,
    slug: string,
    commentAuthor: string,
    commentContent: string,
  ): string {
    const baseUrl = this.configService.get<string>('BACKOFFICE_BASE_URL');
    
    const content = `
      <p>Se ha recibido un nuevo comentario en tu plataforma Copexia:</p>
      
      <div class="highlight-box">
        <div class="highlight-content">
          <strong style="color: #dfcd81;">📝 ${postTitle}</strong><br><br>
          <strong style="color: #dfcd81;">👤 ${commentAuthor}</strong><br>
          💬 ${commentContent}
        </div>
      </div>
      
      <p>Gestiona este comentario desde el panel de administración:</p>
    `;
    
    const actions = `<a href="${baseUrl}/posts/${slug}" class="btn btn-secondary">Ver Post</a>`;
    
    return this.generateBaseTemplate('Nuevo Comentario', '🔔', content, actions);
  }

  // Métodos para templates de contraseña con estilo consistente
  generateRecoverPasswordTemplate(redirectUrl: string, lang: string = 'es'): string {
    const isSpanish = lang === 'es';
    const title = isSpanish ? 'Recuperar Contraseña' : 'Recover Password';
    const icon = '🔐';
    
    const content = isSpanish 
      ? `
        <p>Has solicitado recuperar tu contraseña en Copexia.</p>
        
        <div class="highlight-box">
          <div class="highlight-content">
            <strong style="color: #dfcd81;">🔑 Recuperación de Contraseña</strong><br><br>
            Haz clic en el botón de abajo para crear una nueva contraseña. Este enlace es válido por 24 horas.
          </div>
        </div>
        
        <p>Si no solicitaste este cambio, puedes ignorar este email de forma segura.</p>
      `
      : `
        <p>You have requested to recover your password on Copexia.</p>
        
        <div class="highlight-box">
          <div class="highlight-content">
            <strong style="color: #dfcd81;">🔑 Password Recovery</strong><br><br>
            Click the button below to create a new password. This link is valid for 24 hours.
          </div>
        </div>
        
        <p>If you didn't request this change, you can safely ignore this email.</p>
      `;
    
    const buttonText = isSpanish ? 'Recuperar Contraseña' : 'Recover Password';
    const actions = `<a href="${redirectUrl}" class="btn">${buttonText}</a>`;
    
    return this.generateBaseTemplate(title, icon, content, actions, lang);
  }

  generateNewPasswordTemplate(redirectUrl: string, lang: string = 'es'): string {
    const isSpanish = lang === 'es';
    const title = isSpanish ? 'Crear Nueva Contraseña' : 'Create New Password';
    const icon = '🆕';
    
    const content = isSpanish 
      ? `
        <p>Necesitas crear una nueva contraseña para continuar usando tu cuenta en Copexia.</p>
        
        <div class="highlight-box">
          <div class="highlight-content">
            <strong style="color: #dfcd81;">🆕 Nueva Contraseña Requerida</strong><br><br>
            Haz clic en el botón de abajo para configurar tu nueva contraseña. Este enlace es válido por 24 horas.
          </div>
        </div>
        
        <p>Si no solicitaste este cambio, contacta al administrador inmediatamente.</p>
      `
      : `
        <p>You need to create a new password to continue using your account on Copexia.</p>
        
        <div class="highlight-box">
          <div class="highlight-content">
            <strong style="color: #dfcd81;">🆕 New Password Required</strong><br><br>
            Click the button below to set up your new password. This link is valid for 24 hours.
          </div>
        </div>
        
        <p>If you didn't request this change, contact the administrator immediately.</p>
      `;
    
    const buttonText = isSpanish ? 'Crear Nueva Contraseña' : 'Create New Password';
    const actions = `<a href="${redirectUrl}" class="btn">${buttonText}</a>`;
    
    return this.generateBaseTemplate(title, icon, content, actions, lang);
  }

  generatePasswordChangedTemplate(lang: string = 'es'): string {
    const isSpanish = lang === 'es';
    const title = isSpanish ? 'Contraseña Cambiada' : 'Password Changed';
    const icon = '✅';
    
    const content = isSpanish 
      ? `
        <p>Tu contraseña ha sido cambiada exitosamente en Copexia.</p>
        
        <div class="highlight-box">
          <div class="highlight-content">
            <strong style="color: #dfcd81;">✅ Cambio Exitoso</strong><br><br>
            Tu contraseña ha sido actualizada correctamente. Ya puedes usar tu nueva contraseña para acceder a tu cuenta.
          </div>
        </div>
        
        <p>Si no realizaste este cambio, contacta al administrador inmediatamente.</p>
      `
      : `
        <p>Your password has been successfully changed on Copexia.</p>
        
        <div class="highlight-box">
          <div class="highlight-content">
            <strong style="color: #dfcd81;">✅ Change Successful</strong><br><br>
            Your password has been updated correctly. You can now use your new password to access your account.
          </div>
        </div>
        
        <p>If you didn't make this change, contact the administrator immediately.</p>
      `;
    
    return this.generateBaseTemplate(title, icon, content, undefined, lang);
  }

  // Métodos para enviar emails de contraseña directamente
  async sendRecoverPasswordEmail(
    toEmail: string,
    redirectUrl: string,
    lang: string = 'es'
  ) {
    try {
      const mailjetApiKey = this.configService.get<string>('MAILJET_API_KEY');
      const mailjetSecretKey = this.configService.get<string>('MAILJET_SECRET_KEY');
      const senderEmail = this.configService.get<string>('EMAIL_SENDER');

      if (!mailjetApiKey || !mailjetSecretKey || !senderEmail) {
        this.logger.error('Mailjet credentials not configured');
        return false;
      }

      const mailjet = require('node-mailjet').apiConnect(mailjetApiKey, mailjetSecretKey);
      const isSpanish = lang === 'es';
      const subject = isSpanish ? 'Recuperar Contraseña - Copexia' : 'Recover Password - Copexia';

      const emailData = {
        Messages: [
          {
            From: {
              Email: senderEmail,
              Name: 'Copexia',
            },
            To: [
              {
                Email: toEmail,
                Name: 'Usuario',
              },
            ],
            Subject: subject,
            HTMLPart: this.generateRecoverPasswordTemplate(redirectUrl, lang),
            TextPart: isSpanish 
              ? `Recupera tu contraseña en Copexia: ${redirectUrl}`
              : `Recover your password on Copexia: ${redirectUrl}`,
          },
        ],
      };

      const result = await mailjet.post('send', { version: 'v3.1' }).request(emailData);
      this.logger.log(`Recover password email sent successfully to ${toEmail}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to send recover password email:', error);
      return false;
    }
  }

  async sendNewPasswordEmail(
    toEmail: string,
    redirectUrl: string,
    lang: string = 'es'
  ) {
    try {
      const mailjetApiKey = this.configService.get<string>('MAILJET_API_KEY');
      const mailjetSecretKey = this.configService.get<string>('MAILJET_SECRET_KEY');
      const senderEmail = this.configService.get<string>('EMAIL_SENDER');

      if (!mailjetApiKey || !mailjetSecretKey || !senderEmail) {
        this.logger.error('Mailjet credentials not configured');
        return false;
      }

      const mailjet = require('node-mailjet').apiConnect(mailjetApiKey, mailjetSecretKey);
      const isSpanish = lang === 'es';
      const subject = isSpanish ? 'Crear Nueva Contraseña - Copexia' : 'Create New Password - Copexia';

      const emailData = {
        Messages: [
          {
            From: {
              Email: senderEmail,
              Name: 'Copexia',
            },
            To: [
              {
                Email: toEmail,
                Name: 'Usuario',
              },
            ],
            Subject: subject,
            HTMLPart: this.generateNewPasswordTemplate(redirectUrl, lang),
            TextPart: isSpanish 
              ? `Crea una nueva contraseña en Copexia: ${redirectUrl}`
              : `Create a new password on Copexia: ${redirectUrl}`,
          },
        ],
      };

      const result = await mailjet.post('send', { version: 'v3.1' }).request(emailData);
      this.logger.log(`New password email sent successfully to ${toEmail}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to send new password email:', error);
      return false;
    }
  }

  async sendPasswordChangedEmail(
    toEmail: string,
    lang: string = 'es'
  ) {
    try {
      const mailjetApiKey = this.configService.get<string>('MAILJET_API_KEY');
      const mailjetSecretKey = this.configService.get<string>('MAILJET_SECRET_KEY');
      const senderEmail = this.configService.get<string>('EMAIL_SENDER');

      if (!mailjetApiKey || !mailjetSecretKey || !senderEmail) {
        this.logger.error('Mailjet credentials not configured');
        return false;
      }

      const mailjet = require('node-mailjet').apiConnect(mailjetApiKey, mailjetSecretKey);
      const isSpanish = lang === 'es';
      const subject = isSpanish ? 'Contraseña Cambiada - Copexia' : 'Password Changed - Copexia';

      const emailData = {
        Messages: [
          {
            From: {
              Email: senderEmail,
              Name: 'Copexia',
            },
            To: [
              {
                Email: toEmail,
                Name: 'Usuario',
              },
            ],
            Subject: subject,
            HTMLPart: this.generatePasswordChangedTemplate(lang),
            TextPart: isSpanish 
              ? 'Tu contraseña ha sido cambiada exitosamente en Copexia.'
              : 'Your password has been successfully changed on Copexia.',
          },
        ],
      };

      const result = await mailjet.post('send', { version: 'v3.1' }).request(emailData);
      this.logger.log(`Password changed email sent successfully to ${toEmail}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to send password changed email:', error);
      return false;
    }
  }

  // Método para enviar notificación de visualizaciones
  async sendViewMilestoneNotification(
    postTitle: string,
    slug: string,
    viewCount: number,
    adminEmail: string = 'amayaagustin.2395@gmail.com',
  ) {
    try {
      const mailjetApiKey = this.configService.get<string>('MAILJET_API_KEY');
      const mailjetSecretKey = this.configService.get<string>('MAILJET_SECRET_KEY');
      const senderEmail = this.configService.get<string>('EMAIL_SENDER');

      if (!mailjetApiKey || !mailjetSecretKey || !senderEmail) {
        this.logger.error('Mailjet credentials not configured');
        return false;
      }

      // Importar Mailjet dinámicamente
      const mailjet = require('node-mailjet').apiConnect(mailjetApiKey, mailjetSecretKey);

      const emailData = {
        Messages: [
          {
            From: {
              Email: senderEmail,
              Name: 'Copexia Admin',
            },
            To: [
              {
                Email: adminEmail,
                Name: 'Administrador',
              },
            ],
            Subject: `🎉 ¡Hito alcanzado! Post "${postTitle}" llegó a ${viewCount} visualizaciones`,
            HTMLPart: this.generateViewMilestoneTemplate(
              postTitle,
              slug,
              viewCount,
            ),
            TextPart: `¡Felicitaciones! El post "${postTitle}" ha alcanzado ${viewCount} visualizaciones.`,
          },
        ],
      };

      const result = await mailjet.post('send', { version: 'v3.1' }).request(emailData);
      
      this.logger.log(`View milestone notification sent successfully to ${adminEmail} for ${viewCount} views`);
      return true;
    } catch (error) {
      this.logger.error('Failed to send view milestone notification:', error);
      return false;
    }
  }

  private generateViewMilestoneTemplate(
    postTitle: string,
    slug: string,
    viewCount: number,
  ): string {
    const baseUrl = this.configService.get<string>('BACKOFFICE_BASE_URL');
    
    // Determinar el tipo de hito y el emoji
    let milestoneType = '';
    let emoji = '';
    let message = '';
    
    if (viewCount >= 1000) {
      milestoneType = 'GRAN HITO';
      emoji = '🏆';
      message = `¡Increíble! Este post ha superado las ${viewCount} visualizaciones. Es un contenido de gran impacto.`;
    } else if (viewCount >= 100) {
      milestoneType = 'HITO IMPORTANTE';
      emoji = '🎯';
      message = `¡Excelente! Este post ha alcanzado ${viewCount} visualizaciones. Está generando mucho interés.`;
    }
    
    const content = `
      <p>¡Felicitaciones! Uno de tus posts ha alcanzado un hito importante:</p>
      
      <div class="highlight-box">
        <div class="highlight-content">
          <strong style="color: #dfcd81;">${emoji} ${milestoneType}</strong><br><br>
          <strong style="color: #dfcd81;">📝 ${postTitle}</strong><br>
          <strong style="color: #dfcd81;">👀 ${viewCount} visualizaciones</strong><br><br>
          ${message}
        </div>
      </div>
      
      <p>Este es un gran momento para celebrar el éxito de tu contenido. ¡Sigue creando contenido de calidad!</p>
    `;
    
    const actions = `<a href="${baseUrl}/posts/${slug}" class="btn btn-secondary">Ver Post</a>`;
    
    return this.generateBaseTemplate('Hito de Visualizaciones', '🎉', content, actions);
  }
}

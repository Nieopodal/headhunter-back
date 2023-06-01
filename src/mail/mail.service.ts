import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { StudentService } from '../student/student.service';
import { SendMailInfo } from '@Types';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @Inject(forwardRef(() => StudentService)) private studentService: StudentService,
    private configService: ConfigService,
  ) {}

  async generateUrl(data, actionType): Promise<string> {
    const { id, role, verificationToken } = data;
    const appUrl = this.configService.get('APP_URL');
    return `${appUrl}/auth/${actionType}/${role.toLowerCase()}/confirm/${id}/${verificationToken}`;
  }

  async sendMail(to: string, subject: string, html: string): Promise<SendMailInfo> {
    return this.mailerService.sendMail({
      to,
      subject,
      html,
    });
  }

  async sendEmailsToUsers(
    mailService,
    users,
    subject: string,
    emailTemplateFunction: (activationUrl: string) => string,
  ): Promise<void> {
    for (const user of users) {
      const emailTemplate = emailTemplateFunction(user.activationUrl);
      try {
        await mailService.sendMail(user.email, subject, emailTemplate);
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error.message);
      }
    }
  }

  async testConnection(): Promise<boolean> {
    const transportOptions = {
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USERNAME'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    };

    const transporter = nodemailer.createTransport(transportOptions);
    try {
      await transporter.verify();
      return true;
    } catch (error) {
      console.error('Error while testing connection to Nodemailer:', error);
      return false;
    }
  }
}

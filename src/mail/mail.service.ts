import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { StudentService } from '../student/student.service';
import {SendMailInfo, UserRole} from '@Types';
import {UserRegistrationTemplate} from "../templates/email/user-registration";

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private studentService: StudentService,
    private configService: ConfigService,
  ) {}

  async generateUrl(data): Promise<string> {
    const { id, role, verificationToken } = data;
    const appUrl = this.configService.get('APP_URL');
    return `${appUrl}/${role}/confirm/${id}/${verificationToken}`;
  }

  async sendMail(to: string, subject: string, html: string): Promise<SendMailInfo> {
    return this.mailerService.sendMail({
      to,
      subject,
      html,
    });
  }

  async sendEmailsToUsers(mailService, users, role: UserRole) {
    for (const user of users) {
      const emailTemplate = UserRegistrationTemplate(user.activationUrl, role);
      try {
        await mailService.sendMail(user.email, 'Potwierdzenie rejestracji', emailTemplate);
        console.log(`Email sent to ${user.email}`);
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

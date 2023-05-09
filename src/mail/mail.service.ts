import {Injectable} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {ConfigService} from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import { StudentService } from '../student/student.service';

interface SendMailInfo {
    to: string;
    subject: string;
    html: string;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService, private readonly studentService: StudentService) {}

  async generateUrl(email): Promise<string> {
    const { id, verificationToken } = await this.studentService.getStudentByEmail(email);
    return `http://localhost:3000/student/confirm/${id}/${verificationToken}`;
  }

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        ) {}

    async sendMail(
        to: string,
        from: string,
        subject: string,
        html: string
    ): Promise<SendMailInfo> {
        return this.mailerService.sendMail({
            to,
            from,
            subject,
            html,
        });
    };

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

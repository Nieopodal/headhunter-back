import {Injectable} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {ConfigService} from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import { StudentService } from '../student/student.service';
import {SendMailInfo} from "../types/mail";
import {studentRegistrationTemplate} from "../templates/email/student-registration";



@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly studentService: StudentService,
        private readonly configService: ConfigService,
    ) {};

    async generateUrl(email): Promise<string> {
        const {id, verificationToken} = await this.studentService.getStudentByEmail(email);
        const appUrl = this.configService.get('APP_URL');
        return `${appUrl}/student/confirm/${id}/${verificationToken}`;
    };

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

    async sendVerificationEmail(to: string, generateUrl: string): Promise<SendMailInfo> {
        const from = this.configService.get('MAIL_FROM');
        const subject = 'Potwierdzenie rejestracji studenta';
        const html = studentRegistrationTemplate(generateUrl);

        return this.sendMail(to, from, subject, html);
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

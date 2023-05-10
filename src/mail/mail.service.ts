import {Injectable} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {ConfigService} from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import { StudentService } from '../student/student.service';
import {SendMailInfo} from "../types/mail";

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
        subject: string,
        html: string
    ): Promise<SendMailInfo> {
        return this.mailerService.sendMail({
            to,
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
    };
}

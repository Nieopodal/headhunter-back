import {Injectable} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";


interface SendMailInfo {
    to: string;
    subject: string;
    html: string;
}

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService) {
    }

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
}
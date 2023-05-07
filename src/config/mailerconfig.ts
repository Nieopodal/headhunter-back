import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptionsFactory, MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerConfiguration implements MailerOptionsFactory {
    constructor(private configService: ConfigService) {}

    createMailerOptions(): MailerOptions | Promise<MailerOptions> {
        return {
            transport: {
                host: this.configService.get('EMAIL_HOST'),
                port: parseInt(this.configService.get('EMAIL_PORT')),
                secure: this.configService.get('EMAIL_SECURE') === 'true',
                auth: {
                    user: this.configService.get('EMAIL_USERNAME'),
                    pass: this.configService.get('EMAIL_PASSWORD'),
                },
            },
            defaults: {
                from: this.configService.get('EMAIL_FROM'),
            },
            template: {
                dir: './templates/email',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        };
    }
}
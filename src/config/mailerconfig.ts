import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptionsFactory, MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {configMailer} from "./config";

@Injectable()
export class MailerConfiguration implements MailerOptionsFactory {
    constructor(private configService: ConfigService) {}

    createMailerOptions(): MailerOptions | Promise<MailerOptions> {
        return {
            transport: {
                host: configMailer.emailHost,
                port: configMailer.emailPort,
                secure: configMailer.emailSecure,
                auth: {
                    user: configMailer.emailUserName,
                    pass: configMailer.emailPass,
                },
            },
            defaults: {
                from: configMailer.emailFrom,
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
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptionsFactory, MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {configNodemailer} from "./config";

@Injectable()
export class MailerConfiguration implements MailerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return {
      transport: {
        host: configNodemailer.mailHost,
        port: configNodemailer.mailPort,
        secure: configNodemailer.mailSecure,
        auth: {
          user: configNodemailer.mailUserName,
          pass: configNodemailer.mailPass,
        },
      },
      defaults: {
        from: configNodemailer.mailFrom,
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

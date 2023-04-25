import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

 const mailConfig =
    {
        transport: process.env.SMTP_CONNECTION_STRING,
        defaults: {
            from: 'admin@test.example.com',
        },
        template: {
            dir: './templates/email',
            adapter: new HandlebarsAdapter(),
            options: {
                strict: true,
            },
        }
    };

export {mailConfig}
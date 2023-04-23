import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export = {
    transport: this.configService.get('SMTP_CONNECTION_STRING'),
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

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

export default (configService: ConfigService) => ({
    transport: {
        host: configService.get('EMAIL_HOST'),
        port: parseInt(configService.get('EMAIL_PORT')),
        secure: configService.get('EMAIL_SECURE') === 'true',
        auth: {
            user: configService.get('EMAIL_USERNAME'),
            pass: configService.get('EMAIL_PASSWORD'),
        },
    },
    defaults: {
        from: configService.get('EMAIL_FROM'),
    },
    template: {
        dir: './templates/email',
        adapter: new HandlebarsAdapter(),
        options: {
            strict: true,
        },
    },
});
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

export default (mailerConfigService: ConfigService) => {
    const getEnv = (key: string) => mailerConfigService.get(key);

    return {
        transport: `smtp://${getEnv('EMAIL_USERNAME')}:${getEnv('EMAIL_PASSWORD')}@${getEnv('EMAIL_HOST')}:${getEnv('EMAIL_PORT')}`,
        defaults: {
            from: getEnv('EMAIL_FROM'),
        },
        template: {
            dir: './templates/email',
            adapter: new HandlebarsAdapter(),
            options: {
                strict: true,
            },
        },
    };
};
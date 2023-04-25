import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mailerConfig from 'src/config/mailerconfig';
import { MailService } from './mail.service';


@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: mailerConfig,
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}

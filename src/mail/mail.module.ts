import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import {MailerConfiguration} from "../config/mailerconfig";
import { MailService } from './mail.service';
import {MailController} from "./mail.controller";


@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useClass: MailerConfiguration,
        }),
    ],
    providers: [MailService],
    exports: [MailService],
    controllers: [MailController],
})
export class MailModule {}

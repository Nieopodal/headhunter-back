import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import mailerconfig from 'src/config/mailerconfig';
import { MailService } from './mail.service';



@Module({
    imports: [
        MailerModule.forRoot(mailerconfig),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
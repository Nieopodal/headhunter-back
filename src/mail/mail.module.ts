// import { Module } from '@nestjs/common';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { ConfigModule } from '@nestjs/config';
// // import {MailerConfiguration} from "../config/mailerconfig";
// import { MailService } from './mail.service';
//
//
// @Module({
//     imports: [
//         MailerModule.forRootAsync({
//             imports: [ConfigModule],
//             useClass: MailerConfiguration,
//         }),
//     ],
//     providers: [MailService],
//     exports: [MailService],
// })
// export class MailModule {}

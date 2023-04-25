// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';
//
// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}
//
//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }

import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MailService } from './mail/mail.service';
import { testMailTemplate } from './templates/email/test-mail';

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly mailService: MailService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send-test-email')
  async sendTestEmail(): Promise<string> {
    const to = 'test@example.com';
    const from = 'admin@test.example.com';
    const subject = 'Test Email - config';
    const url = 'https://example.com';
    const html = testMailTemplate(url);

    try {
      await this.mailService.sendMail(to, from, subject, html);
      return 'Email sent successfully';
    } catch (error) {
      console.error('Error while sending email:', error);
      return 'Failed to send email';
    }
  }

}

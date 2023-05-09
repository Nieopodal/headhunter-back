import { Controller, Get, Param, SetMetadata } from '@nestjs/common';
import { MailService } from './mail.service';

import { ConfigService } from '@nestjs/config';
import { studentRegistrationTemplate } from '../templates/email/student-registration';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService, private readonly configService: ConfigService) {}

  @Get('/test-connection')
  @SetMetadata('isPublic', true)
  async testConnection() {
    const isConnected = await this.mailService.testConnection();

    if (isConnected) {
      return 'Połączenie z Nodemailerem powiodło się.';
    } else {
      return 'Nie udało się nawiązać połączenia z Nodemailerem.';
    }
  }
  @Get('/send-student-registration-email')
  @SetMetadata('isPublic', true)
  async sendStudentRegistrationEmail(@Param('id') id: string, @Param('token') token: string) {
    const from = this.configService.get<string>('EMAIL_FROM');
    const subject = 'Rejestracja studenta';
    const html = studentRegistrationTemplate(this.configService, id, token);
    const to = 'mateusz.wyso94@gmail.com';

    await this.mailService.sendMail(to, from, subject, html);
    return { message: 'E-mail z rejestracją wysłany.' };
  }
}

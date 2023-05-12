import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from '../common/decorators';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Get('/test-connection')
  async testConnection() {
    const isConnected = await this.mailService.testConnection();

    if (isConnected) {
      return 'Połączenie z Nodemailerem powiodło się.';
    } else {
      return 'Nie udało się nawiązać połączenia z Nodemailerem.';
    }
  }
}

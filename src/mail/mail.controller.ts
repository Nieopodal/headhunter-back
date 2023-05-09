import {Controller, Get, Param, SetMetadata} from '@nestjs/common';
import { MailService } from './mail.service';

import { ConfigService } from '@nestjs/config';
import {studentRegistrationTemplate} from "../templates/email/student-registration";

@Controller()
export class MailController {
    constructor(
        private readonly mailService: MailService,
        private readonly configService: ConfigService,
        ) {}

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
}



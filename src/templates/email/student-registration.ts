import striptags from 'striptags';
import { ConfigService } from '@nestjs/config';

export function studentRegistrationTemplate(configService: ConfigService, id: string, token: string) {
  const appUrl = configService.get<string>('APP_URL');
  const expiresIn = configService.get<string>('EXPIRESIN_IN_RT');
  const registerUrl = `${appUrl}/student/confirm/${id}/${token}`;

  return `
    <h1>Witaj</h1>
    <p>Kliknij w link <a href="${striptags(registerUrl)}">here</a> aby dokończyć rejestrację.</p>
    <p>Link ważny przez: ${expiresIn}.</p>
    <p>Pozdrawiamy,</p>
    <p>Support MegaK</p>
  `;
}

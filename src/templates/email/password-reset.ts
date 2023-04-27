import striptags from 'striptags';
import { ConfigService } from '@nestjs/config';

export function passwordResetTemplate(configService: ConfigService, id: string, token: string) {
    const appUrl = configService.get<string>('APP_URL');
    const expiresIn = configService.get<string>('EXPIRES_IN_RT');
    const passwordResetUrl = `${appUrl}/reset-password/${id}/${token}`;

    return `
    <h1>Resetowanie hasła</h1>
    <p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.</p>
    <p>Kliknij w link <a href="${striptags(passwordResetUrl)}">tutaj</a> aby zresetować hasło.</p>
    <p>Link ważny przez: ${expiresIn}.</p>
    <p>Jeśli to nie Ty prosiłeś o resetowanie hasła, zignoruj tę wiadomość.</p>
  `;
}
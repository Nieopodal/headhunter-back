import { UserRole } from '@Types';

export function UserRegistrationTemplate(generateUrl: string, role: UserRole) {
  const greeting = role === UserRole.STUDENT ? 'Witaj, Kursancie!' : 'Witaj, Rekruterze!';
  return `
    <h1>${greeting}</h1>
    <p>Kliknij w link <a href="${generateUrl}">tutaj</a> aby dokończyć rejestrację.</p>

    <p>Pozdrawiamy,</p>
    <p>Support MegaK</p>
  `;
}

import striptags from 'striptags';

export function studentRegistrationTemplate(generateUrl: string) {
    return `
    <h1>Witaj</h1>
    <p>Kliknij w link <a href="${striptags(generateUrl)}">here</a> aby dokończyć rejestrację.</p>

    <p>Pozdrawiamy,</p>
    <p>Support MegaK</p>
  `;
}
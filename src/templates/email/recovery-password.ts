export function RecoveryPasswordTemplate(generateUrl: string) {

  return `
    <h1>Zmiana hasła</h1>
    <p>Kliknij w link <a href="${generateUrl}">tutaj</a> aby zresetować hasło.</p>

    <p>Pozdrawiamy,</p>
    <p>Support MegaK</p>
  `;
}


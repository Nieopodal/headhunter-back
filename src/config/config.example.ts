export const configDb = {
    dbHost: 'localhost',
    dbUser: 'root',
    dbPassword: '',
    dbDatabase: 'twoja_db',
};

export const configToken = {
    secretKeyAt: 'at',
    secretKeyRt: 'rt',
    secretKeyMt: 'mt',
    expiresInAt: '15s',
    expiresInRt: '7d',
    expiresInMt: '15s',
};

export const configCookie ={
    httpOnly: true,
    domain: 'twoj_host',
    secure: true,
}

export const configNodemailer = {
    mailHost: '',
    mailPort: 111,
    mailSecure: false,
    mailUserName: '',
    mailPass: '',
    mailFrom: '',
}
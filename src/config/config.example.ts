export const configDb = {
    dbHost: 'localhost',
    dbUser: 'root',
    dbPassword: '',
    dbDatabase: 'twoja_db',
};

export const configToken = {
    secretKeyAt: 'at',
    secretKeyRt: 'rt',
    expiresInAt: '15s',
    expiresInRt: '7d',
};

export const configCookie ={
    httpOnly: true,
    domain: 'twoj_host',
    secure: true,
}
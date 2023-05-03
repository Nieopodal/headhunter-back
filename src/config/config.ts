import {Admin} from "../admin/entity/admin.entity";
import {Hr} from "../hr/entity/hr.entity";
import {Student} from "../student/entity/student.entity";

export const configDb = {
    dbHost: 'localhost',
    dbUser: 'root',
    dbPassword: '',
    dbDatabase: 'megak_hh',
    dbEntities: [Admin, Hr, Student],
    corsOrigin: 'http://localhost:3001',
};

export const configToken = {
    secretKeyAt: 'at-secret',
    secretKeyRt: 'rt-secret',
    expiresInAt: '900000',
    expiresInRt: '604800000',
};
export const configMailer = {
    emailUserName: 'admin123',
    emailPass: 'admin456',
    emailHost: 'localhost',
    emailPort: 2500,
    emailFrom: 'admin@test.example.com',
    emailSecure: false,
};
export const APP_URL = 'http://localhost:3000';

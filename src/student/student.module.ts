import {forwardRef, Module} from '@nestjs/common';
import {StudentService} from './student.service';
import {StudentController} from './student.controller';
import {AuthModule} from '../auth/auth.module';

import {HrModule} from '../hr/hr.module';
import {MailService} from "../mail/mail.service";

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => HrModule),
    ],
    controllers: [StudentController],
    providers: [
        StudentService,
        MailService,
    ],
    exports: [StudentService],
})
export class StudentModule {
}

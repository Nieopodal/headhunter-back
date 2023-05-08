import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { StudentService } from '../student/student.service';

interface SendMailInfo {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService, private readonly studentService: StudentService) {}

  async generateUrl(email): Promise<string> {
    const { id, verificationToken } = await this.studentService.getStudentByEmail(email);
    return `http://localhost:3000/student/confirm/${id}/${verificationToken}`;
  }

  async sendMail(to: string, from: string, subject: string, html: string): Promise<SendMailInfo> {
    return this.mailerService.sendMail({
      to,
      from,
      subject,
      html,
    });
  }
}

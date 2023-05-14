import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Hr } from './entity/hr.entity';
import {ApiResponse, CreateResponse, UpdateResponse, UserRole} from '@Types';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import {UserRegistrationTemplate} from "../templates/email/user-registration";

@Injectable()
export class HrService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    private mailService: MailService,
  ) {}

  async getHrByEmail(email: string): Promise<Hr> {
    return await Hr.findOneBy({ email });
  }

  async getHrById(id: string): Promise<Hr> {
    return await Hr.findOneBy({ id });
  }

  async get(): Promise<Hr[]> {
    return await Hr.find();
  }

  async createHr(formData): Promise<ApiResponse<CreateResponse>> {
    if (await this.getHrByEmail(formData.email))
      throw new HttpException(
          {
            isSuccess: false,
            error: `Użytkownik o emailu ${formData.email} już istnieje`,
          },
          HttpStatus.BAD_REQUEST,
      );
    const hr = new Hr();
    hr.email = formData.email;
    hr.fullName = formData.fullName;
    hr.company = formData.company;
    hr.maxReservedStudents = formData.maxReservedStudents;
    hr.verificationToken = await this.authService.generateVerifyToken(formData.email);
    await hr.save();
    hr.activationUrl = await this.mailService.generateUrl(hr);
    await hr.save();

    this.mailService.sendEmailsToUsers(
        this.mailService,
        [hr],
        'Potwierdzenie rejestracji',
        (activationUrl) => UserRegistrationTemplate(activationUrl, UserRole.HR)
    )
        .catch((error) => {
      console.error('Failed to send email to HR:', error.message);
    });

    return {
      isSuccess: true,
      payload: { id: hr.id },
    };
  }

  async setPasswordHr(data): Promise<ApiResponse<UpdateResponse>> {
    try {
      await Hr.createQueryBuilder('hr').update(Hr).set(data.password).where('id=:id', { id: data.id }).execute();
      return {
        isSuccess: true,
        payload: { id: data.id },
      };
    } catch {
      return { isSuccess: false, error: 'Ups... coś poszło nie tak.' };
    }
  }
}

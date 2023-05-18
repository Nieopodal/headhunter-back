import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserRegistrationTemplate } from '../templates/email/user-registration';
import { Hr } from './entity/hr.entity';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import { ApiResponse, CreateResponse, UpdateResponse, UserRole } from '@Types';

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
      throw new HttpException(`Użytkownik o emailu ${formData.email} już istnieje`, HttpStatus.BAD_REQUEST);
    try {
      const hr = new Hr();
      hr.email = formData.email;
      hr.fullName = formData.fullName;
      hr.company = formData.company;
      hr.maxReservedStudents = formData.maxReservedStudents;
      await hr.save();
      hr.verificationToken = await this.authService.hashData(
        await this.authService.generateEmailToken(hr.id, hr.email),
      );
      await hr.save();
      hr.activationUrl = await this.mailService.generateUrl(hr);
      await hr.save();
      this.mailService
        .sendEmailsToUsers(this.mailService, [hr], 'Potwierdzenie rejestracji', (activationUrl) =>
          UserRegistrationTemplate(activationUrl, UserRole.HR),
        )
        .catch((error) => {
          console.error('Failed to send email to HR:', error.message);
        });
      return {
        isSuccess: true,
        payload: { id: hr.id },
      };
    } catch (e) {
      throw new HttpException('Dodanie użytkownika nie powiodło się. Spróbuj ponownie później', HttpStatus.BAD_REQUEST);
    }
  }

  async setPasswordHr(id, data): Promise<ApiResponse<UpdateResponse>> {
    const user = await this.getHrById(id);
    if (!user || !data.password)
      throw new HttpException('Zmiana hasła nie powiodła się. Spróbuj ponownie później', HttpStatus.BAD_REQUEST);

    user.password = await this.authService.hashData(data.password);
    await user.save();
    return {
      isSuccess: true,
      payload: { id: user.id },
    };
  }
}

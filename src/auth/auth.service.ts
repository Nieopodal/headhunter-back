import { ForbiddenException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoginUserDto } from './dto';
import { AdminService } from '../admin/admin.service';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  ApiResponse,
  CheckUserResponse,
  ConfirmResponse,
  RecoveryPasswordResponse,
  Tokens,
  UpdateResponse,
  UserDataResponse,
} from '@Types';
import { HrService } from '../hr/hr.service';
import { MailService } from '../mail/mail.service';
import { RecoveryPasswordTemplate } from '../templates/email/recovery-password';
import { PasswordChangedTemplate } from '../templates/email/password-change';
import { Admin } from '../admin/entity/admin.entity';
import { Student } from '../student/entity/student.entity';
import { Hr } from '../hr/entity/hr.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private adminService: AdminService,
    private studentService: StudentService,
    private hrService: HrService,
    private mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async hashData(data: string): Promise<string> {
    const hashedData = await bcrypt.hash(data, 10);
    if (!hashedData.includes('/')) {
      return hashedData;
    } else {
      return await this.hashData(data);
    }
  }

  async compareHashedData(plainText: string, hashedText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashedText);
  }

  async updateRtHash(id, rt: string): Promise<void> {
    const user = await this.checkUserById(id);
    user.refreshToken = await this.hashData(rt);
    await user.save();
  }

  async generateEmailToken(id, email): Promise<string> {
    return await this.jwtService.signAsync(
      { id, email },
      {
        secret: this.configService.get('SECRET_KEY_MT'),
        expiresIn: this.configService.get('EXPIRES_IN_MT'),
      },
    );
  }

  async getTokens(id: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { id, email },
        {
          secret: this.configService.get('SECRET_KEY_AT'),
          expiresIn: this.configService.get('EXPIRES_IN_AT'),
        },
      ),
      this.jwtService.signAsync(
        { id, email },
        {
          secret: this.configService.get('SECRET_KEY_RT'),
          expiresIn: this.configService.get('EXPIRES_IN_RT'),
        },
      ),
    ]);
    return { access_token: at, refresh_token: rt };
  }

  async getDecodedToken(rt: string) {
    return this.jwtService.decode(rt);
  }

  async checkUserByEmail(email: string): Promise<CheckUserResponse> {
    const admin = await this.adminService.getAdminByEmail(email);

    const hr = await this.hrService.getHrByEmail(email);

    const student = await this.studentService.getStudentByEmail(email);

    return hr ? hr : student ? student : admin ? admin : null;
  }

  async checkUserById(id: string): Promise<CheckUserResponse> {
    const admin = await this.adminService.getUserById(id);

    const hr = await this.hrService.getHrById(id);

    const student = await this.studentService.getStudentById(id);

    return admin ? admin : student ? student : hr ? hr : null;
  }

  async getUserData(user): Promise<UserDataResponse> {
    const obj = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    if (user instanceof Admin) {
      return {
        ...obj,
        name: user.name,
      };
    }
    if (user instanceof Hr) {
      return {
        ...obj,
        fullName: user.fullName,
      };
    }
    if (user instanceof Student) {
      return {
        ...obj,
        firstName: user.firstName,
        lastName: user.lastName,
        githubUsername: user.githubUsername,
      };
    }
  }

  async login(login: LoginUserDto, response: Response): Promise<ApiResponse<UserDataResponse>> {
    const user = await this.checkUserByEmail(login.email);
    if (!user) return { isSuccess: false, error: 'Nie znaleziono użytkownika' };
    const passwordMatches = await this.compareHashedData(login.password, user.password);
    if (!passwordMatches) return { isSuccess: false, error: 'Niepoprawne hasło' };
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    response.cookie('jwt-refresh', tokens.refresh_token, { httpOnly: true });
    try {
      return {
        isSuccess: true,
        payload: { ...(await this.getUserData(user)), access_token: tokens.access_token },
      };
    } catch (e) {
      return { isSuccess: false, error: 'Ups... coś poszło nie tak.' };
    }
  }

  async logout(id: string): Promise<ApiResponse<any>> {
    const user = await this.checkUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    } else if (user.refreshToken !== null) {
      await this.cacheManager.del('filter');
      user.refreshToken = null;
      await user.save();
    }
    return {
      isSuccess: true,
      payload: null,
    };
  }

  async confirmFromEmail(param): Promise<ApiResponse<ConfirmResponse>> {
    const user = await this.checkUserById(param.id);
    if (!user || param.token !== user.verificationToken)
      throw new HttpException(
        {
          isSuccess: false,
          error: 'Ups... coś poszło nie tak.',
        },
        HttpStatus.BAD_REQUEST,
      );
    return {
      isSuccess: true,
      payload: { email: user.email, emailToken: await this.generateEmailToken(user.id, user.email) },
    };
  }

  async recoveryPassword(data): Promise<ApiResponse<RecoveryPasswordResponse>> {
    const user = await this.checkUserByEmail(data.email);
    if (!user)
      throw new HttpException(
        {
          isSuccess: false,
          error: `Nie ma takiego adresu email w systemie`,
        },
        HttpStatus.BAD_REQUEST,
      );
    try {
      user.verificationToken = await this.hashData(await this.generateEmailToken(user.id, user.email));
      await user.save();
      user.activationUrl = await this.mailService.generateUrl(user);
      await user.save();

      await this.mailService.sendEmailsToUsers(this.mailService, [user], 'Zmiana hasła', (activationUrl) =>
        RecoveryPasswordTemplate(activationUrl),
      );
    } catch (e) {
      return {
        isSuccess: false,
        error: 'Ups... coś poszło nie tak.',
      };
    }
    return {
      isSuccess: true,
      payload: { sentToEmail: user.email },
    };
  }

  async changePassword(data, id): Promise<ApiResponse<UpdateResponse>> {
    const user = await this.checkUserById(id);
    if (!user)
      throw new HttpException(
        {
          isSuccess: false,
          error: 'Ups... coś poszło nie tak.',
        },
        HttpStatus.BAD_REQUEST,
      );
    try {
      user.password = await this.hashData(data.password);
      await user.save();

      await this.mailService.sendEmailsToUsers(this.mailService, [user], 'Hasło zostało zmienione', () =>
        PasswordChangedTemplate(),
      );
      return {
        isSuccess: true,
        payload: { id: user.id },
      };
    } catch (e) {
      return {
        isSuccess: false,
        error: 'Ups... coś poszło nie tak.',
      };
    }
  }

  async getUserInfo(token: string): Promise<ApiResponse<UserDataResponse>> {
    const decodedJwt = await this.getDecodedToken(token);
    const user = await this.checkUserByEmail(decodedJwt['email']);

    try {
      return {
        isSuccess: true,
        payload: await this.getUserData(user),
      };
    } catch (e) {
      return { isSuccess: false, error: 'Ups... coś poszło nie tak.' };
    }
  }

  async refreshTokens(rt: string, response: Response): Promise<Tokens> {
    const decodedJwt = await this.getDecodedToken(rt);
    const user = await this.checkUserById(decodedJwt['id']);

    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await this.compareHashedData(rt, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    response.cookie('jwt-refresh', tokens.refresh_token, { httpOnly: true });
    return { access_token: tokens.access_token };
  }
}

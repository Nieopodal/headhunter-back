import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LoginUserDto } from './dto';
import { AdminService } from '../admin/admin.service';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, Tokens } from '@Types';
import { HrService } from '../hr/hr.service';
import { UserDataResponse } from '../types/auth/response-data.type';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private studentService: StudentService,
    private hrService: HrService,
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

  async updateRtHash(id, rt: string): Promise<void> {
    const user = await this.checkUserById(id);
    user.refreshToken = await this.hashData(rt);
    await user.save();
  }

  async getVerificationToken(email: string): Promise<string> {
    const { id } = await this.studentService.getStudentByEmail(email);
    const token = await this.jwtService.signAsync(
      { id, email },
      {
        secret: this.configService.get('SECRET_KEY_VT'),
        expiresIn: this.configService.get('EXPIRES_IN_VT'),
      },
    );
    return await this.hashData(token);
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

  async checkUserByEmail(email: string): Promise<UserDataResponse> {
    const admin = await this.adminService.getAdminByEmail(email);

    const hr = await this.hrService.getHrByEmail(email);

    const student = await this.studentService.getStudentByEmail(email);

    return hr ? hr : student ? student : admin ? admin : null;
  }

  async checkUserById(id: string): Promise<any> {
    const admin = await this.adminService.getUserById(id);

    const hr = await this.hrService.getHrById(id);

    const student = await this.studentService.getStudentById(id);

    return admin ? admin : student ? student : hr ? hr : null;
  }

  async login(login: LoginUserDto, response: Response): Promise<ApiResponse<UserDataResponse>> {
    const user = await this.checkUserByEmail(login.email);
    if (!user) return { isSuccess: false, error: 'Nie znaleziono użytkownika' };
    try {
      const passwordMatches = await bcrypt.compare(login.password, user.password);
      if (!passwordMatches) return { isSuccess: false, error: 'Niepoprawne hasło' };
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      response.cookie('jwt-refresh', tokens.refresh_token, { httpOnly: true });
      return {
        isSuccess: true,
        payload: {
          id: user.id,
          email: user.email,
          role: user.role,
          githubUsername: user.githubUsername,
          name: user.name,
          fullName: user.fullName,
          firstName: user.firstName,
          lastName: user.lastName,
          access_token: tokens.access_token,
        },
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
      user.refreshToken = null;
      await user.save();
    }
    return {
      isSuccess: true,
      payload: null,
    };
  }

  async getUserInfo(rt: string): Promise<ApiResponse<UserDataResponse>> {
    const decodedJwt = await this.getDecodedToken(rt);
    const user = await this.checkUserByEmail(decodedJwt['email']);
    if (!user) return { isSuccess: false, error: 'Nie znaleziono użytkownika' };
    try {
      return {
        isSuccess: true,
        payload: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          fullName: user.fullName,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (e) {
      return { isSuccess: false, error: 'Ups... coś poszło nie tak.' };
    }
  }

  async refreshTokens(rt: string, response: Response): Promise<Tokens> {
    const decodedJwt = await this.getDecodedToken(rt);
    const user = await this.checkUserById(decodedJwt['id']);

    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    response.cookie('jwt-refresh', tokens.refresh_token, { httpOnly: true });
    return { access_token: tokens.access_token };
  }
}

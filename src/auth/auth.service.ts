import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto';
import { AdminService } from '../admin/admin.service';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, Tokens } from '@Types';
import { HrService } from '../hr/hr.service';
import { ResponseDataToFront } from '../types/auth/response-data.type';
import { Student } from '../student/entity/student.entity';
import { UploadStudentDataService } from '../student/upload-student-data.service';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private studentService: StudentService,
    private initStudentDataService: UploadStudentDataService,
    private hrService: HrService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async updateRtHash(id, rt: string): Promise<void> {
    const user = await this.checkUserById(id);
    user.refreshToken = await this.hashData(rt);
    await user.save();
  }

  async getTokens(id: string, email: string): Promise<Tokens> {
    const [at, rt, vt] = await Promise.all([
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
      this.jwtService.signAsync(
        { id, email },
        {
          secret: this.configService.get('SECRET_KEY_VT'),
          expiresIn: this.configService.get('EXPIRES_IN_VT'),
        },
      ),
    ]);
    return { access_token: at, refresh_token: rt, verify_token: vt };
  }

  async getDecodedToken(rt: string) {
    return this.jwtService.decode(rt);
  }

  async checkUserByEmail(email: string) {
    const admin = await this.adminService.getAdminByEmail(email);

    const hr = await this.hrService.getHrByEmail(email);

    const student = await this.studentService.getStudentByEmail(email);

    return hr ? hr : student ? student : admin ? admin : null;
  }

  async checkUserById(id: string) {
    const admin = await this.adminService.getUserById(id);

    const hr = await this.hrService.getUserById(id);

    const student = await this.studentService.getStudentById(id);

    return admin ? admin : student ? student : hr ? hr : null;
  }

  async login(login: LoginUserDto, response: Response): Promise<ResponseDataToFront> {
    const user = await this.checkUserByEmail(login.email);
    if (!user) throw new UnauthorizedException('Access Denied');
    const passwordHash = await bcrypt.hash(user.password, 10); //Todo usunąć linie
    const passwordMatches = await bcrypt.compare(login.password, passwordHash);
    if (!passwordMatches) throw new UnauthorizedException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    response.cookie('jwt-refresh', tokens.refresh_token, { httpOnly: true });

    return { ...user, access_token: tokens.access_token };
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

  async refreshTokens(rt: string, response: Response) {
    const decodedJwt = await this.getDecodedToken(rt);
    console.log(decodedJwt);
    const user = await this.checkUserById(decodedJwt['id']);

    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    response.cookie('jwt-refresh', tokens.refresh_token, { httpOnly: true });
    return tokens;
  }
}

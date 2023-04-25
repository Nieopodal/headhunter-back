import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto';
import { AdminService } from '../admin/admin.service';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from '@Types';
import { HrService } from '../hr/hr.service';
import { ResponseDataToFront } from '../types/auth/response-data.type';

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
    return bcrypt.hash(data, 10);
  }

  async updateRtHash(id, rt: string): Promise<void> {
    const user = await this.checkUserById(id);
    user.refreshToken = await this.hashData(rt);
    await user.save();
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
    const decodedJwt = await this.jwtService.decode(rt);
    return decodedJwt;
  }

  async checkUserByEmail(email: string) {
    const admin = await this.adminService.getUserByEmail(email);

    const hr = await this.hrService.getUserByEmail(email);

    const student = await this.studentService.getUserByEmail(email);

    return hr ? hr : student ? student : admin ? admin : null;
  }

  async checkUserById(id: string) {
    const admin = await this.adminService.getUserById(id);

    const hr = await this.hrService.getUserById(id);

    const student = await this.studentService.getUserById(id);

    return admin ? admin : student ? student : hr ? hr : null;
  }

  async login(login: LoginUserDto, response: Response): Promise<ResponseDataToFront> {
    const user = await this.checkUserByEmail(login.email);
    if (!user) throw new UnauthorizedException('Access Denied');
    const passwordHash = await bcrypt.hash(user.password, 10); //Todo usunąć linie
    const passwordMatches = await bcrypt.compare(login.password, passwordHash);
    if (!passwordMatches) throw new UnauthorizedException('Access Denied');
    const data = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, data.refresh_token);
    response.cookie('jwt-refresh', data.refresh_token, { httpOnly: true });

    return { ...user, access_token: data.access_token };
  }

  async logout(id: string): Promise<void> {
    const user = await this.checkUserById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.refreshToken !== null) {
      user.refreshToken = null;
      await user.save();
    }
  }

  async refreshTokens(rt: string) {
    const decodedJwt = await this.getDecodedToken(rt);
    console.log(decodedJwt);
    const user = await this.checkUserById(decodedJwt.sub);
    console.log(rt);

    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
}

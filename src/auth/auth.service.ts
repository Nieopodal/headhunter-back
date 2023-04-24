import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto';
import { AdminService } from '../admin/admin.service';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from '@Types';
import { HrService } from '../hr/hr.service';
import { ResponseData } from '../types/auth/response-data.type';

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

  async getTokens(id: string, email: string, role: string): Promise<any> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { id, email, role },
        {
          secret: this.configService.get('SECRET_KEY_AT'),
          expiresIn: this.configService.get('EXPIRES_IN_AT'),
        },
      ),
      this.jwtService.signAsync(
        { id, email, role },
        {
          secret: this.configService.get('SECRET_KEY_RT'),
          expiresIn: this.configService.get('EXPIRES_IN_RT'),
        },
      ),
    ]);
    return { access_token: at, refresh_token: rt };
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

  async login(login: LoginUserDto): Promise<ResponseData> {
    const user = await this.checkUserByEmail(login.email);
    if (!user) throw new UnauthorizedException('Access Denied');

    const passwordHash = await bcrypt.hash(user.password, 10); //Todo usunąć linie

    const passwordMatches = await bcrypt.compare(login.password, passwordHash);

    if (!passwordMatches) throw new UnauthorizedException('Access Denied');

    const data = await this.getTokens(user.id, user.email, user.role);

    await this.updateRtHash(user.id, data.refresh_token);

    return { ...data, name: user };
  }

  async refreshTokens(id: string, rt: string) {
    const user = await this.checkUserById(id);
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
}

import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto';
import { AdminService } from '../admin/admin.service';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from '@Types';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private studentService: StudentService,
    private hrService: StudentService,
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

  async getTokens(id: string, email: string, role: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { id, email, role },
        {
          secret: this.configService.get('SECRET_KEY_AT'),
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        { id, email, role },
        {
          secret: this.configService.get('SECRET_KEY_RT'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return { role, access_token: at, refresh_token: rt };
  }

  async checkUserByEmail(email: string) {
    const admin = await this.adminService.getUserByEmail(email);

    const hr = await this.hrService.getUserByEmail(email);

    const student = await this.studentService.getUserByEmail(email);

    return admin ? admin : student ? student : hr ? hr : null;
  }

  async checkUserById(id: string) {
    const admin = await this.adminService.getUserById(id);

    const hr = await this.hrService.getUserById(id);

    const student = await this.studentService.getUserById(id);

    return admin ? admin : student ? student : hr ? hr : null;
  }

  async login(login: LoginUserDto): Promise<Tokens> {
    const user = await this.checkUserByEmail(login.email);

    if (!user) throw new UnauthorizedException('Access Denied');

    const passwordMatches = await bcrypt.compare(login.password, user.password);

    if (!passwordMatches) throw new UnauthorizedException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);

    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
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

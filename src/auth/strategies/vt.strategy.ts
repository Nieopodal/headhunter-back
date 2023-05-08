import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '@Types';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { StudentService } from '../../student/student.service';

@Injectable()
export class VtStrategy extends PassportStrategy(Strategy, 'jwt-verify-email') {
  constructor(private readonly studentService: StudentService) {
    super();
  }

  validate(req: Request, payload: JwtPayload) {
    const hashedVt = req.params['verificationToken'];
    const vt = this.studentService.getStudentById(req.params['id']);
    const vtMatches = bcrypt.compare(hashedVt, vt);
    console.log(vtMatches);
    return payload;
  }
}

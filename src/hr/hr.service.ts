import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Hr } from './entity/hr.entity';
import { Student, StudentStatus } from '../student/entity/student.entity';
import { ResponseDataToFront } from '../types/auth/response-data.type';
import { ApiResponse } from '@Types';

@Injectable()
export class HrService {
  async getUserByEmail(email: string): Promise<Hr> {
    return await Hr.findOneBy({ email });
  }

  async getUserById(id: string): Promise<Hr> {
    return await Hr.findOneBy({ id });
  }

  async setToInterview(id: string, hrId: string): Promise<ApiResponse<ResponseDataToFront>> {

    const hr = await this.getUserById(hrId);
    const bookedStudents = await Student.count({
      relations: ['interviewBy'],
      where: {
        interviewBy: { id: hrId },
      },
    });

    if (bookedStudents >= hr.maxReservedStudents) {
      throw new HttpException(
        {
          isSuccess: false,
          status: HttpStatus.BAD_REQUEST,
          error: `You can not set to interview more than ${hr.maxReservedStudents} ${hr.maxReservedStudents === 1 ? 'student' : 'students'}!`,
        }, HttpStatus.BAD_REQUEST);
    }

    const isBooked = await Student.findOne({
      relations: ['interviewBy'],
      where: {
        id,
        status: StudentStatus.INTERVIEW,
      },
    });

    if (isBooked) {
      throw new HttpException(
        {
          isSuccess: false,
          status: HttpStatus.BAD_REQUEST,
          error: `This student is already assigned to interview!`,
        }, HttpStatus.BAD_REQUEST);
    }

    const foundStudent = await Student.findOne({
      where: {
        id,
        active: true,
        status: StudentStatus.AVAILABLE,
      },
    });

    if (!foundStudent) {
      throw new HttpException(
        {
          isSuccess: false,
          status: HttpStatus.BAD_REQUEST,
          error: `This student is not available!`,
        }, HttpStatus.BAD_REQUEST);
    }

    foundStudent.status = StudentStatus.INTERVIEW;
    foundStudent.interviewBy = hr;
    await foundStudent.save();
    return {
      isSuccess: true,
      payload: null,
    };
  }
}

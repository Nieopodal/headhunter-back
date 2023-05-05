import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Hr } from './entity/hr.entity';
import { Student } from '../student/entity/student.entity';
import { ApiResponse, StudentStatus, StudentToInterview } from '@Types';
import { getAvatar } from './utils/get-avatar';

@Injectable()
export class HrService {
  // change data type to correct type
  filter(data: any): StudentToInterview {
    const {
      firstName,
      education,
      courses,
      role,
      createdAt,
      updatedAt,
      refreshToken,
      lastName,
      active,
      githubUsername,
      status,
      interviewBy,
      bio,
      contactNumber,
      portfolioUrls,
      email,
      password,
      ...rest
    } = data;
    return rest;
  }

  async getUserByEmail(email: string): Promise<Hr> {
    return await Hr.findOneBy({ email });
  }
  async getUserById(id: string): Promise<Hr> {
    return await Hr.findOneBy({ id });
  }

  async setToInterview(id: string, hrId: string): Promise<ApiResponse<null>> {
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
          error: `Możesz zaprosić do rozmowy tylko ${hr.maxReservedStudents} ${
            hr.maxReservedStudents === 1 ? 'studenta' : 'studentów'
          }!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isBooked = await Student.findOne({
      where: {
        id,
        status: StudentStatus.INTERVIEW,
      },
    });

    if (isBooked) {
      throw new HttpException(
        {
          isSuccess: false,
          error: `Ten student jest już zapisany na rozmowę!`,
        },
        HttpStatus.BAD_REQUEST,
      );
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
          error: `Ten student jest niedostępny!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    foundStudent.status = StudentStatus.INTERVIEW;
    foundStudent.interviewBy = hr;
    foundStudent.avatar = (await getAvatar(foundStudent.githubUsername))
      ? 'https://www.deviantart.com/karmaanddestiny/art/Default-user-icon-4-858661084'
      : `https://github.com/${foundStudent.githubUsername}.png`;
    foundStudent.firstName = `${foundStudent.firstName}`;
    foundStudent.lastName = `${foundStudent.lastName}`;
    const reservationTime = +new Date().setHours(23, 59, 59, 99) + 1000 * 60 * 60 * 24 * 10;
    foundStudent.reservationTime = new Date(reservationTime);
    await foundStudent.save();

    return {
      isSuccess: true,
      payload: null,
    };
  }

  async setDisinterest(id: string, hrId: string): Promise<ApiResponse<null>> {
    const foundStudent = await Student.findOne({
      relations: ['interviewBy'],
      where: {
        id,
        status: StudentStatus.INTERVIEW,
        interviewBy: {
          id: hrId,
        },
      },
    });

    if (!foundStudent) {
      throw new HttpException(
        {
          isSuccess: false,
          error: `Ten student jest niedostępny!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    foundStudent.status = StudentStatus.AVAILABLE;
    foundStudent.interviewBy = null;
    foundStudent.avatar = null;
    foundStudent.firstName;
    foundStudent.lastName;
    foundStudent.reservationTime = null;
    await foundStudent.save();

    return {
      isSuccess: true,
      payload: null,
    };
  }

  async setEmployed(id: string, hrId?: string): Promise<ApiResponse<null>> {
    const foundStudent = await Student.findOne({
      relations: ['interviewBy'],
      where: {
        id,
        status: StudentStatus.INTERVIEW,
        active: true,
        interviewBy: {
          id: hrId,
        },
      },
    });

    if (!foundStudent) {
      throw new HttpException(
        {
          isSuccess: false,
          error: `Ten student jest niedostępny!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    foundStudent.status = StudentStatus.EMPLOYED;
    foundStudent.active = false;
    foundStudent.interviewBy = null;
    foundStudent.reservationTime = null;
    foundStudent.firstName = null;
    foundStudent.lastName = null;
    foundStudent.avatar = null;
    await foundStudent.save();

    return {
      isSuccess: true,
      payload: null,
    };
  }

  async showStudentsToInterview(id: string): Promise<ApiResponse<StudentToInterview[]>> {
    const studentsToInterview = await Student.find({
      relations: ['interviewBy'],
      where: {
        status: StudentStatus.INTERVIEW,
        active: true,
        interviewBy: {
          id,
        },
      },
    });

    if (!studentsToInterview) {
      throw new HttpException(
        {
          isSuccess: false,
          error: `Coś poszło nie tak!`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      isSuccess: true,
      payload: studentsToInterview.map((student) => this.filter(student)),
    };
  }
}

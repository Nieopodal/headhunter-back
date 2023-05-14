import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Student } from './entity/student.entity';
import { ApiResponse, StudentStatus, StudentsToInterviewPaginated } from '@Types';
import { HrService } from '../hr/hr.service';
import { interviewFilter } from './utils/filter-methods';

@Injectable()
export class StudentHrMethodsService {
  constructor(private readonly hrService: HrService) {
  }

  async setToInterview(id: string, hrId: string): Promise<ApiResponse<null>> {
    const hr = await this.hrService.getHrById(hrId);
    const bookedStudents = await Student.count({
      relations: ['hr'],
      where: {
        hr: { id: hrId },
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
    foundStudent.hr = hr;
    foundStudent.firstName = `${foundStudent.firstName}`;
    foundStudent.lastName = `${foundStudent.lastName}`;
    foundStudent.reservationTime = new Date(+new Date().setHours(23, 59, 59, 99) + 864000000);
    await foundStudent.save();

    return {
      isSuccess: true,
      payload: null,
    };
  }

  async setDisinterest(id: string, hrId: string): Promise<ApiResponse<null>> {
    const foundStudent = await Student.findOne({
      relations: ['hr'],
      where: {
        id,
        status: StudentStatus.INTERVIEW,
        hr: {
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
    foundStudent.hr = null;
    foundStudent.reservationTime = null;
    await foundStudent.save();

    return {
      isSuccess: true,
      payload: null,
    };
  }

  async setEmployed(id: string, hrId?: string): Promise<ApiResponse<null>> {
    const foundStudent = await Student.findOne({
      relations: ['hr'],
      where: {
        id,
        status: StudentStatus.INTERVIEW,
        active: true,
        hr: {
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
    foundStudent.hr = null;
    foundStudent.reservationTime = null;
    foundStudent.firstName = null;
    foundStudent.lastName = null;
    await foundStudent.save();

    return {
      isSuccess: true,
      payload: null,
    };
  }

  async showStudentsToInterview(id: string, pageNumber: number, numberPerPage: number): Promise<ApiResponse<StudentsToInterviewPaginated>> {
    const [studentsToInterview, count] = await Student.findAndCount({
      relations: ['hr'],
      where: {
        status: StudentStatus.INTERVIEW,
        active: true,
        hr: {
          id,
        },
      },
      skip: numberPerPage * (pageNumber - 1),
      take: numberPerPage,
    });

    const totalPages = Math.ceil(count / numberPerPage);

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
      payload: {
        studentData: studentsToInterview.map((student) => interviewFilter(student)),
        totalPages,
      },
    };
  }
}

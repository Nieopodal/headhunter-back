import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { availableFilter, interviewFilter } from './utils/filter-methods';
import { getInterviewOrAvailableStudents } from './utils/get-interview-or-available-students';
import { Student } from './entity/student.entity';
import { HrService } from '../hr/hr.service';
import { FilterStudentDto } from './dto';
import {
  ApiResponse,
  AvailableStudentsPaginated,
  StudentFilter,
  StudentStatus,
  StudentsToInterviewPaginated,
} from '../types';

@Injectable()
export class StudentHrMethodsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly hrService: HrService) {}

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
        `Możesz zaprosić do rozmowy tylko ${hr.maxReservedStudents} ${
          hr.maxReservedStudents === 1 ? 'studenta' : 'studentów'
        }!`,
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
      throw new HttpException(`Ten student jest już zapisany na rozmowę!`, HttpStatus.BAD_REQUEST);
    }

    const foundStudent = await Student.findOne({
      where: {
        id,
        active: true,
        status: StudentStatus.AVAILABLE,
      },
    });

    if (!foundStudent) {
      throw new HttpException(`Ten student jest niedostępny!`, HttpStatus.BAD_REQUEST);
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
      throw new HttpException(`Ten student jest niedostępny!`, HttpStatus.BAD_REQUEST);
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
      throw new HttpException(`Ten student jest niedostępny!`, HttpStatus.BAD_REQUEST);
    }

    foundStudent.status = StudentStatus.EMPLOYED;
    foundStudent.active = false;
    foundStudent.hr = null;
    foundStudent.reservationTime = null;
    await foundStudent.save();

    return {
      isSuccess: true,
      payload: null,
    };
  }

  async showInterviewStudents(
    name: string,
    pageNumber: number,
    numberPerPage: number,
    hrId: string,
  ): Promise<ApiResponse<StudentsToInterviewPaginated>> {
    try {
      const filterSchema: FilterStudentDto = await this.cacheManager.get(`filter-${hrId}`);
      const { studentData, totalPages } = await getInterviewOrAvailableStudents(
        filterSchema,
        pageNumber,
        numberPerPage,
        hrId,
        StudentStatus.INTERVIEW,
        name,
      );

      return {
        isSuccess: true,
        payload: { studentData: studentData.map((student) => interviewFilter(student)), totalPages },
      };
    } catch {
      throw new HttpException(`Coś poszło nie tak!`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async showAvailableStudents(
    name: string,
    pageNumber: number,
    numberPerPage: number,
    hrId: string,
  ): Promise<ApiResponse<AvailableStudentsPaginated>> {
    try {
      const filterSchema: FilterStudentDto = await this.cacheManager.get(`filter-${hrId}`);
      const { studentData, totalPages } = await getInterviewOrAvailableStudents(
        filterSchema,
        pageNumber,
        numberPerPage,
        hrId,
        StudentStatus.AVAILABLE,
        name,
      );

      return {
        isSuccess: true,
        payload: { studentData: studentData.map((student) => availableFilter(student)), totalPages },
      };
    } catch {
      throw new HttpException(`Coś poszło nie tak!`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async setFilter(data: FilterStudentDto, hrId: string): Promise<ApiResponse<StudentFilter>> {
    try {
      await this.cacheManager.set(`filter-${hrId}`, data, 0);
      return {
        isSuccess: true,
        payload: {
          usedFilter: data,
        },
      };
    } catch {
      throw new HttpException(`Coś poszło nie tak!`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeFilter(hrId: string): Promise<ApiResponse<null>> {
    try {
      await this.cacheManager.del(`filter-${hrId}`);
      return {
        isSuccess: true,
        payload: null,
      };
    } catch {
      throw new HttpException(`Coś poszło nie tak!`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

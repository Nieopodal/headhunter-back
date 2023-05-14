import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ApiResponse,
  AvailableStudentsPaginated,
  SimpleStudentData,
  StudentCv,
  StudentStatus,
  StudentsToInterviewPaginated,
  UpdateResponse,
} from '@Types';
import { Student } from './entity/student.entity';
import { availableFilter } from './utils/filter-methods';

@Injectable()
export class StudentService {
  async getAvatar(id: string): Promise<ApiResponse<string>> {
    const studentAvatar = await Student.findOneBy({ id });
    if (!studentAvatar) {
      return { isSuccess: false, error: 'Nie znaleziono użytkownika' };
    }
    return { isSuccess: true, payload: studentAvatar.githubUsername };
  }

  async getStudentCv(id: string): Promise<ApiResponse<StudentCv>> {
    const studentCv: StudentCv = await Student.createQueryBuilder('student')
      .select([
        'student.id',
        'student.firstName',
        'student.lastName',
        'student.email',
        'student.contactNumber',
        'student.bio',
        'student.githubUsername',
        'student.courseCompletion',
        'student.courseEngagement',
        'student.projectDegree',
        'student.teamProjectDegree',
        'student.portfolioUrls',
        'student.projectUrls',
        'student.expectedTypeWork',
        'student.expectedContractType',
        'student.targetWorkCity',
        'student.expectedSalary',
        'student.canTakeApprenticeship',
        'student.monthsOfCommercialExp',
        'student.education',
        'student.courses',
        'student.scrumProjectUrls',
        'student.workExperience',
      ])
      .where('student.id = :id', { id })
      .getRawOne();

    if (!studentCv) {
      return { isSuccess: false, error: 'Nie znaleziono studenta' };
    }

    return { isSuccess: true, payload: studentCv };
  }

  async simpleStudentData(id: string): Promise<ApiResponse<SimpleStudentData>> {
    const studentData: SimpleStudentData = await Student.createQueryBuilder('student')
      .select([
        'student.id',
        'student.firstName',
        'student.lastName',
        'student.courseCompletion',
        'student.courseEngagement',
        'student.projectDegree',
        'student.teamProjectDegree',
        'student.expectedTypeWork',
        'student.targetWorkCity',
        'student.expectedSalary',
        'student.canTakeApprenticeship',
        'student.monthsOfCommercialExp',
      ])
      .where('student.id = :id', { id })
      .getRawOne();
    if (!studentData) {
      return { isSuccess: false, error: 'Nie znaleziono studenta' };
    }
    return { isSuccess: true, payload: studentData };
  }

  async deactivate(id: string): Promise<ApiResponse<UpdateResponse>> {
    const student: Student = await Student.findOneBy({
      id,
      active: true,
    });
    try {
      student.active = true;
      student.status = StudentStatus.EMPLOYED;
      student.hr = null;
      student.reservationTime = null;
      student.firstName = null;
      student.lastName = null;
      await Student.save(student);
      return { isSuccess: true, payload: { id } };
    } catch {
      return { isSuccess: false, error: 'Nie znaleziono studenta' };
    }
  }

  async getFreeStudents(pageNumber: number, numberPerPage: number): Promise<ApiResponse<AvailableStudentsPaginated>> {

    const count = await Student.createQueryBuilder('student')
      .where('student.hr IS NULL')
      .andWhere('student.active = :active', { active: true })
      .andWhere('student.status = :status', { status: StudentStatus.AVAILABLE })
      .getCount();

    const studentData = await Student.createQueryBuilder('student')
      .select([
        'student.id',
        'student.firstName',
        'student.lastName',
        'student.courseCompletion',
        'student.courseEngagement',
        'student.projectDegree',
        'student.teamProjectDegree',
        'student.expectedTypeWork',
        'student.expectedContractType',
        'student.targetWorkCity',
        'student.expectedSalary',
        'student.canTakeApprenticeship',
        'student.monthsOfCommercialExp',
      ])
      .where('student.hr IS NULL')
      .andWhere('student.active = :active', { active: true })
      .andWhere('student.status = :status', { status: StudentStatus.AVAILABLE })
      .skip(numberPerPage * (pageNumber - 1))
      .take(numberPerPage)
      .getRawMany();

    const totalPages = Math.ceil(count / numberPerPage);

    if (!studentData) {
      return { isSuccess: false, error: 'Nie znaleziono studenta' };
    }
    return { isSuccess: true, payload: { studentData, totalPages } };
  }

  async getStudentByEmail(email: string): Promise<Student> {
    return await Student.findOneBy({ email });
  }

  async getStudentById(id: string): Promise<Student> {
    return await Student.findOneBy({ id });
  }

  async get(): Promise<Student[]> {
    return await Student.find();
  }

  async updateStudent(data, id): Promise<ApiResponse<UpdateResponse>> {
    try {
      await Student.createQueryBuilder('student').update(Student).set(data).where('id=:id', { id }).execute();
      return {
        isSuccess: true,
        payload: { id: data.id },
      };
    } catch {
      return { isSuccess: false, error: 'Ups... coś poszło nie tak.' };
    }
  }

  async availableStudentsSearch(name: string, pageNumber: number, numberPerPage: number): Promise<ApiResponse<AvailableStudentsPaginated>> {
    try {
      const [studentData, count] = await Student.createQueryBuilder('student')
        .where('student.hr IS NULL')
        .andWhere('student.active = :active', { active: true })
        .andWhere('student.status = :status', { status: StudentStatus.AVAILABLE })
        .andWhere('student.firstName LIKE :name', {
          name: `%${name}%`,
        })
        .orWhere('student.lastName LIKE :name', {
          name: `%${name}%`,
        })
        .skip(numberPerPage * (pageNumber - 1))
        .take(numberPerPage)
        .getManyAndCount();

      const totalPages = Math.ceil(count / numberPerPage);

      return {
        isSuccess: true,
        payload: { studentData: studentData.map(student => availableFilter(student)), totalPages },
      };
    } catch {
      throw new HttpException(
        {
          isSuccess: false,
          error: `Coś poszło nie tak!`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  interviewStudentsSearch(name: string, pageNumber: number, numberPerPage: number): Promise<ApiResponse<StudentsToInterviewPaginated>> {
    return undefined;
  }
}
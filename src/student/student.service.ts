import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  ApiResponse,
  AvailableStudentsPaginated,
  SimpleStudentData,
  StudentCv,
  StudentStatus,
  UpdateResponse,
  UpdateStudentResponse,
} from '@Types';
import { Student } from './entity/student.entity';
import { availableFilter } from './utils/filter-methods';
import { FilterStudentDto } from './dto/filter-student.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

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

  async getFreeStudents(pageNumber: number, numberPerPage: number, name: string): Promise<ApiResponse<AvailableStudentsPaginated>> {
    const count = await Student.createQueryBuilder('student')
      .where('student.hr IS NULL')
      .andWhere('student.active = :active', { active: true })
      .andWhere('student.status = :status', { status: StudentStatus.AVAILABLE })
      .andWhere('(student.firstName LIKE :name OR student.lastName LIKE :name)', { name: `%${name}%` })
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
      .andWhere('(student.firstName LIKE :name OR student.lastName LIKE :name)', { name: `%${name}%` })
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
        payload: { id },
      };
    } catch (e) {
      return { isSuccess: false, error: 'Ups.... coś poszło nie tak' };
    }
  }

  async registerStudentData(id, token, registerData): Promise<ApiResponse<UpdateStudentResponse>> {
    const user = await Student.findOneBy({ id });
    if (!user) {
      return { isSuccess: false, error: 'Blędne dane' };
    }
    if (token !== user.verificationToken) {
      return { isSuccess: false, error: 'Błędne dane' };
    }
    try {
      await Student.createQueryBuilder('student')
        .update(Student)
        .set(registerData)
        .where('student.id = :id', { id })
        .execute();
      await Student.createQueryBuilder('student')
        .update(Student)
        .set({ password: await bcrypt.hash(registerData.password, 10), active: true, verificationToken: null })
        .where('student.id = :id', { id })
        .execute();
      return { isSuccess: true, payload: id };
    } catch (e) {
      return { isSuccess: false, error: e.message };
    }
  }


  async availableStudentsSearch(name: string, pageNumber: number, numberPerPage: number): Promise<ApiResponse<AvailableStudentsPaginated>> {
    try {
      const filterSchema: FilterStudentDto = await this.cacheManager.get('filter');
      const [studentData, count] = await Student.createQueryBuilder('student')
        .setParameter('check', filterSchema ? true : null)
        .where('student.hr IS NULL')
        .andWhere('student.active = :active', { active: true })
        .andWhere('student.status = :status', { status: StudentStatus.AVAILABLE })
        .andWhere('(student.firstName LIKE :name OR student.lastName LIKE :name)', { name: `%${name}%` })
        .andWhere('(:check IS NULL OR student.monthsOfCommercialExp >= :monthsOfCommercialExp)', { monthsOfCommercialExp: filterSchema ? filterSchema.monthsOfCommercialExp : false })
        .andWhere('(:check IS NULL OR student.canTakeApprenticeship = :canTakeApprenticeship)', { canTakeApprenticeship: filterSchema ? filterSchema.canTakeApprenticeship : false })
        .andWhere('(:check IS NULL OR student.expectedSalary BETWEEN :minSalary AND :maxSalary)', {
          minSalary: filterSchema ? filterSchema.minSalary : false,
          maxSalary: filterSchema ? filterSchema.maxSalary : false,
        })
        .andWhere('(:check IS NULL OR student.teamProjectDegree >= :teamProjectDegree)', { teamProjectDegree: filterSchema ? filterSchema.teamProjectDegree : false })
        .andWhere('(:check IS NULL OR student.projectDegree >= :projectDegree)', { projectDegree: filterSchema ? filterSchema.projectDegree : null })
        .andWhere('(:check IS NULL OR student.courseEngagement >= :courseEngagement)', { courseEngagement: filterSchema ? filterSchema.courseEngagement : null })
        .andWhere('(:check IS NULL OR student.courseCompletion >= :courseCompletion)', { courseCompletion: filterSchema ? filterSchema.courseCompletion : null })
        .andWhere('(:check IS NULL OR student.expectedContractType IN (:expectedContractType))', { expectedContractType: filterSchema ? filterSchema.expectedContractType : false })
        .andWhere('(:check IS NULL OR student.expectedTypeWork IN (:expectedTypeWork))', { expectedTypeWork: filterSchema ? filterSchema.expectedTypeWork : false })
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



  async setFilter(data: FilterStudentDto, pageNumber: number, numberPerPage: number): Promise<ApiResponse<AvailableStudentsPaginated>> {
    try {
      const [studentData, count] = await Student.createQueryBuilder('student')
        .where('student.hr IS NULL')
        .andWhere('student.active = :active', { active: true })
        .andWhere('student.status = :status', { status: StudentStatus.AVAILABLE })
        .andWhere('student.monthsOfCommercialExp >= :monthsOfCommercialExp', { monthsOfCommercialExp: data.monthsOfCommercialExp })
        .andWhere('student.canTakeApprenticeship = :canTakeApprenticeship', { canTakeApprenticeship: data.canTakeApprenticeship })
        .andWhere('student.expectedSalary BETWEEN :minSalary AND :maxSalary', {
          minSalary: data.minSalary,
          maxSalary: data.maxSalary,
        })
        .andWhere('student.teamProjectDegree >= :teamProjectDegree', { teamProjectDegree: data.teamProjectDegree })
        .andWhere('student.projectDegree >= :projectDegree', { projectDegree: data.projectDegree })
        .andWhere('student.courseEngagement >= :courseEngagement', { courseEngagement: data.courseEngagement })
        .andWhere('student.courseCompletion >= :courseCompletion', { courseCompletion: data.courseCompletion })
        .andWhere('student.expectedContractType IN (:expectedContractType)', { expectedContractType: data.expectedContractType })
        .andWhere('student.expectedTypeWork IN (:expectedTypeWork)', { expectedTypeWork: data.expectedTypeWork })
        .skip(numberPerPage * (pageNumber - 1))
        .take(numberPerPage)
        .getManyAndCount();

      const totalPages = Math.ceil(count / numberPerPage);

      await this.cacheManager.set('filter', data, 0);
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

  async removeFilter(): Promise<void> {
    await this.cacheManager.del('filter');
  }
}

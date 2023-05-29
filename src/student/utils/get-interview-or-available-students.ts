import { FilterStudentDto } from '../dto';
import { StudentStatus } from '../../types';
import { Student } from '../entity/student.entity';

export const getInterviewOrAvailableStudents = async (
  filterSchema: FilterStudentDto | undefined,
  pageNumber: number,
  numberPerPage: number,
  hrId: string,
  status: StudentStatus,
  name: string,
) => {
  const [studentData, count] = await Student.createQueryBuilder('student')
    .setParameter('check', filterSchema ? true : null)
    .where('((student.hr = :hrId AND student.status = :status) OR (student.hr IS NULL AND student.status = :status))', {
      hrId: hrId,
      status: status,
    })
    .andWhere('student.active = :active', { active: true })
    .andWhere('(student.firstName LIKE :name OR student.lastName LIKE :name)', { name: `%${name}%` })
    .andWhere('(:check IS NULL OR student.monthsOfCommercialExp >= :monthsOfCommercialExp)', {
      monthsOfCommercialExp: filterSchema ? filterSchema.monthsOfCommercialExp : false,
    })
    .andWhere('(:check IS NULL OR student.canTakeApprenticeship = :canTakeApprenticeship)', {
      canTakeApprenticeship: filterSchema ? filterSchema.canTakeApprenticeship : false,
    })
    .andWhere('(:check IS NULL OR student.expectedSalary BETWEEN :minSalary AND :maxSalary)', {
      minSalary: filterSchema ? filterSchema.minSalary : false,
      maxSalary: filterSchema ? filterSchema.maxSalary : false,
    })
    .andWhere('(:check IS NULL OR student.teamProjectDegree >= :teamProjectDegree)', {
      teamProjectDegree: filterSchema ? filterSchema.teamProjectDegree : false,
    })
    .andWhere('(:check IS NULL OR student.projectDegree >= :projectDegree)', {
      projectDegree: filterSchema ? filterSchema.projectDegree : null,
    })
    .andWhere('(:check IS NULL OR student.courseEngagement >= :courseEngagement)', {
      courseEngagement: filterSchema ? filterSchema.courseEngagement : null,
    })
    .andWhere('(:check IS NULL OR student.courseCompletion >= :courseCompletion)', {
      courseCompletion: filterSchema ? filterSchema.courseCompletion : null,
    })
    .andWhere('(:check IS NULL OR student.expectedContractType IN (:expectedContractType))', {
      expectedContractType: filterSchema ? filterSchema.expectedContractType : false,
    })
    .andWhere('(:check IS NULL OR student.expectedTypeWork IN (:expectedTypeWork))', {
      expectedTypeWork: filterSchema ? filterSchema.expectedTypeWork : false,
    })
    .skip(numberPerPage * (pageNumber - 1))
    .take(numberPerPage)
    .getManyAndCount();
  const totalPages = Math.ceil(count / numberPerPage);

  return {
    studentData,
    totalPages,
  };
};

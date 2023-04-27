import { Injectable } from "@nestjs/common";
import { Student } from "./entity/student.entity";
import { UploadFileService } from "../admin/upload-file.service";

@Injectable()
export class StudentService {
  constructor(private uploadFileService: UploadFileService) {
  }

  async getUserByEmail(email: string): Promise<Student> {
    return await Student.findOneBy({ email });
  }

  async getUserById(id: string): Promise<Student> {
    return await Student.findOneBy({ id });
  }

  async get(): Promise<Student[]> {
    return await Student.find();
  }

  async updateUserData(studentId): Promise<Student> {
    const { id, projectDegree, teamProjectDegree, bonusProjectUrls, courseCompletion, courseEngagement, email } =
      await this.uploadFileService.getStudentById(studentId);
    const newStudent = new Student();

    newStudent.id = id;
    newStudent.email = email;
    newStudent.password = //hashowanie form;
      newStudent.contactNumber = //form;
        newStudent.firstName = // form
          newStudent.githubUsername = //form
            newStudent.portfolioUrls = // form
              newStudent.courseCompletion =
                courseCompletion;
    newStudent.courseEngagement = courseEngagement;
    newStudent.projectDegree = projectDegree; // form
    newStudent.teamProjectDegree = teamProjectDegree; // form
    newStudent.bonusProjectUrls = bonusProjectUrls; // form
    newStudent.bio = // form
      newStudent.expectedTypeWork =// form
        newStudent.targetWorkCity =// form
          newStudent.expectedContractType =// form
            newStudent.expectedSalary =// form
              newStudent.canTakeApprenticeship =// form
                newStudent.monthsOfCommercialExp =// form
                  newStudent.education =// form
                    newStudent.workExperience =// form
                      newStudent.courses =// form
                        newStudent.active =// form
                          newStudent.role =// default
                            newStudent.refreshToken =// generate
    return;
  }
}

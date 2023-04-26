import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { AdminService } from "../admin/admin.service";
import { StudentService } from "../student/student.service";
import { HrService } from "../hr/hr.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import { Student } from "../student/entity/student.entity";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        AdminService,
        StudentService,
        HrService,
        JwtService,
        ConfigService
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("hashData", () => {
    it("should return a hashed string", async () => {
      const data = 'test123';
      const hashedData = await service.hashData(data);
      const isMatch = await bcrypt.compare(data, hashedData);
      expect(isMatch).toBe(true);
    });
  });
  describe('updateRtHash', () => {
    it('should update the user refresh token hash', async () => {
      const id = 1;
      const rt = 'test123';
      const mockUser: Partial<Student> = {
        refreshToken: '',
        save: jest.fn(),
      };
      jest.spyOn(service, 'checkUserById').mockResolvedValue(mockUser as Student);
      await service.updateRtHash(id, rt);

      expect(mockUser.refreshToken).not.toBe('');
      expect(mockUser.save).toHaveBeenCalled();
    });
  });
});

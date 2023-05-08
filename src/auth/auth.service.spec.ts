import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AdminService } from '../admin/admin.service';
import { StudentService } from '../student/student.service';
import { HrService } from '../hr/hr.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Student } from '../student/entity/student.entity';
import { Admin } from '../admin/entity/admin.entity';
import { Hr } from '../hr/entity/hr.entity';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let adminService: AdminService;
  let hrService: HrService;
  let studentService: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, AdminService, StudentService, HrService, JwtService, ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    adminService = module.get<AdminService>(AdminService);
    hrService = module.get<HrService>(HrService);
    studentService = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashData', () => {
    it('should return a hashed string', async () => {
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

  describe('getTokens', () => {
    it('should return a Tokens object with access_token and refresh_token', async () => {
      jest.spyOn(jwtService, 'signAsync').mockImplementation(async () => 'mock_token');
      jest.spyOn(configService, 'get').mockReturnValue('mock_secret_key');
      const tokens = await service.getTokens('1', 'test@example.com');
      expect(tokens.access_token).toBe('mock_token');
      expect(tokens.refresh_token).toBe('mock_token');
    });
  });

  describe('getDecodedToken', () => {
    it('should return decoded token', async () => {
      const mockToken = 'mock_token';
      const mockDecodedToken = { id: '1', email: 'test@example.com' };
      jest.spyOn(jwtService, 'decode').mockReturnValue(mockDecodedToken);
      const decodedToken = await service.getDecodedToken(mockToken);
      expect(decodedToken).toEqual(mockDecodedToken);
    });

    it('should throw an error if the token is invalid', async () => {
      const mockToken = 'invalid_token';
      jest.spyOn(jwtService, 'decode').mockImplementation(() => {
        throw new Error('Invalid token');
      });
      await expect(service.getDecodedToken(mockToken)).rejects.toThrow('Invalid token');
    });
  });

  describe('checkUserByEmail', () => {
    it('should return null if no user found', async () => {
      jest.spyOn(adminService, 'getUserByEmail').mockResolvedValue(null);
      jest.spyOn(hrService, 'getUserByEmail').mockResolvedValue(null);
      jest.spyOn(studentService, 'getUserByEmail').mockResolvedValue(null);

      const result = await service.checkUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });

    it('should return the correct user for a given email', async () => {
      const mockAdmin: Partial<Admin> = { id: '1', email: 'admin@example.com' };
      const mockHR: Partial<Hr> = { id: '2', email: 'hr@example.com' };
      const mockStudent: Partial<Student> = { id: '3', email: 'student@example.com' };

      jest.spyOn(adminService, 'getUserByEmail').mockResolvedValue(mockAdmin as Admin);
      jest.spyOn(hrService, 'getUserByEmail').mockResolvedValue(mockHR as Hr);
      jest.spyOn(studentService, 'getUserByEmail').mockResolvedValue(mockStudent as Student);

      const email = 'hr@example.com';
      const result = await service.checkUserByEmail(email);

      expect(result).toEqual(mockHR);
    });

    describe('checkUserById', () => {
      it('should return nullable if no user found', async () => {
        jest.spyOn(adminService, 'getUserById').mockResolvedValue(null);
        jest.spyOn(hrService, 'getUserById').mockResolvedValue(null);
        jest.spyOn(studentService, 'getUserById').mockResolvedValue(null);

        const result = await service.checkUserById(null);

        expect(result).toBeNull();
      });

      it('should return the correct user for a given id', async () => {
        const mockAdmin: Partial<Admin> = { id: '1' };
        const mockHR: Partial<Hr> = { id: '2' };
        const mockStudent: Partial<Student> = { id: '3' };

        jest.spyOn(adminService, 'getUserById').mockResolvedValue(mockAdmin as Admin);
        jest.spyOn(hrService, 'getUserById').mockResolvedValue(mockHR as Hr);
        jest.spyOn(studentService, 'getUserById').mockResolvedValue(mockStudent as Student);

        const id = '1';
        const result = await service.checkUserById(id);

        expect(result).toEqual(mockAdmin);
      });
    });
  });
});

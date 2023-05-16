import { ExpectedContractType, ExpectedTypeWork, StudentStatus, UserRole } from '@Types';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hr } from '../../hr/entity/hr.entity';

@Entity()
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255, default: '' })
  password: string;

  @Column({ length: 20, nullable: true })
  contactNumber: string;

  @Column({ length: 50, default: '' })
  firstName: string;

  @Column({ length: 70, default: '' })
  lastName: string;

  @Column({ default: '' })
  githubUsername: string;

  @Column({ type: 'simple-array', nullable: true })
  portfolioUrls: string[];

  @Column({ type: 'simple-array', nullable: true })
  projectUrls: string[];

  @Column({ type: 'simple-array', nullable: true })
  scrumProjectUrls: string[];

  @Column({ default: 0 })
  courseCompletion: number;

  @Column({ default: 0 })
  courseEngagement: number;

  @Column({ default: 0 })
  projectDegree: number;

  @Column({ default: 0 })
  teamProjectDegree: number;

  @Column({ length: 400, nullable: true })
  bio: string;

  @Column({ type: 'enum', enum: ExpectedTypeWork, default: ExpectedTypeWork.DM })
  expectedTypeWork: ExpectedTypeWork;

  @Column({ length: 60, nullable: true })
  targetWorkCity: string;

  @Column({ type: 'enum', enum: ExpectedContractType, default: ExpectedContractType.NONE })
  expectedContractType: ExpectedContractType;

  @Column({ type: 'numeric', precision: 9, scale: 2, nullable: true })
  expectedSalary: string;

  @Column({ default: false })
  canTakeApprenticeship: boolean;

  @Column({ default: 0 })
  monthsOfCommercialExp: number;

  @Column({ type: 'text', nullable: true })
  education: string;

  @Column({ type: 'text', nullable: true })
  workExperience: string;

  @Column({ type: 'text', nullable: true })
  courses: string;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Column({ type: 'enum', default: UserRole.STUDENT, enum: UserRole })
  role: UserRole;

  @Column({
    default: null,
    nullable: true,
    type: 'enum',
    enum: StudentStatus,
  })
  status: StudentStatus | null;

  @Column({ default: null, nullable: true })
  reservationTime: Date | null;

  @Column({ nullable: true, default: null, length: 255 })
  refreshToken: string;

  @Column({ nullable: true, default: null, length: 255 })
  verificationToken: string;

  @Column({ default: '', length: 255 })
  activationUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Hr, (hr) => hr.students)
  hr: Hr;
}

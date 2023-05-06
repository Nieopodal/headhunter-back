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

export enum ExpectedTypeWork {
  office = 'Na miejscu',
  move = 'Przeprowadzka',
  remote = 'Praca zdalna',
  hybrid = 'Praca hybrydowa',
  DM = 'Nie ma znaczenia',
}

export enum ExpectedContractType {
  B2B = 'Możliwe B2B',
  employ = 'Tylko umowa o pracę',
  contract = 'Umowa zlecenie / dzieło',
  none = 'Brak preferencji',
}


export enum StudentStatus {
  AVAILABLE = 'available',
  INTERVIEW = 'interview',
  EMPLOYED = 'employed'
}

export enum Active {
  ACTIVE = 'active',
  INACTIVE = 'inActive'
}

@Entity()
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255 })
  avatar: string;

  @Column({ length: 20, nullable: true })
  contactNumber: string;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 70 })
  lastName: string;

  @Column({ unique: true })
  githubUsername: string;

  @Column({ type: 'simple-array', nullable: true })
  portfolioUrls: string[];

  @Column({ type: 'simple-array', nullable: true })
  teamProjectUrls: string[];

  @Column({ type: 'simple-array', nullable: true })
  teamProjectPR: string[];

  @Column({ type: 'simple-array', nullable: true })
  projectUrls: string[];

  @Column({ default: 0 })
  courseCompletion: number;

  @Column({ default: 0 })
  courseEngagement: number;

  @Column({ default: 0 })
  projectDegree: number;

  @Column({ default: 0 })
  teamProjectDegree: number;

  @Column('simple-array', { nullable: true })
  bonusProjectUrls: string[];

  @Column({ length: 400, nullable: true })
  bio: string;

  @Column({ type: 'enum', enum: ExpectedTypeWork, default: ExpectedTypeWork.DM })
  expectedTypeWork: ExpectedTypeWork;

  @Column({ length: 60, nullable: true })
  targetWorkCity: string;

  @Column({ type: 'enum', enum: ExpectedContractType, default: ExpectedContractType.none })
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

  @Column({ type: 'enum', enum: Active, default: Active.inActive })
  active: Active;

  @Column({ default: 'student', length: 20 })
  role: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: true, default: null, length: 255 })
  accessToken: string;

  @Column({ nullable: true, default: null, length: 255 })
  refreshToken: string;

  @Column({ nullable: true, default: null, length: 255 })
  verificationToken: string;

  @Column({ length: 255, nullable: true, default: null })
  avatar: string | null;

  @Column({ length: 255, nullable: true, default: null })
  fullName: string | null;

  @Column({
    default: null,
    nullable: true,
    type: 'enum',
    enum: StudentStatus,
  })
  status: StudentStatus | null;

  @ManyToOne(type => Hr, entity => entity.hr)
  interviewBy: Hr;

  @Column({ default: null, nullable: true })
  reservationTime: Date | null;
}

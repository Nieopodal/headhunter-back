import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @Column({ default: 'dupa' })
  githubUsername: string;

  @Column('simple-array', { nullable: true })
  portfolioUrls: string[];

  @Column('simple-array', { default: '' })
  projectUrls: string[];

  @Column({ length: 255, nullable: true })
  bio: string;

  @Column({ type: 'enum', enum: ExpectedTypeWork, default: ExpectedTypeWork.DM })
  expectedTypeWork: ExpectedTypeWork;

  @Column({ length: 60, nullable: true })
  targetWorkCity: string;

  @Column({ type: 'enum', enum: ExpectedContractType, default: ExpectedContractType.none })
  expectedContractType: ExpectedContractType;

  @Column({ type: 'numeric', precision: 9, scale: 2, nullable: true })
  expectedSalary: number;

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

  @Column({ default: 0 })
  courseCompletion: number;

  @Column({ default: 0 })
  courseEngagement: number;

  @Column({ default: 0 })
  projectDegree: number;

  @Column({ default: 0 })
  teamProjectDegree: number;

  @Column('simple-array', { default: '' })
  bonusProjectUrls: string[];

  @Column({ default: false })
  active: boolean;

  @Column({ default: 'student', length: 20 })
  role: string;

  @Column({ nullable: true, default: null, length: 255 })
  refreshToken: string;

  @Column({ nullable: true, default: null, length: 255 })
  verificationToken: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

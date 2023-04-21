import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum ExpectedTypeWork {
  office = `Na miejscu`,
  move = 'Przeprowadzka',
  remote = 'Praca zdalna',
  hybrid = 'Praca hybrydowa',
  DM = 'Nie ma aznaczenia',
}

export enum ExpectedContractType {
  B2B = 'Możliwe B2B',
  employ = 'Tylko umowa o pracę',
  conrtract = 'Umowa zlecenie / dzieło',
  none = 'Brak preferencji',
}

@Entity()
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true, nullable: false })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 11, nullable: true })
  contactNumber: string;

  @Column({ length: 50, nullable: false })
  firstName: string;

  @Column({ length: 70, nullable: false })
  lastName: string;

  @Column({ unique: true })
  githubUsername: string;

  @Column({ type: 'simple-array', default: [] })
  portfolioUrls: string[];

  @Column()
  courseCompletion: number;

  @Column()
  courseEngagement: number;

  @Column()
  projectDegree: number;

  @Column()
  teamProjectDegree: number;

  @Column({ type: 'simple-array', default: [] })
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

  @Column({ default: false })
  active: boolean;

  @Column({ default: 'student' })
  role: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: true, default: null, length: 255 })
  token: string;

  @Column({ nullable: true, default: null, length: 255 })
  refreshToken: string;
}

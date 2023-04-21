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
  studentId: string;

  @Column({ length: 50, unique: true })
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

  @Column({ nullable: true, default: null })
  portfolioUrls: string[];

  @Column({ length: 400 })
  bio: string;

  @Column({ type: 'enum' })
  expectedTypeWork: ExpectedTypeWork;

  @Column({ length: 60 })
  targetWorkCity: string;

  @Column({ type: 'enum' })
  expectedContractType: ExpectedContractType;

  @Column({ type: 'numeric', length: 7 }) // maks 9 999 999
  expectedSalary: string;

  @Column({ default: false })
  canTakeApprenticeship: boolean;

  @Column({ default: 0 })
  monthsOfCommercialExp: number;

  @Column({ type: 'text' })
  education: string;

  @Column({ type: 'text' })
  workExperience: string;

  @Column({ type: 'text' })
  courses: string;

  @Column({ default: false })
  active: boolean;

  @Column({ default: 'user', length: 20 })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: '', length: 255, nullable: true })
  refreshToken: string;
}

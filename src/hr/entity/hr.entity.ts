import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class HeadHunter extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  studentId: string;

  @Column({
    unique: true,
    length: 255,
  })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'hr' })
  role: string;

  @Column({
    length: 150,
  })
  company: string;

  @Column()
  maxReservedStudents: number;

  @Column({ default: '', length: 255, nullable: true })
  refreshToken: string;
}
import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class HeadHunter extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    length: 50,
  })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ default: 'hr', lenght: 20 })
  role: string;

  @Column({
    length: 150,
  })
  company: string;

  @Column({ default: 0 })
  maxReservedStudents: number;

  @Column({ default: '', length: 255, nullable: true })
  refreshToken: string;
}

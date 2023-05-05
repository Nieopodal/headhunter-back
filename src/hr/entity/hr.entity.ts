import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../../student/entity/student.entity';

@Entity()
export class Hr extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    length: 255,
  })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255 })
  fullName: string;

  @Column({ default: 'hr', length: 20 })
  role: string;

  @Column({
    length: 150,
  })
  company: string;

  @Column({ default: 0 })
  maxReservedStudents: number;

  @Column({ default: '', length: 255, nullable: true })
  refreshToken: string;

  @OneToMany((type) => Student, (entity) => entity.interviewBy)
  hr: Student[];
}

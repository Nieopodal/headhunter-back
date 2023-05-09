import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @Column({ length: 255, default: '' })
  password: string;

  @Column({ length: 255 })
  fullName: string;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Column({ length: 20, default: 'hr' })
  role: string;

  @Column({
    length: 150,
  })
  company: string;

  @Column({ default: 0 })
  maxReservedStudents: number;

  @Column({ length: 255, nullable: true, default: '' })
  refreshToken: string;

  @Column({ length: 255, nullable: true, default: null })
  verificationToken: string;

  @Column({ default: '', length: 255 })
  activationUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Student, (student) => student.hr)
  students: Student[];
}

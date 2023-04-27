import { Student } from 'src/student/entity/student.entity';
import {
  BaseEntity,
  Column,
  Index,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class InitStudentData extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column()
  courseCompletion: number;

  @Column()
  courseEngagment: number;

  @Column()
  projectDegree: number;

  @Column()
  teamProjectDegree: number;

  @Column({ nullable: true, default: null })
  bonusProjectUrls: string;

  @Column({ default: '', length: 255, nullable: true })
  @Index()
  emailToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne((type) => Student, (entity) => entity.id)
  @JoinColumn()
  student: Student;
}

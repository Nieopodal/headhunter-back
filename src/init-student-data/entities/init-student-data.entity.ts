import { Student } from 'src/student/entities/student.entity';
import { BaseEntity, Column, Index, CreateDateColumn, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';

class Url {
  url: string;
}

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
  bonusProjectUrls: Url[];

  @Column({ default: '', length: 255, nullable: true })
  @Index()
  registerToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(type => Student, entity => entity.id)
  @JoinColumn()
  student: Student;
}

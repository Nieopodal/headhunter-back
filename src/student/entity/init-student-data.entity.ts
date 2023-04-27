import { BaseEntity, Column, Index, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InitStudentData extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column()
  courseCompletion: number;

  @Column()
  courseEngagement: number;

  @Column()
  projectDegree: number;

  @Column()
  teamProjectDegree: number;

  @Column({ nullable: true, default: null })
  bonusProjectUrls: string;

  @Column({ default: null, length: 255, nullable: true })
  emailToken: string;

  @CreateDateColumn()
  createdAt: Date;
}

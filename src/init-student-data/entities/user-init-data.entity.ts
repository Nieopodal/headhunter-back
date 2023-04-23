import { BaseEntity, Column, Index, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

class Url {
    url : string;
}

@Entity()
export class UserInitData extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  initUserDataId: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column()
  courseCompletion : number;

  @Column()
  courseEngagment: number;

  @Column()
  projectDegree : number;

  @Column()
  teamProjectDegree : number;

  @Column({ nullable: true, default: null })
  bonusProjectUrls: Url[];

  @Column({ default: '', length: 255, nullable: true })
  @Index()
  registerToken: string;

  @CreateDateColumn()
  createdAt: Date;

}

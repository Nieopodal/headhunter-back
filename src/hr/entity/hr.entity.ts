import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hr extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    length: 50,
  })
  email: string;

  @Column({ length: 255 })
  fullName: string;

  @Column({ length: 255 })
  password: string;

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
}

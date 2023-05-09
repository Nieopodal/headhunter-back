import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '@Types';

@Entity()
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ default: UserRole.ADMIN, length: 20, enum: UserRole })
  role: UserRole;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: '', length: 255, nullable: true })
  refreshToken: string;
}

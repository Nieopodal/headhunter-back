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

  @Column({ type: 'enum', default: UserRole.ADMIN, enum: UserRole })
  role: UserRole;

  @Column({ default: '', length: 255, nullable: true })
  refreshToken: string;

  @Column({ default: '', length: 255, nullable: true })
  verificationToken: string;

  @Column({ default: '', length: 255 })
  activationUrl: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}

/**
 * User Entity
 * 
 * Domain entity for user authentication and authorization
 */
import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string; // Hashed password

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken?: string; // Hashed refresh token

  @Column({ type: 'timestamp', nullable: true })
  refreshTokenExpiresAt?: Date;

  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim() || this.username;
  }
}


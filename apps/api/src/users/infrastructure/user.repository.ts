/**
 * User Repository
 * 
 * Infrastructure layer - Data access
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { BaseRepository } from '../../common/database/base.repository';
import { validateString } from '@rp-release-planner/rp-shared';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(userData: Partial<User>): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  save(user: User): Promise<User>;
}

@Injectable()
export class UserRepository
  extends BaseRepository<User, string>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    protected override readonly repository: Repository<User>,
  ) {
    super(repository);
  }

  async findByEmail(email: string): Promise<User | null> {
    // Defensive: Validate email before query
    validateString(email, 'Email');
    
    // Normalize email (trim and lowercase) before querying
    const normalizedEmail = email.trim().toLowerCase();
    
    // Don't query if normalized email is empty
    if (normalizedEmail.length === 0) {
      return null;
    }
    
    return this.handleDatabaseOperation(
      () => this.repository.findOne({ where: { email: normalizedEmail } }),
      `findByEmail(${normalizedEmail})`,
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    // Defensive: Validate username before query
    validateString(username, 'Username');
    
    // Normalize username (trim) before querying
    const normalizedUsername = username.trim();
    
    // Don't query if normalized username is empty
    if (normalizedUsername.length === 0) {
      return null;
    }
    
    return this.handleDatabaseOperation(
      () => this.repository.findOne({ where: { username: normalizedUsername } }),
      `findByUsername(${normalizedUsername})`,
    );
  }
}


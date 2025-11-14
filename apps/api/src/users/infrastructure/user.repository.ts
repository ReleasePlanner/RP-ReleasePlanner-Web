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
    return this.handleDatabaseOperation(
      () => this.repository.findOne({ where: { email } }),
      `findByEmail(${email})`,
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.handleDatabaseOperation(
      () => this.repository.findOne({ where: { username } }),
      `findByUsername(${username})`,
    );
  }
}


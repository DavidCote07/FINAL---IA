import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(username: string, password: string, role?: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, password: hashed, role });
    return this.usersRepository.save(user);
  }
}

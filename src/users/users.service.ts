import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, UpdateUserInput, User } from 'src/graphql';
import { User as UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    return this.usersRepository.save(createUserInput);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User:${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);

    // Merge object and ignore null values
    const merged = {};
    Object.keys({ ...user, ...updateUserInput }).map((key) => {
      merged[key] =
        updateUserInput[key] !== null ? updateUserInput[key] : user[key];
    });

    return this.usersRepository.save(merged);
  }

  async remove(id: string): Promise<string> {
    const user = await this.findOne(id);

    this.usersRepository.remove(user);
    return user.id;
  }
}

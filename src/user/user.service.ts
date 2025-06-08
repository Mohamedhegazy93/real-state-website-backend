import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    try {
      const user = await this.usersRepository.findOneBy({ email: email });
      if (user) {
        throw new ConflictException('User with this email already exists');
      }
      const createUser = this.usersRepository.create(createUserDto);
      const saveUser = await this.usersRepository.save(createUser);
      return {
        message: 'user created',
        user: saveUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    const users = await this.usersRepository.find({
      relations: ['refreshToken'],
    });
    if (!users) {
      throw new NotFoundException('no users founded');
    }
    return {
      length: users.length,
      users,
    };
  }

  async getUser(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`no user for ${id} id`);
    }
    return {
      user,
    };
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) throw new NotFoundException(`No user found with ID: ${id}`);

      this.usersRepository.merge(user, updateUserDto);
      await this.usersRepository.save(user);
      return { message: 'user updated successfully', user };
    } catch (error) {
      throw error;
    }
  }

  async removeUser(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`no user for ${id} id`);

    await this.usersRepository.remove(user);
    return {
      message: 'user deleted sucessfully',
    };
  }
}

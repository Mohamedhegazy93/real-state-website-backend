import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
export declare class UserService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    createUser(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: User;
    }>;
    getAllUsers(): Promise<{
        length: number;
        users: User[];
    }>;
    getUser(id: number): Promise<{
        user: User;
    }>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        user: User;
    }>;
    removeUser(id: number): Promise<{
        message: string;
    }>;
}

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: import("./entities/user.entity").User;
    }>;
    getAllUsers(): Promise<{
        length: number;
        users: import("./entities/user.entity").User[];
    }>;
    getUser(id: number): Promise<{
        user: import("./entities/user.entity").User;
    }>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        user: import("./entities/user.entity").User;
    }>;
    removeUser(id: number): Promise<{
        message: string;
    }>;
}

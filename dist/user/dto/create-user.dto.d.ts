import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: UserRole;
}

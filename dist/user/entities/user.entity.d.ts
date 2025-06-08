import { Property } from '../../property/entities/property.entity';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MANAGER = "manager"
}
export declare class User {
    id: number;
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: UserRole;
    properties: Property[];
    refreshToken: RefreshToken;
    hashPassword(): Promise<void>;
}

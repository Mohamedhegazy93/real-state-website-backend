import { User } from '../../user/entities/user.entity';
export declare class RefreshToken {
    refreshToken: string;
    user: User;
    userId: number;
    expiresAt: Date;
}

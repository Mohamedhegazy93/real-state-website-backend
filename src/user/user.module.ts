import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,RefreshToken])],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserModule]
})
export class UserModule {}

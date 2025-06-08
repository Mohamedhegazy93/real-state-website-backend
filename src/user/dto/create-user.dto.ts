import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  @ApiProperty()
  userName: string;
  @IsNotEmpty()
  @IsEmail()
  @Length(10, 50)
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  @ApiProperty()
  password: string;
  @IsPhoneNumber('EG')
  @MinLength(11, { message: 'phone number must be 11 at least nunbers' })
  @MaxLength(11, { message: 'phone number must be 11 at most nunbers' })
  @NotContains(' ', { message: 'no space allowed' })
  @ApiProperty()
  phoneNumber: string;


  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty()
  role: UserRole;
}

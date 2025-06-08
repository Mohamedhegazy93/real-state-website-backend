import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  Length,
  NotContains,
  MaxLength,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  @ApiProperty()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsPhoneNumber('EG')
  @MinLength(11, { message: 'phone number must be 11 at least numbers' })
  @MaxLength(11, { message: 'phone number must be 11 at most numbers' })
  @NotContains(' ', { message: 'no space allowed' })
  @IsOptional()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  @MaxLength(80)
  @NotContains(' ', { message: 'no space allowed' })
  @ApiProperty()
  password: string;
}

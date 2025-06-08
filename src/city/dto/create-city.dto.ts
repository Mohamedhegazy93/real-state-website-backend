import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCityDto {
  @ApiProperty()
  @IsString({ message: 'City name must be a string' })
  @IsNotEmpty({ message: 'City name cannot be empty' })
  @Length(4, 20, { message: 'City name must be between 4 and 20 characters' })
  city_name:string;
}

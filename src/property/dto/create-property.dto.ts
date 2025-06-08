import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  Length,
  IsOptional,
  IsPositive,
  Min,
  IsInt,
  Max,
} from 'class-validator';
import { PropertyStatus, PropertyType } from '../entities/property.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @Length(4, 50, { message: 'Title must be between 4 and 50 characters' })
  @ApiProperty()
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @Length(20, 500, { message: 'Description must be between 20 and 500 characters' })
  @ApiProperty()
  description: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price is required' })
  @IsPositive({ message: 'Price must be a positive number' })
  @IsOptional()
  @ApiProperty()
  price: number;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Area must be a number' })
  @IsNotEmpty({ message: 'Area is required' })
  @IsPositive({ message: 'Area must be a positive number' })
  @Min(0, { message: 'Area cannot be negative' })
  @ApiProperty()
  area: number;

  @IsInt({ message: 'Rooms must be an integer' })
  @IsOptional()
  @Min(1, { message: 'Rooms must be at least 1' })
  @Max(20, { message: 'Rooms cannot exceed 20' })
  @ApiProperty()
  rooms: number;

  @IsEnum(PropertyStatus, { message: 'status must be available or sold' })
  @ApiProperty()
  status: PropertyStatus;

  @IsEnum(PropertyType, { message: 'property type must be apartment or villa or land' })
  @ApiProperty()
  property_type: PropertyType;

  @IsInt({ message: 'Neighborhood ID must be an integer' })
  @IsNotEmpty({ message: 'Neighborhood ID is required' })
  @ApiProperty()
  neighborhood_id: number;

}

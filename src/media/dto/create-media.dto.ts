import { IsEnum, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { MediaType } from '../entities/media.entity';

export class CreateMediaDto {
  @IsEnum(MediaType)
  media_type: MediaType;

  @IsString()
  @IsNotEmpty()
  media_url: string;
  @IsNumber()
  @IsNotEmpty()
  property_id: number;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Property } from '../../property/entities/property.entity';
import { City } from '../../city/entities/city.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  media_id: number;

  @Column({
    type: 'enum',
    enum: MediaType,
    default: MediaType.IMAGE,
  })
  media_type: MediaType;

  @Column()
  media_url: string;

  @ManyToOne(() => Property, (property) => property.media)
  property: Property;
  @ManyToOne(() => City, (city) => city.media)
  city: City;
}
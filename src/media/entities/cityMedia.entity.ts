import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { City } from '../../city/entities/city.entity';
import { MediaType } from './media.entity';

@Entity()
export class CityMedia {
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

  @Column({ nullable: true })
  public_id: string;

  @ManyToOne(() => City, (city) => city.media,{onDelete:'CASCADE'})
  city: City;
}

import { Media } from '../../media/entities/media.entity';
import { Neighborhood } from '../../neighborhood/entities/neighborhood.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CityMedia } from '../../media/entities/cityMedia.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  city_id: number;

  @Column({ nullable: false, unique: true, length: 20 })
  city_name: string;

  @OneToMany(() => Neighborhood, (neighborhood) => neighborhood.city)
  neighborhoods: Neighborhood[];

  @OneToMany(() => CityMedia, (media) => media.city,{onDelete:'CASCADE'})
  media: Media[];
}

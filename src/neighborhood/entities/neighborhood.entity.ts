import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { City } from '../../city/entities/city.entity';
import { Property } from '../../property/entities/property.entity';
import { NeighborhoodMedia } from '../../media/entities/neighborhoodMedia.entity';
import { Media } from '../../media/entities/media.entity';

@Entity()
export class Neighborhood {
  @PrimaryGeneratedColumn()
  neighborhood_id: number;

  @Column({nullable:false,length:50})
  neighborhood_name: string;

  @ManyToOne(() => City, (city) => city.neighborhoods,{onDelete:'RESTRICT'})
  @JoinColumn({ name: 'city_id' })
  city: City;
  @OneToMany(() => Property, (property) => property.neighborhood,{onDelete:'RESTRICT'})
  properties: Property[];
  
  @OneToMany(() => NeighborhoodMedia, (media) => media.neighborhood)
  media: Media[];


 
}
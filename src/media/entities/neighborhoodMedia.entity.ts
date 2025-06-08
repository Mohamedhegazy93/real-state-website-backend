import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MediaType } from './media.entity';
import { Neighborhood } from '../../neighborhood/entities/neighborhood.entity';

@Entity()
export class NeighborhoodMedia {
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

  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.media,{onDelete:'CASCADE'})
  neighborhood: Neighborhood;
}

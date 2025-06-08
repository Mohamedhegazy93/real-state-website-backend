import { MediaType } from './media.entity';
import { Neighborhood } from '../../neighborhood/entities/neighborhood.entity';
export declare class NeighborhoodMedia {
    media_id: number;
    media_type: MediaType;
    media_url: string;
    public_id: string;
    neighborhood: Neighborhood;
}

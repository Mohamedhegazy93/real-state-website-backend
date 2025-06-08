import { Media } from '../../media/entities/media.entity';
import { Neighborhood } from '../../neighborhood/entities/neighborhood.entity';
export declare class City {
    city_id: number;
    city_name: string;
    neighborhoods: Neighborhood[];
    media: Media[];
}

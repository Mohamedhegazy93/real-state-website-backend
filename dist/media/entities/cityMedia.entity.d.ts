import { City } from '../../city/entities/city.entity';
import { MediaType } from './media.entity';
export declare class CityMedia {
    media_id: number;
    media_type: MediaType;
    media_url: string;
    public_id: string;
    city: City;
}

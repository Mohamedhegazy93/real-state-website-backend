import { Property } from '../../property/entities/property.entity';
import { City } from '../../city/entities/city.entity';
export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video"
}
export declare class Media {
    media_id: number;
    media_type: MediaType;
    media_url: string;
    property: Property;
    city: City;
}

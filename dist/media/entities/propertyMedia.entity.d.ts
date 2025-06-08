import { Property } from '../../property/entities/property.entity';
export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video"
}
export declare class PropertyMedia {
    media_id: number;
    media_type: MediaType;
    media_url: string;
    public_id: string;
    property: Property;
}

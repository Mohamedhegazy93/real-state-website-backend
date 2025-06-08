import { Neighborhood } from '../../neighborhood/entities/neighborhood.entity';
import { User } from '../../user/entities/user.entity';
import { Media } from '../../media/entities/media.entity';
export declare enum PropertyStatus {
    AVAILABLE = "available",
    SOLD = "sold"
}
export declare enum PropertyType {
    APARTMENT = "apartment",
    VILLA = "villa",
    LAND = "land"
}
export declare class Property {
    property_id: number;
    title: string;
    description: string;
    price: number;
    area: number;
    rooms: number;
    status: PropertyStatus;
    property_type: PropertyType;
    created_at: Date;
    updated_at: Date;
    neighborhood: Neighborhood;
    user: User;
    media: Media[];
}

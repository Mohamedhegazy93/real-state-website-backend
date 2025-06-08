import { PropertyStatus, PropertyType } from '../entities/property.entity';
export declare class CreatePropertyDto {
    title: string;
    description: string;
    price: number;
    area: number;
    rooms: number;
    status: PropertyStatus;
    property_type: PropertyType;
    neighborhood_id: number;
}

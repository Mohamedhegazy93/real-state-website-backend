import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
export declare class PropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    createProperty(createPropertyDto: CreatePropertyDto, req: any): Promise<{
        message: string;
        property: import("./entities/property.entity").Property;
    }>;
    uploadPropertyFiles(id: number, files: Express.Multer.File[], req: any): Promise<{
        message: string;
    }>;
    findAllProperties(): Promise<{
        propertys: import("./entities/property.entity").Property[];
    }>;
    findPropertyFiles(id: number): Promise<{
        propertyFiles: import("../media/entities/propertyMedia.entity").PropertyMedia[];
    }>;
    findOneProperty(id: string): Promise<{
        property: import("./entities/property.entity").Property;
    }>;
    updateProperty(id: string, updatePropertyDto: UpdatePropertyDto): Promise<import("./entities/property.entity").Property>;
    removeProperty(id: number): Promise<{
        message: string;
    }>;
    deletePropertyFiles(id: number, filesIds: number[]): Promise<{
        message: string;
    }>;
}

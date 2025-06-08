import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
import { Neighborhood } from '../neighborhood/entities/neighborhood.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { PropertyMedia } from '../media/entities/propertyMedia.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class PropertyService {
    private propertyRepository;
    private neighborhoodRepository;
    private userRepository;
    private propertyMediaRepository;
    private cloudinaryService;
    constructor(propertyRepository: Repository<Property>, neighborhoodRepository: Repository<Neighborhood>, userRepository: Repository<User>, propertyMediaRepository: Repository<PropertyMedia>, cloudinaryService: CloudinaryService);
    createProperty(createPropertyDto: CreatePropertyDto, payload: any): Promise<{
        message: string;
        property: Property;
    }>;
    uploadPropertyFiles(id: number, files: Express.Multer.File[]): Promise<{
        message: string;
    }>;
    findPropertyFiles(id: number): Promise<{
        propertyFiles: PropertyMedia[];
    }>;
    findAllProperties(): Promise<{
        propertys: Property[];
    }>;
    findOneProperty(id: number): Promise<{
        property: Property;
    }>;
    updateProperty(id: number, updatePropertyDto: UpdatePropertyDto): Promise<Property>;
    deletePropertyFiles(id: number, filesIds: number[]): Promise<{
        message: string;
    }>;
    removeProperty(id: number): Promise<{
        message: string;
    }>;
}

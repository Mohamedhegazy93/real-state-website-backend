import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';
import { Neighborhood } from './entities/neighborhood.entity';
import { Repository } from 'typeorm';
import { City } from '../city/entities/city.entity';
import { NeighborhoodMedia } from '../media/entities/neighborhoodMedia.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class NeighborhoodService {
    private readonly neighborhoodRepository;
    private readonly cityRepository;
    private readonly neighborhoodMediaRepository;
    private cloudinaryService;
    constructor(neighborhoodRepository: Repository<Neighborhood>, cityRepository: Repository<City>, neighborhoodMediaRepository: Repository<NeighborhoodMedia>, cloudinaryService: CloudinaryService);
    create(createNeighborhoodDto: CreateNeighborhoodDto): Promise<{
        message: string;
        neighborhood: Neighborhood;
    }>;
    uploadNeighborhoodImages(id: number, files: Express.Multer.File[]): Promise<{
        message: string;
    }>;
    deleteNeighborhoodImages(id: number, filesIds: number[]): Promise<{
        message: string;
    }>;
    findAll(): Promise<{
        length: number;
        neighborhoods: Neighborhood[];
    }>;
    findNeighborhoodsOfCity(city_id: number): Promise<{
        length: number;
        neigbohoods: Neighborhood[];
    }>;
    findOne(id: number): Promise<{
        neighborhood: Neighborhood;
    }>;
    update(id: number, updateNeighborhoodDto: UpdateNeighborhoodDto): Promise<{
        messgae: string;
        neighborhood: Neighborhood;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}

import { NeighborhoodService } from './neighborhood.service';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';
export declare class NeighborhoodController {
    private readonly neighborhoodService;
    constructor(neighborhoodService: NeighborhoodService);
    create(createNeighborhoodDto: CreateNeighborhoodDto): Promise<{
        message: string;
        neighborhood: import("./entities/neighborhood.entity").Neighborhood;
    }>;
    uploadNeighborhoodImages(id: number, files: Express.Multer.File[]): Promise<{
        message: string;
    }>;
    deleteNeighborhoodImages(id: number, filesIds: number[]): Promise<{
        message: string;
    }>;
    findAll(): Promise<{
        length: number;
        neighborhoods: import("./entities/neighborhood.entity").Neighborhood[];
    }>;
    findNeighborhoodsOfCity(city_id: number): Promise<{
        length: number;
        neigbohoods: import("./entities/neighborhood.entity").Neighborhood[];
    }>;
    findOne(id: number): Promise<{
        neighborhood: import("./entities/neighborhood.entity").Neighborhood;
    }>;
    update(id: number, updateNeighborhoodDto: UpdateNeighborhoodDto): Promise<{
        messgae: string;
        neighborhood: import("./entities/neighborhood.entity").Neighborhood;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}

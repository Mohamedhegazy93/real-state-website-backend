import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { CityMedia } from '../media/entities/cityMedia.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class CityService {
    private readonly cityRepository;
    private cityMediaRepository;
    private cloudinaryService;
    constructor(cityRepository: Repository<City>, cityMediaRepository: Repository<CityMedia>, cloudinaryService: CloudinaryService);
    create(createCityDto: CreateCityDto): Promise<{
        message: string;
        city: City;
    }>;
    uploadCityImages(id: number, files: Express.Multer.File[]): Promise<{
        message: string;
    }>;
    deleteCityImages(id: number, filesIds: number[]): Promise<{
        message: string;
    }>;
    getAllcities(city_name?: string): Promise<{
        length: number;
        cities: City[];
    }>;
    findCity(id: number): Promise<{
        city: City;
    }>;
    updateCity(id: number, updateCityDto: UpdateCityDto): Promise<{
        message: string;
        city: City;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}

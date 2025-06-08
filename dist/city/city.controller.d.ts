import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
export declare class CityController {
    private readonly cityService;
    constructor(cityService: CityService);
    create(createCityDto: CreateCityDto): Promise<{
        message: string;
        city: import("./entities/city.entity").City;
    }>;
    uploadCityImages(id: number, files: Express.Multer.File[]): Promise<{
        message: string;
    }>;
    deleteCityImages(id: number, filesIds: number[]): Promise<{
        message: string;
    }>;
    getAllcities(city_name?: string): Promise<{
        length: number;
        cities: import("./entities/city.entity").City[];
    }>;
    findCity(id: number): Promise<{
        city: import("./entities/city.entity").City;
    }>;
    updateCity(id: number, updateCityDto: UpdateCityDto): Promise<{
        message: string;
        city: import("./entities/city.entity").City;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}

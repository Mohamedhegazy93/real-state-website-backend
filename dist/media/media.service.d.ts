import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Repository } from 'typeorm';
import { Media } from './entities/media.entity';
export declare class MediaService {
    private readonly mediaRepository;
    constructor(mediaRepository: Repository<Media>);
    create(createMediaDto: CreateMediaDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateMediaDto: UpdateMediaDto): string;
    remove(id: number): string;
}

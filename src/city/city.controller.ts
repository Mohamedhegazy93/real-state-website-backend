import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  // POST : ~/city
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new city' })
  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }
  // POST : ~/city/:id/uploadImages
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post(':id/uploadImages')
  @ApiOperation({ summary: 'Upload images for a specific city' })
  @UseInterceptors(FilesInterceptor('files'))
  uploadCityImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.cityService.uploadCityImages(id, files);
  }
  // DELETE : ~/city/:id/deleteImages
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id/deleteImages')
  @ApiOperation({ summary: 'Delete specific images for a city' })
  deleteCityImages(
    @Param('id', ParseIntPipe) id: number,
    @Body('filesIds') filesIds: number[],
  ) {
    return this.cityService.deleteCityImages(id, filesIds);
  }

  // GET : ~/city
  @Get()
  @ApiOperation({ summary: 'Get all cities, optionally filtered by name' })
  @ApiQuery({
    name: 'city_name',
    required: false,
    description: 'Filter cities by name',
  })
  getAllcities(@Query('city_name') city_name?: string) {
    return this.cityService.getAllcities(city_name);
  }

  // GET : ~/city/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific city by ID' })
  findCity(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.findCity(id);
  }
  // UPDATE : ~/city/:id
  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific city by ID' })
  updateCity(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.cityService.updateCity(id, updateCityDto);
  }
  // DELETE : ~/city/:id
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific city by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.remove(id);
  }
}
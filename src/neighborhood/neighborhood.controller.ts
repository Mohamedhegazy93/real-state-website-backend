import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { NeighborhoodService } from './neighborhood.service';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserRole } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiOperation } from '@nestjs/swagger';
@Roles(UserRole.MANAGER,UserRole.ADMIN)
@Controller('neighborhood')
export class NeighborhoodController {
  constructor(private readonly neighborhoodService: NeighborhoodService) {}
  // POST : ~/neighborhood
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new neighborhood' })
  create(@Body() createNeighborhoodDto: CreateNeighborhoodDto) {
    return this.neighborhoodService.create(createNeighborhoodDto);
  }
  @UseGuards(AuthGuard)
  @Post(':id/uploadImages')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Upload images for a specific neighborhood' })
  uploadNeighborhoodImages(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.neighborhoodService.uploadNeighborhoodImages(id, files);
  }
  // DELETE : ~/city/:id/deleteImages
  @UseGuards(AuthGuard)
  @Delete(':id/deleteImages')
  @ApiOperation({ summary: 'Delete specific images for a neighborhood' })
  deleteNeighborhoodImages(
    @Param('id', ParseIntPipe) id: number,
    @Body('filesIds') filesIds: number[],
  ) {
    return this.neighborhoodService.deleteNeighborhoodImages(id, filesIds);
  }
  // GET : ~/neighborhood
  @Get()
  @ApiOperation({ summary: 'Get all neighborhoods' })
  findAll() {
    return this.neighborhoodService.findAll();
  }
  // GET : ~/neighborhood/city_id/neighborhoods

  @Get(':city_id/neighborhoods')
  @ApiOperation({ summary: 'Get all neighborhoods within a specific city' })
  findNeighborhoodsOfCity(@Param('city_id', ParseIntPipe) city_id: number) {
    return this.neighborhoodService.findNeighborhoodsOfCity(city_id);
  }
  // GET : ~/neighborhood/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific neighborhood by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.neighborhoodService.findOne(id);
  }
  // UPDATE : ~/neighborhood/:id
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific neighborhood by ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNeighborhoodDto: UpdateNeighborhoodDto,
  ) {
    return this.neighborhoodService.update(id, updateNeighborhoodDto);
  }
  // DELETE : ~/neighborhood/:id
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific neighborhood by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.neighborhoodService.remove(id);
  }
}
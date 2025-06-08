import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}
  // POST ~/property
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new property' })
  createProperty(@Body() createPropertyDto: CreatePropertyDto, @Req() req) {
    return this.propertyService.createProperty(createPropertyDto, req.user);
  }
  // POST ~/property/:id/uploadFiles
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Post(':id/uploadFiles')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Upload files for a specific property' })
  uploadPropertyFiles(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    return this.propertyService.uploadPropertyFiles(id, files);
  }
  // GET ~/property
  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  findAllProperties() {
    return this.propertyService.findAllProperties();
  }
  // POST ~/property/:id/files
  @Get(':id/files')
  @ApiOperation({ summary: 'Get files associated with a specific property' })
  findPropertyFiles(@Param('id') id: number) {
    return this.propertyService.findPropertyFiles(id);
  }
  // POST ~/property/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific property by ID' })
  findOneProperty(@Param('id') id: string) {
    return this.propertyService.findOneProperty(+id);
  }
  // PATCH ~/property/:id
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific property by ID' })
  updateProperty(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.updateProperty(+id, updatePropertyDto);
  }
  // DELETE ~/property/:id
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific property by ID' })
  removeProperty(@Param('id') id: number) {
    return this.propertyService.removeProperty(id);
  }
  // DELETE ~/property/:id/deleteFiles
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Delete(':id/deleteFiles')
  @ApiOperation({ summary: 'Delete specific files associated with a property' })
  async deletePropertyFiles(
    @Param('id') id: number,
    @Body('filesIds') filesIds: number[],
  ) {
    return this.propertyService.deletePropertyFiles(id, filesIds);
  }
}
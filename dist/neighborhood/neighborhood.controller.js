"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeighborhoodController = void 0;
const common_1 = require("@nestjs/common");
const neighborhood_service_1 = require("./neighborhood.service");
const create_neighborhood_dto_1 = require("./dto/create-neighborhood.dto");
const update_neighborhood_dto_1 = require("./dto/update-neighborhood.dto");
const platform_express_1 = require("@nestjs/platform-express");
const auth_guard_1 = require("../auth/guards/auth.guard");
const user_entity_1 = require("../user/entities/user.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let NeighborhoodController = class NeighborhoodController {
    neighborhoodService;
    constructor(neighborhoodService) {
        this.neighborhoodService = neighborhoodService;
    }
    create(createNeighborhoodDto) {
        return this.neighborhoodService.create(createNeighborhoodDto);
    }
    uploadNeighborhoodImages(id, files) {
        return this.neighborhoodService.uploadNeighborhoodImages(id, files);
    }
    deleteNeighborhoodImages(id, filesIds) {
        return this.neighborhoodService.deleteNeighborhoodImages(id, filesIds);
    }
    findAll() {
        return this.neighborhoodService.findAll();
    }
    findNeighborhoodsOfCity(city_id) {
        return this.neighborhoodService.findNeighborhoodsOfCity(city_id);
    }
    findOne(id) {
        return this.neighborhoodService.findOne(id);
    }
    update(id, updateNeighborhoodDto) {
        return this.neighborhoodService.update(id, updateNeighborhoodDto);
    }
    remove(id) {
        return this.neighborhoodService.remove(id);
    }
};
exports.NeighborhoodController = NeighborhoodController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new neighborhood' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_neighborhood_dto_1.CreateNeighborhoodDto]),
    __metadata("design:returntype", void 0)
], NeighborhoodController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(':id/uploadImages'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload images for a specific neighborhood' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", void 0)
], NeighborhoodController.prototype, "uploadNeighborhoodImages", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)(':id/deleteImages'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete specific images for a neighborhood' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('filesIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", void 0)
], NeighborhoodController.prototype, "deleteNeighborhoodImages", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all neighborhoods' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NeighborhoodController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':city_id/neighborhoods'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all neighborhoods within a specific city' }),
    __param(0, (0, common_1.Param)('city_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NeighborhoodController.prototype, "findNeighborhoodsOfCity", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific neighborhood by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NeighborhoodController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a specific neighborhood by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_neighborhood_dto_1.UpdateNeighborhoodDto]),
    __metadata("design:returntype", void 0)
], NeighborhoodController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specific neighborhood by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NeighborhoodController.prototype, "remove", null);
exports.NeighborhoodController = NeighborhoodController = __decorate([
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.ADMIN),
    (0, common_1.Controller)('neighborhood'),
    __metadata("design:paramtypes", [neighborhood_service_1.NeighborhoodService])
], NeighborhoodController);
//# sourceMappingURL=neighborhood.controller.js.map
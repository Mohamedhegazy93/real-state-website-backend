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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePropertyDto = void 0;
const class_validator_1 = require("class-validator");
const property_entity_1 = require("../entities/property.entity");
const swagger_1 = require("@nestjs/swagger");
class CreatePropertyDto {
    title;
    description;
    price;
    area;
    rooms;
    status;
    property_type;
    neighborhood_id;
}
exports.CreatePropertyDto = CreatePropertyDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Title must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title is required' }),
    (0, class_validator_1.Length)(4, 50, { message: 'Title must be between 4 and 50 characters' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(20, 500, { message: 'Description must be between 20 and 500 characters' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false }, { message: 'Price must be a number' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Price is required' }),
    (0, class_validator_1.IsPositive)({ message: 'Price must be a positive number' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false }, { message: 'Area must be a number' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Area is required' }),
    (0, class_validator_1.IsPositive)({ message: 'Area must be a positive number' }),
    (0, class_validator_1.Min)(0, { message: 'Area cannot be negative' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "area", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Rooms must be an integer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1, { message: 'Rooms must be at least 1' }),
    (0, class_validator_1.Max)(20, { message: 'Rooms cannot exceed 20' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "rooms", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(property_entity_1.PropertyStatus, { message: 'status must be available or sold' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(property_entity_1.PropertyType, { message: 'property type must be apartment or villa or land' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "property_type", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Neighborhood ID must be an integer' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Neighborhood ID is required' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreatePropertyDto.prototype, "neighborhood_id", void 0);
//# sourceMappingURL=create-property.dto.js.map
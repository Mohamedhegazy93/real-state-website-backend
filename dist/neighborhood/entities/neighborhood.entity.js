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
exports.Neighborhood = void 0;
const typeorm_1 = require("typeorm");
const city_entity_1 = require("../../city/entities/city.entity");
const property_entity_1 = require("../../property/entities/property.entity");
const neighborhoodMedia_entity_1 = require("../../media/entities/neighborhoodMedia.entity");
let Neighborhood = class Neighborhood {
    neighborhood_id;
    neighborhood_name;
    city;
    properties;
    media;
};
exports.Neighborhood = Neighborhood;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Neighborhood.prototype, "neighborhood_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, length: 50 }),
    __metadata("design:type", String)
], Neighborhood.prototype, "neighborhood_name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => city_entity_1.City, (city) => city.neighborhoods, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'city_id' }),
    __metadata("design:type", city_entity_1.City)
], Neighborhood.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => property_entity_1.Property, (property) => property.neighborhood, { onDelete: 'RESTRICT' }),
    __metadata("design:type", Array)
], Neighborhood.prototype, "properties", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => neighborhoodMedia_entity_1.NeighborhoodMedia, (media) => media.neighborhood),
    __metadata("design:type", Array)
], Neighborhood.prototype, "media", void 0);
exports.Neighborhood = Neighborhood = __decorate([
    (0, typeorm_1.Entity)()
], Neighborhood);
//# sourceMappingURL=neighborhood.entity.js.map
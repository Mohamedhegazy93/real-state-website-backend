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
exports.CityMedia = void 0;
const typeorm_1 = require("typeorm");
const city_entity_1 = require("../../city/entities/city.entity");
const media_entity_1 = require("./media.entity");
let CityMedia = class CityMedia {
    media_id;
    media_type;
    media_url;
    public_id;
    city;
};
exports.CityMedia = CityMedia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CityMedia.prototype, "media_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: media_entity_1.MediaType,
        default: media_entity_1.MediaType.IMAGE,
    }),
    __metadata("design:type", String)
], CityMedia.prototype, "media_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CityMedia.prototype, "media_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CityMedia.prototype, "public_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => city_entity_1.City, (city) => city.media, { onDelete: 'CASCADE' }),
    __metadata("design:type", city_entity_1.City)
], CityMedia.prototype, "city", void 0);
exports.CityMedia = CityMedia = __decorate([
    (0, typeorm_1.Entity)()
], CityMedia);
//# sourceMappingURL=cityMedia.entity.js.map
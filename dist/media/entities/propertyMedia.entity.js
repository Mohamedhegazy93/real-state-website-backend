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
exports.PropertyMedia = exports.MediaType = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("../../property/entities/property.entity");
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "image";
    MediaType["VIDEO"] = "video";
})(MediaType || (exports.MediaType = MediaType = {}));
let PropertyMedia = class PropertyMedia {
    media_id;
    media_type;
    media_url;
    public_id;
    property;
};
exports.PropertyMedia = PropertyMedia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PropertyMedia.prototype, "media_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MediaType,
        default: MediaType.IMAGE,
    }),
    __metadata("design:type", String)
], PropertyMedia.prototype, "media_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PropertyMedia.prototype, "media_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PropertyMedia.prototype, "public_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.media, { onDelete: 'CASCADE' }),
    __metadata("design:type", property_entity_1.Property)
], PropertyMedia.prototype, "property", void 0);
exports.PropertyMedia = PropertyMedia = __decorate([
    (0, typeorm_1.Entity)()
], PropertyMedia);
//# sourceMappingURL=propertyMedia.entity.js.map
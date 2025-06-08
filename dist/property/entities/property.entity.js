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
exports.Property = exports.PropertyType = exports.PropertyStatus = void 0;
const typeorm_1 = require("typeorm");
const neighborhood_entity_1 = require("../../neighborhood/entities/neighborhood.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const propertyMedia_entity_1 = require("../../media/entities/propertyMedia.entity");
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["AVAILABLE"] = "available";
    PropertyStatus["SOLD"] = "sold";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
var PropertyType;
(function (PropertyType) {
    PropertyType["APARTMENT"] = "apartment";
    PropertyType["VILLA"] = "villa";
    PropertyType["LAND"] = "land";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
let Property = class Property {
    property_id;
    title;
    description;
    price;
    area;
    rooms;
    status;
    property_type;
    created_at;
    updated_at;
    neighborhood;
    user;
    media;
};
exports.Property = Property;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Property.prototype, "property_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, }),
    __metadata("design:type", String)
], Property.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Property.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', nullable: true }),
    __metadata("design:type", Number)
], Property.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], Property.prototype, "area", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Property.prototype, "rooms", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PropertyStatus,
        default: PropertyStatus.AVAILABLE,
    }),
    __metadata("design:type", String)
], Property.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PropertyType,
        default: PropertyType.APARTMENT,
    }),
    __metadata("design:type", String)
], Property.prototype, "property_type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Property.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Property.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => neighborhood_entity_1.Neighborhood, (neighborhood) => neighborhood.properties, { eager: true, onDelete: 'RESTRICT' }),
    __metadata("design:type", neighborhood_entity_1.Neighborhood)
], Property.prototype, "neighborhood", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.properties, { onDelete: 'SET NULL', eager: true }),
    __metadata("design:type", user_entity_1.User)
], Property.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => propertyMedia_entity_1.PropertyMedia, (media) => media.property, { eager: true }),
    __metadata("design:type", Array)
], Property.prototype, "media", void 0);
exports.Property = Property = __decorate([
    (0, typeorm_1.Entity)()
], Property);
//# sourceMappingURL=property.entity.js.map
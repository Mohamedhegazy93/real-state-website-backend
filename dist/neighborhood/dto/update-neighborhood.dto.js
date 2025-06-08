"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNeighborhoodDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_neighborhood_dto_1 = require("./create-neighborhood.dto");
class UpdateNeighborhoodDto extends (0, mapped_types_1.PartialType)(create_neighborhood_dto_1.CreateNeighborhoodDto) {
}
exports.UpdateNeighborhoodDto = UpdateNeighborhoodDto;
//# sourceMappingURL=update-neighborhood.dto.js.map
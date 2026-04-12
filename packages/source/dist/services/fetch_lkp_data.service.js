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
exports.GetLookupData = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lookup_entity_1 = require("@repo/source/entities/lookup.entity");
let GetLookupData = class GetLookupData {
    lookupEntity;
    constructor(lookupEntity) {
        this.lookupEntity = lookupEntity;
    }
    async getLkpData(inputParams) {
        try {
            const page = Number(inputParams.page) || 1;
            const limit = Number(inputParams.limit) || 10;
            const offset = (page - 1) * limit;
            const queryBuilder = this.lookupEntity
                .createQueryBuilder('lookup')
                .skip(offset)
                .take(limit);
            if (Array.isArray(inputParams.filters)) {
                for (const [index, filter] of inputParams.filters.entries()) {
                    const key = `lookup.${filter.key}`;
                    const operator = filter.operator?.toLowerCase();
                    const paramKey = `filter_${index}`;
                    switch (operator) {
                        case 'begin':
                            queryBuilder.andWhere(`${key} LIKE :${paramKey}`, {
                                [paramKey]: `${filter.value}%`,
                            });
                            break;
                        case 'notbegin':
                            queryBuilder.andWhere(`${key} NOT LIKE :${paramKey}`, {
                                [paramKey]: `${filter.value}%`,
                            });
                            break;
                        case 'end':
                            queryBuilder.andWhere(`${key} LIKE :${paramKey}`, {
                                [paramKey]: `%${filter.value}`,
                            });
                            break;
                        case 'notend':
                            queryBuilder.andWhere(`${key} NOT LIKE :${paramKey}`, {
                                [paramKey]: `%${filter.value}`,
                            });
                            break;
                        case 'contain':
                            queryBuilder.andWhere(`${key} LIKE :${paramKey}`, {
                                [paramKey]: `%${filter.value}%`,
                            });
                            break;
                        case 'notcontain':
                            queryBuilder.andWhere(`${key} NOT LIKE :${paramKey}`, {
                                [paramKey]: `%${filter.value}%`,
                            });
                            break;
                        case 'equal':
                            queryBuilder.andWhere(`${key} = :${paramKey}`, {
                                [paramKey]: filter.value,
                            });
                            break;
                        case 'notequal':
                            queryBuilder.andWhere(`${key} != :${paramKey}`, {
                                [paramKey]: filter.value,
                            });
                            break;
                        case 'in':
                            const inValues = Array.isArray(filter.value)
                                ? filter.value
                                : String(filter.value)
                                    .split(',')
                                    .map((v) => v.trim());
                            queryBuilder.andWhere(`${key} IN (:...${paramKey})`, {
                                [paramKey]: inValues,
                            });
                            break;
                        case 'notin':
                            const notInValues = Array.isArray(filter.value)
                                ? filter.value
                                : String(filter.value)
                                    .split(',')
                                    .map((v) => v.trim());
                            queryBuilder.andWhere(`${key} NOT IN (:...${paramKey})`, {
                                [paramKey]: notInValues,
                            });
                            break;
                        case 'empty':
                            queryBuilder.andWhere(`${key} IS NULL`);
                            break;
                        case 'notempty':
                            queryBuilder.andWhere(`${key} IS NOT NULL`);
                            break;
                        default:
                            break;
                    }
                }
            }
            if (Array.isArray(inputParams.sort)) {
                for (const sortItem of inputParams.sort) {
                    if (sortItem.prop &&
                        ['asc', 'desc'].includes(sortItem.dir.toLowerCase())) {
                        queryBuilder.addOrderBy(`lookup.${sortItem.prop}`, sortItem.dir.toUpperCase());
                    }
                }
            }
            const [data, total] = await queryBuilder.getManyAndCount();
            if (!data.length) {
                throw new Error('No lookup data found.');
            }
            const totalPages = Math.ceil(total / limit);
            const currPage = page;
            const lastPage = totalPages;
            const prevPage = currPage > 1 ? true : false;
            const nextPage = currPage < totalPages ? true : false;
            return {
                settings: {
                    status: 200,
                    success: 1,
                    message: 'Lookup data found.',
                    count: total,
                    per_page: limit,
                    curr_page: currPage,
                    last_page: lastPage,
                    prev_page: prevPage,
                    next_page: nextPage,
                },
                data,
            };
        }
        catch (err) {
            console.log(err);
            return {
                settings: {
                    status: 200,
                    success: 0,
                    message: err.message || 'Error in fetching data.',
                },
                data: {},
            };
        }
    }
};
exports.GetLookupData = GetLookupData;
exports.GetLookupData = GetLookupData = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lookup_entity_1.LookupEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetLookupData);
//# sourceMappingURL=fetch_lkp_data.service.js.map
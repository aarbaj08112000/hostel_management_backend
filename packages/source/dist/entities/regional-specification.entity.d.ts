import { UserBase } from './base-user.entity';
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class RegionalSpecificationEntity extends UserBase {
    regionalSpecsId: number;
    regionName: string;
    regionCode: string;
    status: STATUS;
}
export {};
//# sourceMappingURL=regional-specification.entity.d.ts.map
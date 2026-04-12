import { UserBase } from './base-user.entity';
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class BrandEntity extends UserBase {
    brandId: number;
    brandName: string;
    brandCode: string;
    status: STATUS;
    brandImage: string;
}
export {};
//# sourceMappingURL=brand.entity.d.ts.map
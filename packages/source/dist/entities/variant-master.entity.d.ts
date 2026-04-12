import { UserBase } from './base-user.entity';
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class VariantMasterEntity extends UserBase {
    variantId: number;
    variantName: string;
    variantCode: string;
    status: STATUS;
    modedId: number;
}
export {};
//# sourceMappingURL=variant-master.entity.d.ts.map
import { UserBase } from './base-user.entity';
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class FeatureCategoryEntity extends UserBase {
    featureCategoryId: number;
    featureCategoryName: string;
    featureCategoryCode: string;
    status: STATUS;
}
export {};
//# sourceMappingURL=feature-category-detail.entity.d.ts.map
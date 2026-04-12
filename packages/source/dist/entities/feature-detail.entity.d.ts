import { UserBase } from './base-user.entity';
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
declare enum FeatureTYPE {
    Dropdown = "Dropdown",
    Checkbox = "Checkbox",
    Input = "Input"
}
declare enum TYPE {
    DROPDOWN = "Dropdown",
    CHECKBOX = "Checkbox"
}
export declare class FeatureEntity extends UserBase {
    featureId: number;
    featureName: string;
    featureCategoryId: number;
    featureType: TYPE;
    status: STATUS;
    featureCode: string;
    featureValues: FeatureTYPE;
}
export {};
//# sourceMappingURL=feature-detail.entity.d.ts.map
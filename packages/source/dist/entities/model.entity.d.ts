import { UserBase } from './base-user.entity';
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class ModelEntity extends UserBase {
    carModelId: number;
    modelName: string;
    modelCode: string;
    parentModelId: string;
    status: STATUS;
    brandId: number;
}
export {};
//# sourceMappingURL=model.entity.d.ts.map
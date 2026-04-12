import { UserBase } from './base-user.entity';
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class BodyEntity extends UserBase {
    bodyTypeId: number;
    bodyType: string;
    bodyCode: string;
    status: STATUS;
}
export {};
//# sourceMappingURL=body.entity.d.ts.map
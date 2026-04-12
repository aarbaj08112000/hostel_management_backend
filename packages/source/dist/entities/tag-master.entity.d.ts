import { UserBase } from './base-user.entity';
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class TagMasterEntity extends UserBase {
    tagId: number;
    tagName: string;
    tagCode: string;
    status: STATUS;
}
export {};
//# sourceMappingURL=tag-master.entity.d.ts.map
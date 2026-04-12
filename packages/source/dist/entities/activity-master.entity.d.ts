import { UserBase } from './base-user.entity';
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class ActivityMasterEntity extends UserBase {
    id: number;
    code: string;
    name: string;
    template?: string;
    params?: string;
    type: 'User';
    status: STATUS;
}
export {};
//# sourceMappingURL=activity-master.entity.d.ts.map
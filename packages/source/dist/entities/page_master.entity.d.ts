import { UserBase } from './base-user.entity';
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class PageMasterEntity extends UserBase {
    pageMasterId: number;
    pageName: string;
    pageCode: string;
    status: STATUS;
}
export {};
//# sourceMappingURL=page_master.entity.d.ts.map
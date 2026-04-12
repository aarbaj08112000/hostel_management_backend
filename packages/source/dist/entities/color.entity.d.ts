import { UserBase } from './base-user.entity';
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class ColorEntity extends UserBase {
    colorId: number;
    colorName: string;
    colorCode: string;
    status: STATUS;
}
export {};
//# sourceMappingURL=color.entity.d.ts.map
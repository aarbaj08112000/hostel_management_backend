import { BaseEntity } from 'typeorm';
export declare class Charges extends BaseEntity {
    chargesId: number;
    chargeName: string;
    chargeAmount: number;
    chargeType: 'fixed' | 'variable';
    addedDate: Date;
    updatedDate: Date;
}
//# sourceMappingURL=charges.entities.d.ts.map
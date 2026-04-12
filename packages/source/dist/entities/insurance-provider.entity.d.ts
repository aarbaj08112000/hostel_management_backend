import { UserBase } from './base-user.entity';
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class InsuranceProviderEntity extends UserBase {
    insuranceProviderId: number;
    providerName: string;
    providerCode: string;
    locationId: string;
    status: STATUS;
    remarks: string;
    description: string;
}
export {};
//# sourceMappingURL=insurance-provider.entity.d.ts.map
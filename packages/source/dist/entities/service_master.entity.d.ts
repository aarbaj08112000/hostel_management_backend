import { BaseEntity } from 'typeorm';
export declare class Service extends BaseEntity {
    serviceId: number;
    serviceName: string;
    description: string;
    price: number;
    addedDate: Date;
    updatedDate: Date;
    addedBy: number;
    updatedBy: number;
}
//# sourceMappingURL=service_master.entity.d.ts.map
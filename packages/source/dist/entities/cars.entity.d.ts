import { UserBase } from '../../src/entities/base-user.entity';
declare enum Negotiable {
    Yes = "Yes",
    No = "No"
}
declare enum NegotiableRange {
    High = "High",
    Medium = "Medium",
    Low = "Low"
}
declare enum CarCondition {
    Excellent = "Excellent",
    Good = "Good",
    Satisfactory = "Satisfactory"
}
declare enum Status {
    Active = "Active",
    Inactive = "Inactive",
    Booked = "Booked",
    Sold = "Sold",
    Draft = "Draft"
}
declare enum YesNo {
    Yes = "Yes",
    No = "No"
}
export declare class CarEntity extends UserBase {
    carId: number;
    carName: string;
    carDescription: string;
    price: number;
    negotiable: Negotiable;
    negotiableRange: NegotiableRange;
    carCondition: CarCondition;
    monthlyEMIAmount: number;
    slug: string;
    carImage: string;
    remarks: string;
    status: Status;
    shortDescription: string;
    contactDetails: string;
    overviewTitle: string;
    isListed: YesNo;
    carCode: string;
}
declare enum InsuranceType {
    ThirdParty = "ThirdParty",
    Comprehensible = "Comprehensible",
    NotAvailable = "NotAvailable"
}
declare enum accidentalHistory {
    no_accidental_history = "no_accidental_history",
    minor_wear_tear = "minor_wear_tear"
}
export declare class CarHistoryEntity extends UserBase {
    carHistoryId: number;
    carId: number;
    registrationNumber: string;
    registrationDate: Date;
    registrationExpiry: Date;
    locationId: number;
    insuranceType: InsuranceType;
    insuranceExpiry: Date;
    accidentHistory: YesNo;
    insuranceProvideId: number;
    insurancePolicyNumber: string;
    isColetral: YesNo;
    coletralWith: string;
    accidentalHistory: accidentalHistory;
    afterMarketModification: YesNo;
}
export declare class CarTagEntity extends UserBase {
    carTagId: number;
    tagId: number;
    carId: number;
}
export declare class CarFeatureEntity extends UserBase {
    carFeatureId: number;
    featureId: number;
    carId: number;
    featureValue: string;
}
export declare class CarDocumentEntity extends UserBase {
    carDocumentId: number;
    carId: number;
    documentTitle: string;
    documentTypeId: string;
}
export {};
//# sourceMappingURL=cars.entity.d.ts.map
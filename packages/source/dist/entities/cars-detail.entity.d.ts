import { UserBase } from '../../src/entities/base-user.entity';
declare enum FuelType {
    Petrol = "Petrol",
    Diesel = "Diesel",
    Hybrid = "Hybrid",
    Electric = "Electric"
}
declare enum TransmissionType {
    Manual = "Manual",
    Automatic = "Automatic"
}
declare enum CarCategory {
    ICE = "ICE",
    EV = "EV",
    HEV = "HEV",
    PHEV = "PHEV"
}
declare enum SteeringSide {
    LeftHand = "LeftHand",
    RightHand = "RightHand"
}
declare enum YesNo {
    Yes = "Yes",
    No = "No"
}
export declare class CarDetailsEntity extends UserBase {
    carsDetailsId: number;
    carId: number;
    vinNumber: string;
    chassisNumber: string;
    brandId: number;
    modelId: number;
    bodyTypeid: number;
    fuelType: FuelType;
    manufactureYear: number;
    manufactureMonth: number;
    serialNumber: string;
    countryId: number;
    transmissionType: TransmissionType;
    carCategory: CarCategory;
    engineCapacity: number;
    engineType: string;
    engineSize: string;
    horsePower: number;
    exteriorColorId: number;
    interiorColorId: number;
    steeringSide: SteeringSide;
    regionalSpecsId: number;
    drivenDistance: number;
    serviceHistory: YesNo;
    warranty: YesNo;
    ownerNumber: number;
    seatingCapacity: number;
    numberOfDoors: number;
    variantId: number;
}
export {};
//# sourceMappingURL=cars-detail.entity.d.ts.map
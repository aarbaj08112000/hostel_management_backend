import { UserBase } from './base-user.entity';
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
declare enum LOCATIONTYPE {
    Showroom = "Showroom",
    StockYard = "StockYard"
}
export declare class LocationsEntity extends UserBase {
    locationId: number;
    locationName: string;
    locationCode: string;
    zipCode: string;
    address: string;
    cityId: string;
    stateId: string;
    countryId: string;
    latitude: string;
    longitude: string;
    status: STATUS;
    locationType: LOCATIONTYPE;
    googleAddress: string;
}
export {};
//# sourceMappingURL=locations.entity.d.ts.map
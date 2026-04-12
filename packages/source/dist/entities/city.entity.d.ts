declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class CityEntity {
    id: number;
    city: string;
    cityCode: string;
    stateId: number;
    countryId: number;
    latitude: string;
    longitude: string;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=city.entity.d.ts.map
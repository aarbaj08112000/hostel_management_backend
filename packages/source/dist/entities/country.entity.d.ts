declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class CountryEntity {
    id: number;
    country: string;
    countryCode: string;
    countryCodeISO3: string;
    countryFlag: string;
    dialCode: string;
    description: string;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=country.entity.d.ts.map
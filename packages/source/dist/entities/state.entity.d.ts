declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class StateEntity {
    id: number;
    state: string;
    stateCode: string;
    countryId: number;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=state.entity.d.ts.map
declare enum CAPABILITY_TYPE {
    CUSTOM = "Custom",
    MODULE = "Module",
    DASHBOARD = "Dashboard",
    WIDGET = "Widget",
    LISTFIELD = "ListField",
    FORMFIELD = "FormField"
}
declare enum ADDED_BY {
    SYSTEM = "System",
    MANUAL = "Manual"
}
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class CapabilityMasterEntity {
    id: number;
    capabilityName: string;
    capabilityCode: string;
    capabilityType: CAPABILITY_TYPE;
    capabilityMode: string;
    entityName: string;
    parentEntity: string;
    categoryId: number;
    addedBy: ADDED_BY;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=capability-master.entity.d.ts.map
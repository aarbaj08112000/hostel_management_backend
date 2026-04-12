declare enum OPEN {
    SAME = "same",
    NEW = "new",
    POPUP_IFRAME = "popup_iframe",
    POPUP_AJAX = "popup_ajax"
}
declare enum MENU_TYPE {
    CUSTOM = "Custom",
    MODULE = "Module",
    DASHBOARD = "Dashboard"
}
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
    HIDDEN = "Hidden"
}
export declare class AdminMenuEntity {
    id: number;
    parentId: number;
    menuDisplay: string;
    icon: string;
    url: string;
    open: OPEN;
    menuType: MENU_TYPE;
    capabilityId: number;
    capabilityCode: string;
    moduleName: string;
    dashBoardPage: string;
    uniqueMenuCode: string;
    columnNumber: number;
    sequenceOrder: number;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=admin-menu.entity.d.ts.map
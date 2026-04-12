declare enum CONFIG_TYPE {
    COMPANY = "Company",
    APPEARANCE = "Appearance",
    PREFERENCES = "Preferences",
    EMAIL = "Email",
    SMS = "SMS",
    PUSHNOTIFY = "PushNotify",
    CONFIG = "Config",
    FORMATS = "Formats",
    AUTHENTICATE = "Authenticate",
    META = "Meta"
}
declare enum DISPLAY_TYPE {
    TEXT = "text",
    SELECTBOX = "selectbox",
    TEXTAREA = "textarea",
    CHECKBOX = "checkbox",
    RADIO = "radio",
    HIDDEN = "hidden",
    EDITOR = "editor",
    FILE = "file",
    READONLY = "readonly",
    PASSWORD = "password"
}
declare enum SOURCE {
    LIST = "List",
    QUERY = "Query",
    VALUE = "Value",
    PERCENT = "Percent",
    FUNCTION = "Function",
    NOIMAGE = "NoImage"
}
declare enum SELECT_TYPE {
    SINGLE = "Single",
    MULTIPLE = "Multiple",
    PLUS = "Plus",
    MINUS = "Minus"
}
declare enum LANG {
    YES = "Yes",
    NO = "No"
}
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class SettingEntity {
    id: number;
    name: string;
    desc: string;
    value: string;
    groupType: string;
    configType: CONFIG_TYPE;
    displayType: DISPLAY_TYPE;
    source: SOURCE;
    sourceValue: string;
    selectType: SELECT_TYPE;
    defValue: string;
    lang: LANG;
    validateCode: string;
    validateMessage: string;
    settingAttr: string;
    placeholder: string;
    helpText: string;
    orderBy: number;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=setting.entity%20copy.d.ts.map
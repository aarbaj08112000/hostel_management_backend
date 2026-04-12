export declare class StandardResultDto {
    success?: number;
    message?: string;
    status?: number;
}
export declare class StandardReturnDto {
    success?: number;
    message?: string;
}
export declare class PromiseResponseDto {
    data?: any;
    error?: any;
}
export declare class StandardPromiseDto {
    success?: number;
    message?: string;
    status?: number;
    error?: any;
    data?: any;
}
export declare class StandardCallbackDto {
    callback?: Function;
    async?: boolean;
}
export declare class DynamicKeyAnyDto {
    [key: string]: any;
}
export declare class DynamicKeyStrDto {
    [key: string]: string;
}
export declare class DynamicKeyNumDto {
    [key: string]: number;
}
export declare class DynamicKeyMixDto {
    [key: string]: string | number;
}
export declare class BlockResultDto {
    success?: number;
    message?: string;
    data?: any;
}
export declare class SettingsParamsDto {
    status?: number;
    success?: number;
    message?: string;
    access_token?: string;
    count?: number;
    per_page?: number;
    curr_page?: number;
    last_page?: number;
    prev_page?: boolean;
    next_page?: boolean;
}
//# sourceMappingURL=common.dto.d.ts.map
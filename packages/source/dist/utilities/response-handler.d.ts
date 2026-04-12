export interface ResponseDataInterface {
    message?: string;
    status?: number;
    data?: any;
}
export interface SettingsHandlerInterface {
    status?: number;
    success: number;
    message: string;
    access_token?: string;
    count?: number;
    per_page?: number;
    curr_page?: number;
    last_page?: number;
    prev_page?: boolean;
    next_page?: boolean;
}
export interface ResponseHandlerInterface {
    settings?: SettingsHandlerInterface;
    data?: any;
}
export declare class ResponseHandler {
    static error(status: number, message: string): ResponseDataInterface;
    static success(status: number, data: any): ResponseDataInterface;
    static standard(status: number, success: number, message: string, data: any): ResponseDataInterface;
}
//# sourceMappingURL=response-handler.d.ts.map
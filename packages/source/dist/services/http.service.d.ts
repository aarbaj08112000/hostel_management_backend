import { DynamicKeyStrDto, StandardCallbackDto, StandardResultDto } from '../common/dto/common.dto';
import { ImageResizeDto } from '../common/dto/amazon.dto';
export declare class HttpService {
    private readonly log;
    get(url: string, data?: any, headers?: any, options?: any): Promise<any>;
    post(url: string, data?: any, headers?: any, options?: any): Promise<any>;
    put(url: string, data?: any, headers?: any, options?: any): Promise<any>;
    delete(url: string, data?: any, headers?: any, options?: any): Promise<any>;
    stream(url: string, loc?: string, headers?: DynamicKeyStrDto, options?: StandardCallbackDto & ImageResizeDto): Promise<StandardResultDto>;
}
//# sourceMappingURL=http.service.d.ts.map
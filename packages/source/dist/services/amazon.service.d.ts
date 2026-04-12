import { CheckBucketDto, CheckFileDto, CreateBucketDto, DeleteBucketDto, DeleteFileDto, DeleteFilesDto, DownloadFileDto, GetBucketFilesDto, UploadFileDto } from '../common/dto/amazon.dto';
import { PromiseResponseDto } from '../common/dto/common.dto';
import { CacheService } from './cache.service';
export declare class AmazonService {
    private readonly cacheService;
    private readonly log;
    protected type: string;
    protected region: string;
    protected provider: any;
    constructor(cacheService: CacheService);
    setWasabi(): void;
    initialize(): Promise<void>;
    checkBucket(options: CheckBucketDto): Promise<{
        success: number;
        message: string | object;
        result: PromiseResponseDto;
    }>;
    checkFile(options: CheckFileDto): Promise<{
        success: number;
        message: string | object;
        result: PromiseResponseDto;
    }>;
    uploadFile(options: UploadFileDto): Promise<{
        success: number;
        message: string | object;
        result: PromiseResponseDto;
    }>;
    deleteFile(options: DeleteFileDto): Promise<{
        success: number;
        message: string | object;
        result: PromiseResponseDto;
    }>;
    deleteFiles(options: DeleteFilesDto): Promise<{
        success: number;
        message: string | object;
        result: PromiseResponseDto;
    }>;
    downloadFile(options: DownloadFileDto): Promise<{
        success: number;
        message: string | object;
        result: PromiseResponseDto;
    }>;
    createBucket(options: CreateBucketDto): Promise<{
        success: number;
        message: string | object;
        result: PromiseResponseDto;
    }>;
    deleteBucket(options: DeleteBucketDto): Promise<{
        success: number;
        message: string | object;
        result: PromiseResponseDto;
    }>;
    getBucketFiles(options: GetBucketFilesDto): Promise<{
        success: number;
        message: string | object;
        result: PromiseResponseDto;
    }>;
}
//# sourceMappingURL=amazon.service.d.ts.map
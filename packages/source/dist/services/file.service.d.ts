import { FileAttributesDto, FileFetchDto, FileUploadDto, ImageResizeDto, ResizeOptionsDto, StaticImgOptsDto, UploadedPathDto } from '../common/dto/amazon.dto';
import { AmazonService } from './amazon.service';
import { CacheService } from './cache.service';
import { DateService } from './date.service';
import { HttpService } from './http.service';
import { DynamicKeyAnyDto, StandardCallbackDto } from '../common/dto/common.dto';
import { ConfigService } from '@nestjs/config';
export declare class FileService {
    private amazonService;
    private cacheService;
    private dateService;
    private httpService;
    protected readonly configService: ConfigService;
    private readonly log;
    constructor(amazonService: AmazonService, cacheService: CacheService, dateService: DateService, httpService: HttpService, configService: ConfigService);
    isFile(filePath: string): boolean;
    isDirectory(dirPath: string): boolean;
    getFileSize(filePath: string): number;
    getFileMime(filePath: string): string;
    readURLName(fileUrl: string): string;
    writeURLData(fileUrl: string, filePath?: string, headers?: DynamicKeyAnyDto, options?: StandardCallbackDto & ImageResizeDto): Promise<boolean>;
    readFile(filePath: string, options?: StandardCallbackDto): any;
    writeFile(filePath: string, data: any, options?: StandardCallbackDto): any;
    deleteFile(filePath: string, options?: StandardCallbackDto): any;
    getNoImageUrl(noImageVal?: string): Promise<string>;
    staticImageUrl(options?: StaticImgOptsDto): Promise<string>;
    getResizeImageUrl(imgUrl: string, width?: number, height?: number, options?: ResizeOptionsDto): Promise<string>;
    hexToRgb(hex?: any, alpha?: any): {
        r: number;
        g: number;
        b: number;
        alpha: any;
    };
    getResizedImage(options?: ImageResizeDto): Promise<void>;
    getFile(options?: FileFetchDto): Promise<string>;
    getLocalFile(options: FileFetchDto): Promise<any>;
    getAmazonFile(options: FileFetchDto): Promise<any>;
    getWasabiFile(options: FileFetchDto): Promise<any>;
    getExternalFile(options: FileFetchDto): any;
    getDefaultFile(options: FileFetchDto): Promise<string>;
    uploadFile(options: FileUploadDto): Promise<{}>;
    uploadLocalFile(options: FileUploadDto): Promise<{
        success: any;
        message: any;
    }>;
    uploadAmazonFile(options: any): Promise<{
        success: any;
        message: any;
        response: any;
    }>;
    uploadWasabiFile(options: any): Promise<{
        success: any;
        message: any;
        response: any;
    }>;
    imageUpload(options: any): {
        success: any;
        message: any;
    };
    getLocalUploadPathURL(folderName: string): Promise<UploadedPathDto>;
    getAmazonUploadPathURL(folderName: string): Promise<UploadedPathDto>;
    getWasabiUploadPathURL(folderName: string): Promise<UploadedPathDto>;
    getFileAttributes(fileName: string): FileAttributesDto;
    getBase64ImageName(imageData?: string): string;
    cleanBase64ImageData(imageData?: string): string;
    createFolder(dirPath: string, mode?: number): void;
    setPermission(filePath: string, mode?: number): boolean;
    createUploadFolder(folderName: string): Promise<boolean>;
    getUploadNestedFolders(folderName: string): string;
    validateFileFormat(allowedExt: string, uploadFile: string): boolean;
    validateFileSize(fileSize: number, maxSize: number): boolean;
    sanitizeFileName(fileName: string): string;
}
//# sourceMappingURL=file.service.d.ts.map
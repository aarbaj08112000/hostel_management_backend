export declare class CommonBucketDto {
    bucket_name: string;
    callback?: Function;
    async?: boolean;
}
export declare class CreateBucketDto extends CommonBucketDto {
}
export declare class DeleteBucketDto extends CommonBucketDto {
}
export declare class CheckBucketDto extends CommonBucketDto {
}
export declare class CheckFileDto extends CommonBucketDto {
    file_name: string;
}
export declare class UploadFileDto extends CommonBucketDto {
    file_name: string;
    file_path: string;
    mime_type?: string;
    file_size?: number;
}
export declare class DeleteFileDto extends CommonBucketDto {
    file_name: string;
}
export declare class DeleteFilesDto extends CommonBucketDto {
    file_names: DeleteFilesObject[];
}
declare class DeleteFilesObject {
    Key: string;
}
export declare class DownloadFileDto extends CommonBucketDto {
    file_name: string;
}
export declare class GetBucketFilesDto extends CommonBucketDto {
    prefix?: string;
    max_keys?: number;
    start_after?: string;
    continuation_token?: string;
}
export declare class ListObjectsDto {
    Bucket: string;
    Prefix?: string;
    MaxKeys?: number;
    StartAfter?: string;
    ContinuationToken?: string;
}
export declare class ImageResizeDto {
    src_path?: string;
    dst_path?: string;
    img_url?: string;
    bucket?: string;
    key?: string;
    edits?: {
        resize?: {
            width?: number;
            height?: number;
            fit?: keyof ImageResizeFit;
            background?: any;
        };
    };
    flatten?: {
        background?: any;
    };
}
export interface ImageResizeFit {
    contain: 'contain';
    cover: 'cover';
    fill: 'fill';
    inside: 'inside';
    outside: 'outside';
}
export declare class ResizeOptionsDto {
    resize_mode?: keyof ImageResizeFit;
    background?: string;
    color?: string;
    source?: string;
    path?: string;
    image_name?: string;
}
export declare class UploadedPathDto {
    bucket_name?: string;
    folder_name?: string;
    folder_path?: string;
    folder_url?: string;
}
export declare class FileAttributesDto {
    file_name?: string;
    file_ext?: string;
    file_cat?: string;
}
export declare class StaticImgOptsDto {
    no_img_req?: boolean;
    extensions?: string;
    no_img_val?: string;
}
export declare class FileFetchDto {
    source?: string;
    image_name?: string;
    nested_key?: string;
    extensions?: string;
    no_img_req?: boolean;
    no_img_val?: string;
    resize_mode?: keyof ImageResizeFit;
    width?: number;
    height?: number;
    path?: string;
    color?: string;
    fit?: string;
}
export declare class FileUploadDto {
    source?: string;
    upload_path?: string;
    src_file: string;
    dst_file: string;
    extensions?: string;
    file_type?: string;
    file_size?: number;
    max_size?: number;
    async?: boolean;
}
export {};
//# sourceMappingURL=amazon.dto.d.ts.map
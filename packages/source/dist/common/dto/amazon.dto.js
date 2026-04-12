"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadDto = exports.FileFetchDto = exports.StaticImgOptsDto = exports.FileAttributesDto = exports.UploadedPathDto = exports.ResizeOptionsDto = exports.ImageResizeDto = exports.ListObjectsDto = exports.GetBucketFilesDto = exports.DownloadFileDto = exports.DeleteFilesDto = exports.DeleteFileDto = exports.UploadFileDto = exports.CheckFileDto = exports.CheckBucketDto = exports.DeleteBucketDto = exports.CreateBucketDto = exports.CommonBucketDto = void 0;
class CommonBucketDto {
    bucket_name;
    callback;
    async;
}
exports.CommonBucketDto = CommonBucketDto;
class CreateBucketDto extends CommonBucketDto {
}
exports.CreateBucketDto = CreateBucketDto;
class DeleteBucketDto extends CommonBucketDto {
}
exports.DeleteBucketDto = DeleteBucketDto;
class CheckBucketDto extends CommonBucketDto {
}
exports.CheckBucketDto = CheckBucketDto;
class CheckFileDto extends CommonBucketDto {
    file_name;
}
exports.CheckFileDto = CheckFileDto;
class UploadFileDto extends CommonBucketDto {
    file_name;
    file_path;
    mime_type;
    file_size;
}
exports.UploadFileDto = UploadFileDto;
class DeleteFileDto extends CommonBucketDto {
    file_name;
}
exports.DeleteFileDto = DeleteFileDto;
class DeleteFilesDto extends CommonBucketDto {
    file_names;
}
exports.DeleteFilesDto = DeleteFilesDto;
class DeleteFilesObject {
    Key;
}
class DownloadFileDto extends CommonBucketDto {
    file_name;
}
exports.DownloadFileDto = DownloadFileDto;
class GetBucketFilesDto extends CommonBucketDto {
    prefix;
    max_keys;
    start_after;
    continuation_token;
}
exports.GetBucketFilesDto = GetBucketFilesDto;
class ListObjectsDto {
    Bucket;
    Prefix;
    MaxKeys;
    StartAfter;
    ContinuationToken;
}
exports.ListObjectsDto = ListObjectsDto;
class ImageResizeDto {
    src_path;
    dst_path;
    img_url;
    bucket;
    key;
    edits;
    flatten;
}
exports.ImageResizeDto = ImageResizeDto;
class ResizeOptionsDto {
    resize_mode;
    background;
    color;
    source;
    path;
    image_name;
}
exports.ResizeOptionsDto = ResizeOptionsDto;
class UploadedPathDto {
    bucket_name;
    folder_name;
    folder_path;
    folder_url;
}
exports.UploadedPathDto = UploadedPathDto;
class FileAttributesDto {
    file_name;
    file_ext;
    file_cat;
}
exports.FileAttributesDto = FileAttributesDto;
class StaticImgOptsDto {
    no_img_req;
    extensions;
    no_img_val;
}
exports.StaticImgOptsDto = StaticImgOptsDto;
class FileFetchDto {
    source;
    image_name;
    nested_key;
    extensions;
    no_img_req;
    no_img_val;
    resize_mode;
    width;
    height;
    path;
    color;
    fit;
}
exports.FileFetchDto = FileFetchDto;
class FileUploadDto {
    source;
    upload_path;
    src_file;
    dst_file;
    extensions;
    file_type;
    file_size;
    max_size;
    async;
}
exports.FileUploadDto = FileUploadDto;
//# sourceMappingURL=amazon.dto.js.map
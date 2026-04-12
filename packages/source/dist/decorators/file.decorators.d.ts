import { ValidationOptions } from 'class-validator';
export declare function MaxFileSize(maxSize: number, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare function IsFileMimeType(allowedMimeTypes: string[], validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
//# sourceMappingURL=file.decorators.d.ts.map
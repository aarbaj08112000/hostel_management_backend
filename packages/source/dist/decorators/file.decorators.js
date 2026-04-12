"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxFileSize = MaxFileSize;
exports.IsFileMimeType = IsFileMimeType;
const class_validator_1 = require("class-validator");
function MaxFileSize(maxSize, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'maxFileSize',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [maxSize],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    if (!value || !Array.isArray(value)) {
                        return true;
                    }
                    const files = value;
                    const maxFileSize = args.constraints[0];
                    for (const file of files) {
                        if (file.size > maxFileSize) {
                            return false;
                        }
                    }
                    return true;
                },
                defaultMessage(args) {
                    const maxFileSize = args.constraints[0];
                    return `File size should not exceed ${maxFileSize} bytes`;
                },
            },
        });
    };
}
function IsFileMimeType(allowedMimeTypes, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isFileMimeType',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [allowedMimeTypes],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    if (!value || !Array.isArray(value)) {
                        return true;
                    }
                    const files = value;
                    const allowedTypes = args.constraints[0];
                    for (const file of files) {
                        if (!allowedTypes.includes(file.mimetype)) {
                            return false;
                        }
                    }
                    return true;
                },
                defaultMessage(args) {
                    const allowedTypes = args.constraints[0];
                    return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
                },
            },
        });
    };
}
//# sourceMappingURL=file.decorators.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordMatch = PasswordMatch;
exports.DateEqualTo = DateEqualTo;
exports.DateGreaterThan = DateGreaterThan;
exports.DateLessThan = DateLessThan;
exports.DateGreaterEqual = DateGreaterEqual;
exports.DateLessEqual = DateLessEqual;
exports.NumEqualTo = NumEqualTo;
exports.NumLessEqual = NumLessEqual;
exports.NumGreaterEqual = NumGreaterEqual;
exports.NumLessThan = NumLessThan;
exports.NumGreaterThan = NumGreaterThan;
exports.TimeEqualTo = TimeEqualTo;
exports.TimeLessThan = TimeLessThan;
exports.TimeLessEqual = TimeLessEqual;
exports.TimeGreaterThan = TimeGreaterThan;
exports.TimeGreaterEqual = TimeGreaterEqual;
exports.NotEquals = NotEquals;
exports.Equals = Equals;
const class_validator_1 = require("class-validator");
function PasswordMatch(property, flag, message, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property, message, flag],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args) {
                    const [relatedPropertyName] = args.constraints;
                    return `${relatedPropertyName} and confirm ${relatedPropertyName} must match`;
                },
            },
        });
    };
}
function DateEqualTo(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args) {
                    const [start_date] = args.constraints;
                    return `${start_date} and  end_date must match`;
                },
            },
        });
    };
}
function DateGreaterThan(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value > relatedValue;
                },
                defaultMessage(args) {
                    const [start_date] = args.constraints;
                    return `end_date must greater than ${start_date} `;
                },
            },
        });
    };
}
function DateLessThan(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value > relatedValue;
                },
                defaultMessage(args) {
                    const [start_date] = args.constraints;
                    return `${start_date} must be less than end_date`;
                },
            },
        });
    };
}
function DateGreaterEqual(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value >= relatedValue;
                },
                defaultMessage(args) {
                    const [start_date] = args.constraints;
                    return `end_date greater than or equal to ${start_date}`;
                },
            },
        });
    };
}
function DateLessEqual(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value >= relatedValue;
                },
                defaultMessage(args) {
                    const [start_date] = args.constraints;
                    return `${start_date}  less than or equal to end_date`;
                },
            },
        });
    };
}
function NumEqualTo(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args) {
                    const [number] = args.constraints;
                    return `${number} and re_enter_number are must equal`;
                },
            },
        });
    };
}
function NumLessEqual(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value >= relatedValue;
                },
                defaultMessage(args) {
                    const [number] = args.constraints;
                    return `${number} less than or equal to re_enter_number`;
                },
            },
        });
    };
}
function NumGreaterEqual(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value <= relatedValue;
                },
                defaultMessage(args) {
                    const [number] = args.constraints;
                    return `${number} greater than or equal to re_enter_number`;
                },
            },
        });
    };
}
function NumLessThan(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value > relatedValue;
                },
                defaultMessage(args) {
                    const [number] = args.constraints;
                    return `${number} less than re_enter_number`;
                },
            },
        });
    };
}
function NumGreaterThan(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value < relatedValue;
                },
                defaultMessage(args) {
                    const [number] = args.constraints;
                    return `${number} greater than re_enter_number`;
                },
            },
        });
    };
}
function TimeEqualTo(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args) {
                    const [start_time] = args.constraints;
                    return `${start_time} and end_time are must be equal`;
                },
            },
        });
    };
}
function TimeLessThan(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value > relatedValue;
                },
                defaultMessage(args) {
                    const [start_time] = args.constraints;
                    return `${start_time} less than end_time`;
                },
            },
        });
    };
}
function TimeLessEqual(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value >= relatedValue;
                },
                defaultMessage(args) {
                    const [start_time] = args.constraints;
                    return `${start_time} less than  or equal to end_time`;
                },
            },
        });
    };
}
function TimeGreaterThan(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value < relatedValue;
                },
                defaultMessage(args) {
                    const [start_time] = args.constraints;
                    return `${start_time} greater than end_time`;
                },
            },
        });
    };
}
function TimeGreaterEqual(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value <= relatedValue;
                },
                defaultMessage(args) {
                    const [start_time] = args.constraints;
                    return `${start_time} greater than or equal to end_time`;
                },
            },
        });
    };
}
function NotEquals(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value !== relatedValue;
                },
                defaultMessage(args) {
                    const [start_time] = args.constraints;
                    return `${start_time} greater than or equal to end_time`;
                },
            },
        });
    };
}
function Equals(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args) {
                    const [start_time] = args.constraints;
                    return `${start_time} greater than or equal to end_time`;
                },
            },
        });
    };
}
//# sourceMappingURL=system.decorators.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var HttpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const _ = __importStar(require("lodash"));
const sharp_1 = __importDefault(require("sharp"));
const fse = __importStar(require("fs-extra"));
const form_data_1 = __importDefault(require("form-data"));
const logger_handler_1 = require("../utilities/logger-handler");
const stream = __importStar(require("stream"));
const util_1 = require("util");
let HttpService = HttpService_1 = class HttpService {
    log = new logger_handler_1.LoggerHandler(HttpService_1.name).getInstance();
    async get(url, data, headers, options) {
        let result;
        try {
            const config = {
                headers,
                params: data,
            };
            if ('async' in options && options.async === true) {
                axios_1.default
                    .get(url, config)
                    .then(function (response) {
                    this.log.info(response);
                })
                    .catch(function (error) {
                    this.log.error(error);
                });
                result = {
                    success: 1,
                };
            }
            else {
                const response = await axios_1.default.get(url, config);
                result = {
                    success: 1,
                    message: response.statusText,
                    status: response.status,
                    code: 'OK',
                    body: response.data,
                };
            }
        }
        catch (error) {
            result = {
                success: 0,
                message: error.response.statusMessage,
                status: error.response.statusCode,
                code: error.name,
                body: error.response.body,
            };
        }
        return result;
    }
    async post(url, data, headers, options) {
        let result;
        try {
            const config = {
                headers,
                params: {},
                data: {},
            };
            if (options.input_type === 'raw') {
                if (typeof data === 'string') {
                    data = JSON.parse(data.trim());
                }
                config.data = data;
            }
            else if (options.input_type === 'x-www-form-urlencoded') {
                config.data = data;
            }
            else {
                const fileKeys = options.file_keys;
                const formBody = new form_data_1.default();
                Object.keys(data).forEach((key) => {
                    if (_.isArray(fileKeys) && fileKeys.includes(key)) {
                        formBody.append(key, fse.createReadStream(data[key].path));
                    }
                    else {
                        formBody.append(key, data[key]);
                    }
                });
                config.data = formBody;
            }
            if ('async' in options && options.async === true) {
                axios_1.default
                    .post(url, config)
                    .then(function (response) {
                    this.log.info(response);
                })
                    .catch(function (error) {
                    this.log.error(error);
                });
                result = {
                    success: 1,
                };
            }
            else {
                const response = await axios_1.default.post(url, config);
                result = {
                    success: 1,
                    message: response.statusText,
                    status: response.status,
                    code: 'OK',
                    body: response.data,
                };
            }
        }
        catch (error) {
            result = {
                success: 0,
                message: error.response.statusMessage,
                status: error.response.statusCode,
                code: error.name,
                body: error.response.body,
            };
        }
        return result;
    }
    async put(url, data, headers, options) {
        let result;
        try {
            const config = {
                headers,
                params: {},
                data: {},
            };
            if (options.input_type === 'raw') {
                if (typeof data === 'string') {
                    data = JSON.parse(data.trim());
                }
                config.data = data;
            }
            else if (options.input_type === 'x-www-form-urlencoded') {
                config.data = data;
            }
            if ('async' in options && options.async === true) {
                axios_1.default
                    .put(url, config)
                    .then(function (response) {
                    this.log.info(response);
                })
                    .catch(function (error) {
                    this.log.error(error);
                });
                result = {
                    success: 1,
                };
            }
            else {
                const response = await axios_1.default.put(url, config);
                result = {
                    success: 1,
                    message: response.statusText,
                    status: response.status,
                    code: 'OK',
                    body: response.data,
                };
            }
        }
        catch (error) {
            result = {
                success: 0,
                message: error.response.statusMessage,
                status: error.response.statusCode,
                code: error.name,
                body: error.response.body,
            };
        }
        return result;
    }
    async delete(url, data, headers, options) {
        let result;
        try {
            const config = {
                headers,
                params: {},
                data: {},
            };
            if (options.input_type === 'raw') {
                if (typeof data === 'string') {
                    data = JSON.parse(data.trim());
                }
                config.data = data;
            }
            else if (options.input_type === 'x-www-form-urlencoded') {
                config.data = data;
            }
            if ('async' in options && options.async === true) {
                axios_1.default
                    .delete(url, config)
                    .then(function (response) {
                    this.log.info(response);
                })
                    .catch(function (error) {
                    this.log.error(error);
                });
                result = {
                    success: 1,
                };
            }
            else {
                const response = await axios_1.default.delete(url, config);
                result = {
                    success: 1,
                    message: response.statusText,
                    status: response.status,
                    code: 'OK',
                    body: response.data,
                };
            }
        }
        catch (error) {
            result = {
                success: 0,
                message: error.response.statusMessage,
                status: error.response.statusCode,
                code: error.name,
                body: error.response.body,
            };
        }
        return result;
    }
    async stream(url, loc, headers, options) {
        let result;
        try {
            if ('async' in options && options.async === true) {
                axios_1.default
                    .get(url, {
                    responseType: 'stream',
                    headers,
                })
                    .then((response) => {
                    response.data.pipe(fse.createWriteStream(loc));
                    if (options?.callback) {
                        options.callback(null, response);
                    }
                })
                    .catch((error) => {
                    this.log.error(error);
                    if (options?.callback) {
                        options.callback(error, null);
                    }
                });
                result = {
                    success: 1,
                    message: 'OK',
                    status: common_1.HttpStatus.OK,
                };
            }
            else {
                const finished = (0, util_1.promisify)(stream.finished);
                await new Promise((resolve, reject) => {
                    axios_1.default
                        .get(url, {
                        responseType: loc ? 'stream' : 'arraybuffer',
                        headers,
                    })
                        .then((response) => {
                        this.log.debug('File download started');
                        if (loc) {
                            const b = fse.createWriteStream(loc);
                            response.data.pipe(b);
                            return finished(b);
                        }
                        else if (options?.edits) {
                            (0, sharp_1.default)(response.data)
                                .resize(options.edits.resize.width, options.edits.resize.height, {
                                fit: options.edits.resize.fit,
                                background: options.edits.resize.background,
                            })
                                .toFile(options.dst_path)
                                .then((data) => {
                                this.log.debug('[getResizedImage] >> Resize Completed');
                            })
                                .catch((error) => {
                                this.log.error('[getResizedImage] >> Error ', error);
                            });
                        }
                        this.log.debug('File download completed');
                    })
                        .catch((error) => {
                        this.log.error(error);
                        reject({ error });
                    });
                });
                result = {
                    success: 1,
                    message: 'OK',
                    status: common_1.HttpStatus.OK,
                };
            }
        }
        catch (error) {
            this.log.error(error);
            result = {
                success: 0,
                message: error?.response?.statusText,
                status: error?.response?.status,
            };
        }
        return result;
    }
};
exports.HttpService = HttpService;
exports.HttpService = HttpService = HttpService_1 = __decorate([
    (0, common_1.Injectable)()
], HttpService);
//# sourceMappingURL=http.service.js.map
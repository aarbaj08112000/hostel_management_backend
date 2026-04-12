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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const _ = __importStar(require("lodash"));
const custom = __importStar(require("../utilities/custom-helper"));
const logger_handler_1 = require("../utilities/logger-handler");
const cit_general_library_1 = require("../utilities/cit-general-library");
const cache_service_1 = require("./cache.service");
const cit_modules_1 = __importDefault(require("../config/cit-modules"));
const setting_entity_1 = require("../entities/setting.entity");
const response_handler_1 = require("../utilities/response-handler");
let ModuleService = class ModuleService {
    entityManager;
    configService;
    cacheService;
    general;
    settingEntityRepo;
    log = new logger_handler_1.LoggerHandler().getInstance();
    constructor(entityManager, configService, cacheService, general, settingEntityRepo) {
        this.entityManager = entityManager;
        this.configService = configService;
        this.cacheService = cacheService;
        this.general = general;
        this.settingEntityRepo = settingEntityRepo;
    }
    getListFilterClause(queryObject, filterParams, filterConfig) {
        let { filters } = filterParams;
        const { keyword } = filterParams;
        const serviceConfig = filterConfig.service_config;
        const listConfig = filterConfig.list_config;
        const formConfig = filterConfig.form_config;
        const multipleCtrls = ['multi_select_dropdown', 'checkboxes'];
        const nullOperators = ['empty', 'notempty'];
        if (typeof filters === 'string') {
            try {
                filters = JSON.parse(filters);
            }
            catch (err) {
                filters = [];
            }
        }
        const searchFilters = [];
        if (_.isArray(filters) && filters.length > 0) {
            for (const item of filters) {
                if (_.isArray(item.value)) {
                    if (item.operator == 'notin' || item.operator == 'notcontain') {
                        searchFilters.push({
                            alias: item.key,
                            value: item.value,
                            condition: 'notin',
                        });
                    }
                    else {
                        searchFilters.push({
                            alias: item.key,
                            value: item.value,
                            condition: 'range',
                        });
                    }
                }
                else if (item.operator) {
                    searchFilters.push({
                        alias: item.key,
                        value: item.value,
                        condition: item.operator,
                    });
                }
                else {
                    searchFilters.push({
                        alias: item.key,
                        value: item.value,
                        condition: 'begin',
                    });
                }
            }
        }
        if ((_.isArray(searchFilters) && searchFilters.length) ||
            !custom.isEmpty(keyword)) {
            const brackets = new typeorm_2.Brackets((qb) => {
                if (_.isArray(searchFilters) && searchFilters.length) {
                    let searchFiltersObject = {};
                    for (const item of searchFilters) {
                        const aliasName = item.alias;
                        const searchVal = item.value;
                        const operator = item.condition;
                        if (!(aliasName in listConfig)) {
                            return;
                        }
                        const fieldConfig = listConfig[aliasName];
                        let displayQuery = fieldConfig.display_query;
                        let sourceConfig = {};
                        let havingMulti = null;
                        let rawQuery = null;
                        if (fieldConfig.entry_type === 'Custom') {
                            rawQuery = true;
                        }
                        else {
                            if (serviceConfig.table_alias === fieldConfig.table_alias) {
                                sourceConfig = formConfig[fieldConfig.form_field];
                            }
                            else if (fieldConfig.form_field in formConfig) {
                                sourceConfig = formConfig[fieldConfig.form_field];
                                if (['in', 'range', 'notin'].includes(operator)) {
                                    displayQuery = `${sourceConfig.table_alias}.${sourceConfig.field_name}`;
                                }
                            }
                        }
                        if (fieldConfig.sql_func) {
                            displayQuery = this.processSQLFunction(fieldConfig.sql_func, displayQuery);
                            rawQuery = true;
                        }
                        else {
                            rawQuery = false;
                        }
                        if (multipleCtrls.includes(fieldConfig.type) ||
                            (fieldConfig.type === 'autocomplete' && sourceConfig.multiple)) {
                            havingMulti = true;
                        }
                        if (custom.isEmpty(searchVal) &&
                            !nullOperators.includes(operator)) {
                            return;
                        }
                        if (aliasName in searchFiltersObject) {
                            searchFiltersObject[aliasName] += 1;
                        }
                        else {
                            searchFiltersObject[aliasName] = 0;
                        }
                        let whereString = '';
                        let paramObj = {};
                        switch (operator) {
                            case 'notequal':
                                whereString = `${displayQuery} <> :${`${aliasName}_${searchFiltersObject[aliasName]}`}`;
                                paramObj = {
                                    [`${aliasName}_${searchFiltersObject[aliasName]}`]: searchVal,
                                };
                                break;
                            case 'less':
                                whereString = `${displayQuery} < :${`${aliasName}_${searchFiltersObject[aliasName]}`}`;
                                paramObj = {
                                    [`${aliasName}_${searchFiltersObject[aliasName]}`]: searchVal,
                                };
                                break;
                            case 'lte':
                                whereString = `${displayQuery} <= :${`${aliasName}_${searchFiltersObject[aliasName]}`}`;
                                paramObj = {
                                    [`${aliasName}_${searchFiltersObject[aliasName]}`]: searchVal,
                                };
                                break;
                            case 'greater':
                                whereString = `${displayQuery} > :${`${aliasName}_${searchFiltersObject[aliasName]}`}`;
                                paramObj = {
                                    [`${aliasName}_${searchFiltersObject[aliasName]}`]: searchVal,
                                };
                                break;
                            case 'gte':
                                whereString = `${displayQuery} >= :${`${aliasName}_${searchFiltersObject[aliasName]}`}`;
                                paramObj = {
                                    [`${aliasName}_${searchFiltersObject[aliasName]}`]: searchVal,
                                };
                                break;
                            case 'begin':
                                whereString = `${displayQuery} LIKE :${`${`${aliasName}_${searchFiltersObject[aliasName]}`}_1`}`;
                                paramObj = {
                                    [`${`${aliasName}_${searchFiltersObject[aliasName]}`}_1`]: `${searchVal}%`,
                                };
                                break;
                            case 'notbegin':
                                whereString = `${displayQuery} NOT LIKE :${`${aliasName}_${searchFiltersObject[aliasName]}`}`;
                                paramObj = {
                                    [`${aliasName}_${searchFiltersObject[aliasName]}`]: `${searchVal}%`,
                                };
                                break;
                            case 'end':
                                whereString = `${displayQuery} LIKE :${`${aliasName}_${searchFiltersObject[aliasName]}`}`;
                                paramObj = {
                                    [`${aliasName}_${searchFiltersObject[aliasName]}`]: `%${searchVal}`,
                                };
                                break;
                            case 'notend':
                                whereString = `${displayQuery} NOT LIKE :${`${aliasName}_${searchFiltersObject[aliasName]}`}`;
                                paramObj = {
                                    [`${aliasName}_${searchFiltersObject[aliasName]}`]: `%${searchVal}`,
                                };
                                break;
                            case 'contain':
                                whereString = `${displayQuery} LIKE :${`${aliasName}_${searchFiltersObject[aliasName]}`}`;
                                paramObj = {
                                    [`${aliasName}_${searchFiltersObject[aliasName]}`]: `%${searchVal}%`,
                                };
                                break;
                            case 'notcontain':
                                whereString = `${displayQuery} NOT LIKE :${`${aliasName}_${searchFiltersObject[aliasName]}`}`;
                                paramObj = {
                                    [`${aliasName}_${searchFiltersObject[aliasName]}`]: `%${searchVal}%`,
                                };
                                break;
                            case 'in':
                            case 'range':
                                if (_.isArray(searchVal) && searchVal.length > 0) {
                                    if (havingMulti) {
                                        const rangeData = searchVal.join('|');
                                        whereString = `CONCAT(',', ${displayQuery}, ',') REGEXP ',(:${`${aliasName}_${searchFiltersObject[aliasName]}`}),'`;
                                        paramObj = {
                                            [`${aliasName}_${searchFiltersObject[aliasName]}`]: rangeData,
                                        };
                                    }
                                    else {
                                        whereString = `${displayQuery} IN (:...${`${aliasName}_${searchFiltersObject[aliasName]}`})`;
                                        paramObj = {
                                            [`${aliasName}_${searchFiltersObject[aliasName]}`]: searchVal,
                                        };
                                    }
                                }
                                else if (_.isString(searchVal)) {
                                    whereString = `${displayQuery} = :${`${aliasName}_${searchFiltersObject[aliasName]}`}`;
                                    paramObj = {
                                        [`${aliasName}_${searchFiltersObject[aliasName]}`]: searchVal,
                                    };
                                }
                                break;
                            case 'notin':
                                if (_.isArray(searchVal) && searchVal.length > 0) {
                                    whereString = `${displayQuery} NOT IN (:...${`${aliasName}_${searchFiltersObject[aliasName]}`})`;
                                    paramObj = {
                                        [`${aliasName}_${searchFiltersObject[aliasName]}`]: searchVal,
                                    };
                                }
                                else if (_.isString(searchVal)) {
                                    whereString = `${displayQuery} <> :${`${aliasName}_${searchFiltersObject[aliasName]}`}`;
                                    paramObj = {
                                        [`${aliasName}_${searchFiltersObject[aliasName]}`]: searchVal,
                                    };
                                }
                                break;
                            case 'between':
                                if (_.isObject(searchVal) &&
                                    searchVal['from'] &&
                                    searchVal['to']) {
                                    whereString = `(${displayQuery} BETWEEN :${`${aliasName}_${searchFiltersObject[aliasName]}`}_start AND :${`${aliasName}_${searchFiltersObject[aliasName]}`}_end)`;
                                    paramObj = {
                                        [`${`${aliasName}_${searchFiltersObject[aliasName]}`}_start`]: searchVal['from'],
                                        [`${`${aliasName}_${searchFiltersObject[aliasName]}`}_end`]: searchVal['to'],
                                    };
                                }
                                else if (_.isArray(searchVal) && searchVal.length == 2) {
                                    whereString = `(${displayQuery} BETWEEN :${`${aliasName}_${searchFiltersObject[aliasName]}`}_start AND :${`${aliasName}_${searchFiltersObject[aliasName]}`}_end)`;
                                    paramObj = {
                                        [`${`${aliasName}_${searchFiltersObject[aliasName]}`}_start`]: searchVal[0],
                                        [`${`${aliasName}_${searchFiltersObject[aliasName]}`}_end`]: searchVal[1],
                                    };
                                }
                                break;
                            case 'empty':
                                whereString = `(${displayQuery} IS NULL OR ${displayQuery} = '')`;
                                paramObj = {};
                                break;
                            case 'notempty':
                                whereString = `(${displayQuery} IS NOT NULL OR ${displayQuery} <> '')`;
                                paramObj = {};
                                break;
                            default:
                                whereString = `${displayQuery} = :${`${aliasName}_${searchFiltersObject[aliasName]}`}`;
                                paramObj = {
                                    [`${aliasName}_${searchFiltersObject[aliasName]}`]: searchVal,
                                };
                                break;
                        }
                        if (filterParams.filterMatch == 'or') {
                            qb.orWhere(whereString, paramObj);
                        }
                        else {
                            qb.andWhere(whereString, paramObj);
                        }
                    }
                }
                if (!custom.isEmpty(keyword)) {
                    if ('column_filters' in serviceConfig) {
                        const columnFilters = serviceConfig.column_filters;
                        if (_.isArray(columnFilters) && columnFilters.length > 0) {
                            const subBrackets = new typeorm_2.Brackets((qb) => {
                                for (const aliasName of columnFilters) {
                                    if (aliasName in listConfig) {
                                        const fieldConfig = listConfig[aliasName];
                                        let displayQuery = fieldConfig.display_query;
                                        let rawQuery = null;
                                        if (fieldConfig.entry_type === 'Custom') {
                                            rawQuery = true;
                                        }
                                        else {
                                            rawQuery = false;
                                        }
                                        if (fieldConfig.sql_func) {
                                            displayQuery = this.processSQLFunction(fieldConfig.sql_func, displayQuery);
                                            rawQuery = true;
                                        }
                                        qb.orWhere(`${displayQuery} LIKE :keyword`, {
                                            keyword: `%${keyword}%`,
                                        });
                                    }
                                }
                            });
                            qb.where(subBrackets);
                        }
                    }
                    else if ('global_filters' in serviceConfig) {
                    }
                }
            });
            queryObject.andWhere(brackets);
        }
    }
    getListSortingClause(queryObject, sortParams, sortConfig) {
        if (typeof sortParams.sort === 'string') {
            try {
                sortParams.sort = JSON.parse(sortParams.sort);
            }
            catch (err) {
                sortParams.sort = [];
            }
        }
        const sortList = sortParams.sort;
        const serviceConfig = sortConfig.service_config;
        const listConfig = sortConfig.list_config;
        if (sortConfig.default_sort) {
            const defaultList = serviceConfig.default_sorting;
            if (_.isArray(defaultList) && defaultList.length > 0) {
                for (const sortObj of defaultList) {
                    if (sortObj.dir.toLowerCase() === 'desc') {
                        queryObject.addOrderBy(`${sortObj.prop}`, 'DESC');
                    }
                    else {
                        queryObject.addOrderBy(`${sortObj.prop}`, 'ASC');
                    }
                }
            }
        }
        if (_.isArray(sortList) && sortList.length > 0) {
            for (const sortObj of sortList) {
                if (sortObj.prop in listConfig) {
                    if (sortObj.dir.toLowerCase() === 'down' ||
                        sortObj.dir.toLowerCase() === 'desc') {
                        queryObject.addOrderBy(`${sortObj.prop}`, 'DESC');
                    }
                    else {
                        queryObject.addOrderBy(`${sortObj.prop}`, 'ASC');
                    }
                }
            }
        }
        else if (_.isObject(sortList) && !_.isEmpty(sortList)) {
            const aliasName = Object.keys(sortList)[0];
            const dataOrder = Object.values(sortList)[0];
            if (aliasName in listConfig) {
                if (typeof dataOrder == 'string' &&
                    dataOrder.toLowerCase() === 'desc') {
                    queryObject.addOrderBy(`${aliasName}`, 'DESC');
                }
                else {
                    queryObject.addOrderBy(`${aliasName}`, 'ASC');
                }
            }
        }
    }
    isEnclosedWithQuote = (keyword) => {
        if (keyword.substr(0, 1) === '"' &&
            keyword.substr(-1) === '"' &&
            (keyword.match(/"/g) || []).length === 2) {
            return true;
        }
        return false;
    };
    processSQLFunction(sqlStmt, queryStmt) {
        let finalQuery = queryStmt;
        if (sqlStmt) {
            if (sqlStmt.indexOf('%q') >= 0) {
                finalQuery = sqlStmt.replace('%q', queryStmt);
            }
            else {
                finalQuery = sqlStmt;
            }
        }
        return finalQuery;
    }
    convertServerData = (fieldValue, fieldConfig) => {
        let finalValue = fieldValue;
        if (['date', 'date_and_time', 'time'].includes(fieldConfig.type)) {
            if (fieldConfig.type === 'date') {
                finalValue = this.general.getDateTime('cus_date', {
                    value: fieldValue,
                    format: fieldConfig.format,
                });
            }
            else if (fieldConfig.type === 'time') {
                finalValue = this.general.getDateTime('cus_time', {
                    value: fieldValue,
                    format: fieldConfig.format,
                });
            }
            else {
                finalValue = this.general.getDateTime('cus_datetime', {
                    value: fieldValue,
                    format: fieldConfig.format,
                });
            }
        }
        return finalValue;
    };
    convertClientData = (fieldValue, fieldConfig) => {
        let finalValue = fieldValue;
        if (['date', 'date_and_time', 'time'].includes(fieldConfig.type)) {
            if (fieldConfig.type === 'date_and_time') {
                finalValue = this.general.getDateTime('cus_date', {
                    value: fieldValue,
                    format: 'yyyy-MM-dd',
                });
            }
            else if (fieldConfig.type === 'time') {
                finalValue = this.general.getDateTime('cus_time', {
                    value: fieldValue,
                    format: 'HH:mm:ss',
                });
            }
            else {
                finalValue = this.general.getDateTime('cus_time', {
                    value: fieldValue,
                    format: 'yyyy-MM-dd HH:mm:ss',
                });
            }
        }
        return finalValue;
    };
    async getServiceObject(serviceName, folderName) {
        const servicePath = `../modules/api/${folderName}/services/module/${serviceName}.module.service`;
        const serviceObject = await Promise.resolve(`${servicePath}`).then(s => __importStar(require(s)));
        const newObject = new serviceObject.default();
        return newObject;
    }
    async uploadFormFile(reqParams, reqFiles) {
        let success;
        let message;
        let data;
        try {
            const moduleName = reqParams.module;
            const fieldName = reqParams.name;
            const fielData = reqFiles.file_data;
            if (!moduleName) {
                throw new Error('Module name is required');
            }
            if (!fieldName) {
                throw new Error('Field name is required');
            }
            if (_.isEmpty(fielData)) {
                throw new Error('Upload file is missing');
            }
            if (!_.isObject(cit_modules_1.default[moduleName])) {
                throw new Error('Module configuration is missing');
            }
            const serviceObject = await this.getServiceObject(cit_modules_1.default[moduleName].module_name, cit_modules_1.default[moduleName].folder_name);
            if (!serviceObject || !_.isObject(serviceObject)) {
                throw new Error('Module configuration is missing');
            }
            const formConfig = serviceObject.getFormConfiguration();
            const fieldConfig = formConfig[fieldName];
            if (!_.isObject(fieldConfig)) {
                throw new Error('Field configuration is missing');
            }
            if (!fieldConfig.file_config) {
                throw new Error('File configuration is missing');
            }
            if (!fieldConfig.file_folder) {
                throw new Error('Upload folder is missing');
            }
            if (!this.general.validateFileFormat(fieldConfig.file_format, fielData.originalname)) {
                throw new Error('File extension is not allowed');
            }
            if (!this.general.validateFileSize(fielData.size, fieldConfig.file_size)) {
                throw new Error('File size exceeded the maximum size');
            }
            const fileProp = this.general.getFileAttributes(fielData.originalname);
            const fileName = await this.general.temporaryUpload(fielData);
            await Promise.all(fileName);
            if (reqParams.old_file) {
                const oldFile = `${this.configService.get('app.upload_temp_path')}${reqParams.old_file}`;
                if (this.general.isFile(oldFile)) {
                    this.general.deleteFile(oldFile);
                }
            }
            const apiURL = await this.cacheService.get('API_URL');
            const tempUrl = this.configService.get('app.upload_temp_url');
            data = {
                name: fileName,
                url: `${apiURL}/${tempUrl}${fileName}`,
                type: fileProp.file_cat,
                width: '',
                height: '',
            };
            if (fileProp.file_cat === 'image') {
                if (fieldConfig.file_width) {
                    data.width = parseInt(fieldConfig.file_width, 10);
                }
                if (fieldConfig.file_height) {
                    data.height = parseInt(fieldConfig.file_height, 10);
                }
                if (data.width || data.height) {
                    data.url = await this.general.getResizeImageUrl(data.url, data.width, data.height, {
                        source: 'local',
                        resize_mode: 'cover',
                    });
                }
            }
            success = 1;
            message = 'File uploaded successfully';
            return response_handler_1.ResponseHandler.standard(200, success, message, data);
        }
        catch (err) {
            this.log.error('uploadFormFile >> Error:', err);
            return response_handler_1.ResponseHandler.error(200, err.message);
        }
    }
    deleteFormFile = async (reqParams) => {
        let success;
        let message;
        try {
            const moduleName = reqParams.module;
            const fieldName = reqParams.name;
            let recordIds = [];
            if (_.isArray(reqParams.ids)) {
                recordIds = reqParams.ids;
            }
            else if (reqParams.ids) {
                recordIds = reqParams.ids.split(',');
            }
            if (!_.isArray(recordIds) || !recordIds.length) {
                throw new Error('Record ids are missing');
            }
            if (!_.isObject(cit_modules_1.default[moduleName])) {
                throw new Error('Module configuration is missing');
            }
            const serviceObject = await this.getServiceObject(cit_modules_1.default[moduleName].module_name, cit_modules_1.default[moduleName].folder_name);
            if (!serviceObject || !_.isObject(serviceObject)) {
                throw new Error('Module configuration is missing');
            }
            const { serviceConfig } = serviceObject;
            const formConfig = serviceObject.getFormConfiguration();
            const fieldConfig = formConfig[fieldName];
            if (!_.isObject(fieldConfig)) {
                throw new Error('Field configuration is missing');
            }
            if (!fieldConfig.file_config) {
                throw new Error('File configuration is missing');
            }
            const primaryKey = serviceConfig.primary_key;
            const queryField = fieldConfig.field_name;
            const table_name = serviceConfig.table_name;
            const query = `UPDATE ${table_name} SET ${queryField} = null where ${primaryKey} IN (${recordIds})`;
            const queryResult = await this.settingEntityRepo.query(query);
            const { affected } = queryResult;
            if (affected == 0) {
                throw new Error('Failure in file(s) deletion');
            }
            success = 1;
            message = 'File(s) deleted successfully';
            return response_handler_1.ResponseHandler.standard(200, success, message, []);
        }
        catch (err) {
            this.log.error('deleteFormFile >> Error:', err);
            success = 0;
            message = err.message;
            return response_handler_1.ResponseHandler.error(200, message);
        }
    };
    downloadFormFile = async (reqParams) => {
        let success;
        let message;
        let data;
        try {
            const moduleName = reqParams.module;
            const fieldName = reqParams.name;
            let recordIds = [];
            if (_.isArray(reqParams.ids)) {
                recordIds = reqParams.ids;
            }
            else if (reqParams.ids) {
                recordIds = reqParams.ids.split(',');
            }
            if (!_.isArray(recordIds) || !recordIds.length) {
                throw new Error('Record ids are missing');
            }
            if (!_.isObject(cit_modules_1.default[moduleName])) {
                throw new Error('Module configuration is missing');
            }
            const serviceObject = await this.getServiceObject(cit_modules_1.default[moduleName].module_name, cit_modules_1.default[moduleName].folder_name);
            if (!serviceObject || !_.isObject(serviceObject)) {
                throw new Error('Module configuration is missing');
            }
            const { serviceConfig } = serviceObject;
            const formConfig = serviceObject.getFormConfiguration();
            const fieldConfig = formConfig[fieldName];
            if (!_.isObject(fieldConfig)) {
                throw new Error('Field configuration is missing');
            }
            if (!fieldConfig.file_config) {
                throw new Error('File configuration is missing');
            }
            const primaryKey = serviceConfig.primary_key;
            const queryField = fieldConfig.field_name;
            const table_name = serviceConfig.table_name;
            const limit = this.configService.get('app.admin_download_files_limit');
            const query = `SELECT ${primaryKey},${queryField} FROM ${table_name} where ${primaryKey} IN (${recordIds}) limit ${limit}`;
            const queryResult = await this.settingEntityRepo.query(query);
            const fileName = queryResult[0][queryField];
            if (!fileName) {
                throw new Error('No file(s) found to download');
            }
            const fileConfig = {};
            fileConfig.image_name = fileName;
            fileConfig.extensions = fieldConfig.file_format;
            fileConfig.path = fieldConfig.file_folder;
            fileConfig.source = fieldConfig.file_server;
            const downloadUrl = await this.general.getFile(fileConfig, reqParams);
            const tmpUploadPath = this.configService.get('app.upload_temp_path');
            const filePath = `${tmpUploadPath}${fileName}`;
            await this.general.writeURLData(downloadUrl, filePath);
            data = {
                download_path: filePath,
                download_name: fileName,
            };
            success = 1;
            message = 'File(s) downloaded successfully';
        }
        catch (err) {
            this.log.error('downloadFormFile >> Error:', err);
            success = 0;
            message = err.message;
        }
        return {
            settings: {
                success,
                message,
            },
            file: data,
        };
    };
};
exports.ModuleService = ModuleService;
exports.ModuleService = ModuleService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, typeorm_1.InjectRepository)(setting_entity_1.SettingEntity)),
    __metadata("design:paramtypes", [typeorm_2.EntityManager,
        config_1.ConfigService,
        cache_service_1.CacheService,
        cit_general_library_1.CitGeneralLibrary,
        typeorm_2.Repository])
], ModuleService);
//# sourceMappingURL=module.service.js.map
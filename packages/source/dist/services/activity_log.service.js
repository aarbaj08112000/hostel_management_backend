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
var ActivityLogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const logger_handler_1 = require("@repo/source/utilities/logger-handler");
const typeorm_2 = require("typeorm");
const response_library_1 = require("@repo/source/utilities/response-library");
const activity_log_entity_1 = require("@repo/source/entities/activity-log.entity");
const activity_master_entity_1 = require("@repo/source/entities/activity-master.entity");
const custom = __importStar(require("@repo/source/utilities/custom-helper"));
const _ = __importStar(require("lodash"));
const elastic_service_1 = require("./elastic.service");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const file_service_1 = require("@repo/source/services/file.service");
const cache_service_1 = require("@repo/source/services/cache.service");
let ActivityLogService = ActivityLogService_1 = class ActivityLogService {
    fileService;
    basePath = path.join(__dirname, '../..', 'public/upload/activity_logs');
    log = new logger_handler_1.LoggerHandler(ActivityLogService_1.name).getInstance();
    inputParams = {};
    blockResult;
    settingsParams;
    singleKeys = [];
    requestObj = {
        user: {},
    };
    dataSource;
    elasticService;
    response;
    activityLogEntityRepo;
    activityMasterEntityRepo;
    cacheService;
    moduleName;
    moduleAPI;
    serviceConfig;
    constructor(fileService) {
        this.fileService = fileService;
        this.singleKeys = ['insert_activity_log_data'];
        this.moduleName = 'activity_log';
        this.moduleAPI = '';
        this.serviceConfig = {
            module_name: 'activity_log',
            table_name: 'activity_log',
            table_alias: 'am',
            primary_key: 'id',
            primary_alias: 'am_id',
            unique_fields: {},
            expRefer: {},
            topRefer: {},
        };
    }
    setModuleAPI(api) {
        this.moduleAPI = api;
    }
    async uploadActivityLog(reqParams) {
        let result;
        try {
            let date = reqParams?.date;
            if (!date) {
                date = new Date().toISOString();
            }
            const hostDir = path.join(this.basePath);
            const currentDate = date.split('T')[0];
            const file_name = `activity_log_${currentDate}.txt`;
            const fullPath = path.join(hostDir, file_name);
            let options = {
                source: 'amazon',
                upload_path: `activity_logs_${reqParams.aws_folder}/`,
                src_file: fullPath,
                dst_file: file_name,
            };
            let upload_res = await this.fileService.uploadFile(options);
            if (upload_res['success']) {
                result = {
                    success: 1,
                    message: 'Activity Logs uploaded',
                    data: [],
                };
            }
        }
        catch (err) {
            console.log(err);
            result = {
                success: 0,
                message: 'error while uploading Activity Logs',
                data: [],
            };
        }
        return result;
    }
    async startActivityLogList(reqParams) {
        let outputResponse = {};
        try {
            this.setModuleAPI('list');
            let inputParams = reqParams;
            inputParams = await this.getActivityLogList(inputParams);
            if (!_.isEmpty(inputParams.get_activity_log_list)) {
                outputResponse = this.activityLogListFinishSuccess(inputParams);
            }
            else {
                outputResponse = this.activityLogListFinishFailure(inputParams);
            }
        }
        catch (err) {
            console.log(err);
            this.log.error('API Error >> activity_log_add >>', err);
        }
        return outputResponse;
    }
    async getActivityLogList(inputParams, skip_filter) {
        this.blockResult = {};
        try {
            let index = 'nest_local_activity_logs';
            let default_sort = [{ prop: 'added_date', dir: 'desc' }];
            let default_filter;
            if (inputParams.module_code == 'admin' ||
                inputParams.module_code == 'customer') {
                const added_by_type = inputParams.module_code == 'admin' ? 'user' : 'customer';
                default_filter = [
                    { key: 'added_by_type', value: added_by_type, operator: 'equal' },
                    {
                        key: 'added_by_id',
                        value: inputParams.request_id,
                        operator: 'equal',
                    },
                ];
                inputParams.orFilter = [
                    {
                        key: 'module_code',
                        value: inputParams.module_code,
                        operator: 'equal',
                    },
                    {
                        key: 'request_id',
                        value: inputParams.request_id,
                        operator: 'equal',
                    },
                ];
            }
            else {
                default_filter = [
                    {
                        key: 'module_code',
                        value: inputParams.module_code,
                        operator: 'in',
                    },
                ];
                if (inputParams.car_id > 0) {
                    default_filter = [
                        { key: 'car_id', value: inputParams.car_id, operator: 'equal' },
                    ];
                }
                if (inputParams.request_id > 0) {
                    default_filter.push({
                        key: 'request_id',
                        value: inputParams.request_id,
                        operator: 'equal',
                    });
                }
            }
            if (!skip_filter) {
                if ('filters' in inputParams && inputParams.filters != undefined) {
                    inputParams.filters = [...inputParams.filters, ...default_filter];
                }
                else {
                    inputParams = {
                        ...inputParams,
                        filters: default_filter,
                    };
                }
                if ('sort' in inputParams && inputParams.sort != undefined) {
                    inputParams.sort = [...inputParams.sort, default_sort];
                }
                else {
                    inputParams = {
                        ...inputParams,
                        sort: default_sort,
                    };
                }
            }
            let search_params = this.createElasticSearchQuery(inputParams);
            let pageIndex = 1;
            if ('page' in inputParams) {
                pageIndex = Number(inputParams.page);
            }
            else if ('page_index' in inputParams) {
                pageIndex = Number(inputParams.page_index);
            }
            pageIndex = pageIndex > 0 ? pageIndex : 1;
            const recLimit = Number(inputParams.limit);
            const startIdx = custom.getStartIndex(pageIndex, recLimit);
            const results = await this.elasticService.search(index, search_params, startIdx, recLimit);
            if (!_.isObject(results) || _.isEmpty(results)) {
                throw new Error('No records found.');
            }
            const totalCount = results['total']['value'];
            this.settingsParams = custom.getPagination(totalCount, pageIndex, recLimit);
            if (totalCount <= 0) {
                throw new Error('No records found.');
            }
            let data = results.hits.map((hit) => {
                return hit._source;
            });
            if (!skip_filter) {
                const data_obj = data
                    .map((element) => {
                    let dateTimeArr = element.added_date.split(' ');
                    const addedDate = dateTimeArr[0];
                    const addedDateTime = element.added_date;
                    const addedTime = `${dateTimeArr[1]} ${dateTimeArr[2]}`;
                    const val_json = JSON.parse(element.value_json);
                    return {
                        ...element,
                        added_date: addedDate,
                        added_date_time: addedDateTime,
                        added_time: addedTime,
                        icon: val_json?.icon || null,
                    };
                })
                    .reduce((acc, curr) => {
                    if (!acc[curr.added_date]) {
                        acc[curr.added_date] = {
                            date: curr.added_date,
                            activity: [],
                        };
                    }
                    acc[curr.added_date].activity.push(curr);
                    return acc;
                }, {});
                data = Object.values(data_obj);
            }
            if (_.isObject(data) && data.length > 0) {
                const success = 1;
                const message = 'Records found.';
                const queryResult = {
                    success,
                    message,
                    data,
                };
                this.blockResult = queryResult;
            }
            else {
                throw new Error('No records found.');
            }
        }
        catch (err) {
            console.log(err);
            this.blockResult.success = 0;
            this.blockResult.message = err;
            this.blockResult.data = [];
        }
        inputParams.get_activity_log_list = this.blockResult.data;
        return inputParams;
    }
    async startAllActivityLogList(reqParams) {
        let outputResponse = {};
        try {
            this.setModuleAPI('list');
            let inputParams = reqParams;
            inputParams = await this.getAllActivityLogList(inputParams);
            if (!_.isEmpty(inputParams.get_activity_log_list)) {
                outputResponse = this.activityLogListFinishSuccess(inputParams);
            }
            else {
                outputResponse = this.activityLogListFinishFailure(inputParams);
            }
        }
        catch (err) {
            console.log(err);
            this.log.error('API Error >> activity_log_add >>', err);
        }
        return outputResponse;
    }
    async getAllActivityLogList(inputParams) {
        this.blockResult = {};
        try {
            let index = 'nest_local_activity_logs';
            let search_params = this.createElasticSearchQuery(inputParams);
            let pageIndex = 1;
            if ('page' in inputParams) {
                pageIndex = Number(inputParams.page);
            }
            else if ('page_index' in inputParams) {
                pageIndex = Number(inputParams.page_index);
            }
            pageIndex = pageIndex > 0 ? pageIndex : 1;
            const recLimit = Number(inputParams.limit);
            const startIdx = custom.getStartIndex(pageIndex, recLimit);
            const results = await this.elasticService.search(index, search_params, startIdx, recLimit);
            if (!_.isObject(results) || _.isEmpty(results)) {
                throw new Error('No records found.');
            }
            const totalCount = results['total']['value'];
            this.settingsParams = custom.getPagination(totalCount, pageIndex, recLimit);
            if (totalCount <= 0) {
                throw new Error('No records found.');
            }
            let data = results.hits.map((hit) => {
                return hit._source;
            });
            if (_.isObject(data) && data.length > 0) {
                const success = 1;
                const message = 'Records found.';
                const queryResult = {
                    success,
                    message,
                    data,
                };
                this.blockResult = queryResult;
            }
            else {
                throw new Error('No records found.');
            }
        }
        catch (err) {
            console.log(err);
            this.blockResult.success = 0;
            this.blockResult.message = err;
            this.blockResult.data = [];
        }
        inputParams.get_activity_log_list = this.blockResult.data;
        return inputParams;
    }
    replaceTemplatePlaceholders(valueJson, template) {
        let values;
        try {
            values = JSON.parse(valueJson);
        }
        catch (error) {
            throw new Error('Invalid JSON format in valueJson');
        }
        return template.replace(/#(.*?)#/g, (_, key) => {
            return values[key] ?? `#${key}#`;
        });
    }
    activityLogListFinishFailure(inputParams) {
        const settingFields = {
            status: 200,
            success: 0,
            message: custom.lang('Activity not found.'),
            fields: [],
        };
        return this.response.outputResponse({
            settings: settingFields,
            data: inputParams,
        }, {
            name: 'activity_log_list',
        });
    }
    activityLogListFinishSuccess(inputParams) {
        const settingFields = {
            status: 200,
            success: 1,
            message: custom.lang('activity list found.'),
            fields: [],
        };
        settingFields.fields = [
            'date',
            'activity',
            'car_id',
            'value_json',
            'activity_master_id',
            'activity_code',
            'module_code',
            'request_id',
            'added_by_id',
            'added_by_name',
            'added_by_type',
            'template',
            'activity_msg',
            'added_date',
        ];
        const outputKeys = ['get_activity_log_list'];
        const outputData = {};
        outputData.settings = { ...settingFields, ...this.settingsParams };
        outputData.data = inputParams;
        const funcData = {};
        funcData.name = 'activity_log_list';
        funcData.output_keys = outputKeys;
        return this.response.outputResponse(outputData, funcData);
    }
    async startActivityLogAdd(reqParams) {
        let outputResponse = {};
        try {
            this.setModuleAPI('add');
            let inputParams = reqParams;
            const data = await this.getActivityMasterData(inputParams.activity_code);
            if (data?.activity_master_id > 0) {
                inputParams.activity_master_id = data.activity_master_id;
                inputParams.param = data.value_json;
                inputParams.template = data.template;
                inputParams = await this.insertActivityLogElastic(inputParams);
                if (inputParams.success) {
                    outputResponse = this.activityLogFinishSuccess(inputParams, 'Activity Added successfully.');
                }
                else {
                    outputResponse = this.activityLogFinishFailure(inputParams);
                }
            }
            else {
                outputResponse = this.activityLogFinishFailure(inputParams);
            }
        }
        catch (err) {
            console.log(err);
            this.log.error('API Error >> activity_log_add >>', err);
        }
        return outputResponse;
    }
    async writeUserActivity(file_content) {
        try {
            const hostDir = path.join(this.basePath);
            const currentDate = new Date().toISOString().split('T')[0];
            const file_name = `activity_log_${currentDate}.txt`;
            const fullPath = path.join(hostDir, file_name);
            const jsonLine = JSON.stringify(file_content) + ',\n';
            await fs_1.promises.appendFile(fullPath, jsonLine, 'utf8');
            return { success: true, data: fullPath };
        }
        catch (err) {
            return { success: false, data: err.message };
        }
    }
    async getActivityMasterData(activity_code) {
        let queryObject = this.activityMasterEntityRepo.createQueryBuilder('am');
        queryObject.select('am.id', 'activity_master_id');
        queryObject.addSelect('am.params', 'value_json');
        queryObject.addSelect('am.template', 'template');
        queryObject.where('am.code = :activity_code', {
            activity_code: activity_code,
        });
        queryObject.andWhere('am.status = :status', { status: 'Active' });
        let data = await queryObject.getRawOne();
        return data;
    }
    async insertActivityLogElastic(inputParams) {
        this.blockResult = {};
        let attachment_data = [];
        let comment = [];
        let inputDate = '';
        try {
            const logData = {};
            if ('value_json' in inputParams && 'param' in inputParams) {
                const paramObj = JSON.parse(inputParams.param);
                const valObj = typeof inputParams.value_json === 'object'
                    ? { ...inputParams.value_json }
                    : {};
                if ('added_date' in valObj) {
                    inputDate = valObj?.added_date;
                }
                for (const key of Object.keys(paramObj)) {
                    if (!(key in valObj) || valObj[key] === undefined) {
                        valObj[key] = null;
                    }
                    if (valObj.CAR_ID > 0) {
                        logData.car_id = valObj.CAR_ID ?? null;
                    }
                }
                if ('ATTACHMENT' in valObj) {
                    attachment_data = valObj?.ATTACHMENT;
                }
                if ('COMMENT' in valObj) {
                    comment = valObj?.COMMENT;
                }
                logData.value_json = JSON.stringify(valObj);
            }
            logData.activity_master_id = inputParams.activity_master_id ?? null;
            logData.activity_code = inputParams.activity_code ?? null;
            logData.module_code = inputParams.module_code ?? null;
            logData.request_id = inputParams.request_id ?? null;
            logData.added_by_id = inputParams.added_by ?? null;
            logData.added_by_name = inputParams.added_by_name ?? null;
            logData.added_by_type = inputParams.added_by_type ?? null;
            logData.template = inputParams.template ?? null;
            logData.attachment = attachment_data ?? null;
            logData.comment = comment ?? null;
            logData.activity_msg = this.replaceTemplatePlaceholders(logData.value_json, logData.template);
            logData.activity_for = inputParams?.activity_for;
            let timeZone = await this.cacheService.get('TIME_ZONE');
            let parsedTimeZone = JSON.parse(timeZone);
            let zone = parsedTimeZone?.zone;
            const now = new Date();
            const modifiedZone = new Date(now.toLocaleString('en-US', { timeZone: zone }));
            if (inputDate) {
                const dateObj = new Date(new Date(inputDate.replace(' ', 'T')).toLocaleString('en-US', {
                    timeZone: zone,
                }));
                if (isNaN(dateObj.getTime())) {
                    logData.added_date = dateObj.toISOString();
                }
                else {
                    logData.added_date = dateObj.toISOString();
                }
            }
            else {
                logData.added_date = modifiedZone.toISOString();
            }
            const res = await this.elasticService.insertActivityLogElasticData('activity_logs', logData);
            const activity_file_data = await this.writeUserActivity(logData);
            const success = 1;
            const message = 'Activity Added Successfully.';
            const queryResult = {
                success,
                message,
            };
            this.blockResult = queryResult;
        }
        catch (err) {
            console.log(err);
            this.blockResult.success = 0;
            this.blockResult.message = err;
        }
        return this.blockResult;
    }
    async insertActivityLogData(inputParams) {
        this.blockResult = {};
        try {
            const queryColumns = {};
            if ('activity_master_id' in inputParams) {
                queryColumns.activityMasterId = inputParams.activity_master_id;
            }
            if ('value_json' in inputParams && 'param' in inputParams) {
                const paramObj = JSON.parse(inputParams.param);
                const valObj = typeof inputParams.value_json === 'object'
                    ? { ...inputParams.value_json }
                    : {};
                for (const key of Object.keys(paramObj)) {
                    if (!(key in valObj) || valObj[key] === undefined) {
                        valObj[key] = null;
                    }
                    if (valObj.CAR_ID > 0) {
                        queryColumns.carId = valObj.CAR_ID;
                    }
                }
                queryColumns.valueJson = JSON.stringify(valObj);
            }
            if ('module_code' in inputParams) {
                queryColumns.moduleCode = inputParams.module_code;
            }
            if ('request_id' in inputParams) {
                queryColumns.requestId = inputParams.request_id;
            }
            if ('added_by' in inputParams) {
                queryColumns.addedBy = inputParams.added_by;
            }
            queryColumns.addedDate = () => 'NOW()';
            const queryObject = this.activityLogEntityRepo;
            const res = await queryObject.insert(queryColumns);
            const data = {
                insert_id: res.raw.insertId,
            };
            const success = 1;
            const message = 'Activity Added Successfully.';
            const queryResult = {
                success,
                message,
                data,
            };
            this.blockResult = queryResult;
        }
        catch (err) {
            console.log(err);
            this.blockResult.success = 0;
            this.blockResult.message = err;
            this.blockResult.data = [];
        }
        inputParams.insert_activity_log_data = this.blockResult.data;
        inputParams = this.response.assignSingleRecord(inputParams, this.blockResult.data);
        return inputParams;
    }
    async activityLogFinishSuccess(inputParams, message) {
        const settingFields = {
            status: 200,
            success: 1,
            message: message,
            fields: [],
        };
        settingFields.fields = ['insert_id', 'insert_activity_log_data'];
        const outputKeys = ['insert_activity_log_data'];
        const outputAliases = {
            insert_id: 'id',
        };
        const outputObjects = ['insert_activity_log_data'];
        const outputData = {};
        outputData.settings = settingFields;
        outputData.data = inputParams;
        const funcData = {};
        funcData.name = 'activity_log_add';
        funcData.output_keys = outputKeys;
        funcData.output_alias = outputAliases;
        funcData.output_objects = outputObjects;
        funcData.single_keys = this.singleKeys;
        return this.response.outputResponse(outputData, funcData);
    }
    activityLogFinishFailure(inputParams) {
        const settingFields = {
            status: 200,
            success: 0,
            message: custom.lang('Something went wrong, Please try again.'),
            fields: [],
        };
        return this.response.outputResponse({
            settings: settingFields,
            data: inputParams,
        }, {
            name: 'activity_log_add',
        });
    }
    createElasticSearchQuery(params) {
        let is_front = params?.is_front == 'Yes' ? 'Yes' : 'No';
        const { filters = {}, sort = {}, orFilter = {} } = params;
        const cleanedQueryParams = this.removeEmptyKeys(filters);
        const cleanedSortParams = this.removeEmptyKeys(sort);
        const extraCondition = this.removeEmptyKeys(orFilter);
        return this.buildElasticsearchSQLQuery(cleanedQueryParams, cleanedSortParams, extraCondition);
    }
    getYearsBetween(startYear, endYear) {
        let years = [];
        for (let year = startYear; year <= endYear; year++) {
            years.push(parseInt(year));
        }
        return years;
    }
    removeEmptyKeys(obj) {
        return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value !== undefined && value !== null && value !== ''));
    }
    buildElasticsearchSQLQuery(cleanedQueryParams, cleanedSortParams, extraCondition) {
        let conditions = [];
        let extraConditions = [];
        let sortConditions = [];
        if (cleanedQueryParams) {
            conditions = this.getCondition(cleanedQueryParams);
        }
        if (extraCondition) {
            extraConditions = this.getCondition(extraCondition);
        }
        if (cleanedSortParams && Object.keys(cleanedSortParams).length) {
            Object.entries(cleanedSortParams).forEach(([_, sort]) => {
                const { prop, dir } = sort;
                sortConditions.push(`${prop} ${dir.toUpperCase()}`);
            });
        }
        let query = '';
        if (conditions.length > 0 || extraConditions.length > 0) {
            const whereClauses = [];
            if (conditions.length > 0) {
                whereClauses.push(`(${conditions.join(' AND ')})`);
            }
            if (extraConditions.length > 0) {
                whereClauses.push(`(${extraConditions.join(' AND ')})`);
            }
            query += `WHERE ${whereClauses.join(' OR ')}`;
        }
        if (sortConditions.length > 0) {
            query += ` ORDER BY ${sortConditions.join(', ')}`;
        }
        return query
            ? {
                query,
                is_admin: 'Yes',
                original_params: cleanedQueryParams,
                original_order: cleanedSortParams,
            }
            : '';
    }
    getCondition(params) {
        let conditions = [];
        const isNumericString = (val) => {
            return typeof val === 'string' && !isNaN(val) && val.trim() !== '';
        };
        const formatValue = (val) => {
            if (typeof val === 'number')
                return `${val}`;
            if (isNumericString(val))
                return `${Number(val)}`;
            return `'${val}'`;
        };
        Object.entries(params).forEach(([_, values]) => {
            if (typeof values === 'object' &&
                'key' in values &&
                'value' in values &&
                'operator' in values) {
                let { key, value, operator } = values;
                switch (operator) {
                    case 'begin':
                        conditions.push(`${key} LIKE '${value}%'`);
                        break;
                    case 'notbegin':
                        conditions.push(`${key} NOT LIKE '${value}%'`);
                        break;
                    case 'end':
                        conditions.push(`${key} LIKE '%${value}'`);
                        break;
                    case 'notend':
                        conditions.push(`${key} NOT LIKE '%${value}'`);
                        break;
                    case 'contain':
                        conditions.push(`${key} LIKE '%${value}%'`);
                        break;
                    case 'notcontain':
                        conditions.push(`${key} NOT LIKE '%${value}%'`);
                        break;
                    case 'equal':
                        conditions.push(`${key} = ${formatValue(value)}`);
                        break;
                    case 'notequal':
                        conditions.push(`${key} != ${formatValue(value)}`);
                        break;
                    case 'in':
                        if (Array.isArray(value)) {
                            const inValues = value.map((v) => formatValue(v)).join(', ');
                            conditions.push(`${key} IN (${inValues})`);
                        }
                        else {
                            conditions.push(`${key} IN (${formatValue(value)})`);
                        }
                        break;
                    case 'notin':
                        if (Array.isArray(value)) {
                            const notInValues = value.map((v) => formatValue(v)).join(', ');
                            conditions.push(`${key} NOT IN (${notInValues})`);
                        }
                        else {
                            conditions.push(`${key} NOT IN (${formatValue(value)})`);
                        }
                        break;
                    case 'empty':
                        conditions.push(`${key} IS NULL`);
                        break;
                    case 'notempty':
                        conditions.push(`${key} IS NOT NULL`);
                        break;
                }
            }
            else {
                conditions.push(`${_.toString()} = ${formatValue(values)}`);
            }
        });
        return conditions;
    }
};
exports.ActivityLogService = ActivityLogService;
__decorate([
    (0, typeorm_1.InjectDataSource)(),
    __metadata("design:type", typeorm_2.DataSource)
], ActivityLogService.prototype, "dataSource", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", elastic_service_1.ElasticService)
], ActivityLogService.prototype, "elasticService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", response_library_1.ResponseLibrary)
], ActivityLogService.prototype, "response", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(activity_log_entity_1.ActivityLogEntity),
    __metadata("design:type", typeorm_2.Repository)
], ActivityLogService.prototype, "activityLogEntityRepo", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(activity_master_entity_1.ActivityMasterEntity),
    __metadata("design:type", typeorm_2.Repository)
], ActivityLogService.prototype, "activityMasterEntityRepo", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", cache_service_1.CacheService)
], ActivityLogService.prototype, "cacheService", void 0);
exports.ActivityLogService = ActivityLogService = ActivityLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [file_service_1.FileService])
], ActivityLogService);
//# sourceMappingURL=activity_log.service.js.map
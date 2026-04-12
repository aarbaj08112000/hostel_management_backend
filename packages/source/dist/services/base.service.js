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
var BaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const _ = __importStar(require("lodash"));
const custom = __importStar(require("../utilities/custom-helper"));
const logger_handler_1 = require("../utilities/logger-handler");
const cit_general_library_1 = require("../utilities/cit-general-library");
const module_service_1 = require("./module.service");
let BaseService = BaseService_1 = class BaseService {
    log = new logger_handler_1.LoggerHandler(BaseService_1.name).getInstance();
    entityManager;
    moduleService;
    general;
    moduleName;
    moduleAPI;
    serviceConfig;
    listConfiguration;
    formConfiguration;
    optionsConfiguration;
    setModuleAPI(api) {
        this.moduleAPI = api;
    }
    async checkUniqueCondition(inputParams) {
        const uniqueFields = this.serviceConfig.unique_fields?.fields;
        const uniqueType = this.serviceConfig.unique_fields?.type;
        let uniqueStatus = 0;
        let uniqueMessage = '';
        if (_.isObject(uniqueFields) && !_.isEmpty(uniqueFields)) {
            const queryConfig = {};
            queryConfig.table_name = this.serviceConfig.table_name;
            queryConfig.select_type = 'count';
            queryConfig.where_type = uniqueType;
            queryConfig.where_fields = [];
            if (uniqueType === 'or' && this.moduleAPI === 'update') {
                queryConfig.where_type = 'raw';
                const whereClauses = [];
                const whereBindings = {};
                Object.keys(uniqueFields).forEach((key) => {
                    const whereKey = uniqueFields[key];
                    const whereVal = inputParams[key];
                    whereClauses.push(`${whereKey} = :${whereKey}`);
                    whereBindings[whereKey] = whereVal;
                });
                const primaryKey = this.serviceConfig.primary_key;
                const primaryVal = inputParams.id;
                whereBindings[primaryKey] = primaryVal;
                const whereCondition = `(${whereClauses.join(' OR ')}) AND ${primaryKey} <> :${primaryKey}`;
                queryConfig.where_condition = whereCondition;
                queryConfig.where_bindings = whereBindings;
            }
            else {
                Object.keys(uniqueFields).forEach((key) => {
                    queryConfig.where_fields.push({
                        field: uniqueFields[key],
                        value: inputParams[key],
                        oper: 'eq',
                    });
                });
                if (this.moduleAPI === 'update') {
                    queryConfig.where_fields.push({
                        field: this.serviceConfig.primary_key,
                        value: inputParams.id,
                        oper: 'ne',
                    });
                }
            }
            const queryResult = await this.executeSelect(queryConfig);
            if (_.isArray(queryResult.data) && queryResult.data.length > 0) {
                if (queryResult.data[0].numrows > 0) {
                    uniqueStatus = 1;
                    uniqueMessage = this.serviceConfig.unique_fields?.message;
                }
            }
        }
        return {
            unique_status: uniqueStatus,
            unique_message: uniqueMessage,
        };
    }
    async listFieldFormatter(val, row, opts) {
        let finalValue = val;
        const rowIdx = opts?.index;
        const fieldName = opts?.field;
        const inputParams = opts?.params;
        const recordId = row[this.serviceConfig.primary_alias];
        const fieldConfig = this.listConfiguration[fieldName];
        if (_.isObject(fieldConfig) && !_.isEmpty(fieldConfig)) {
            let sourceConfig = {};
            let ddConfig = {};
            if (fieldConfig['form_field']) {
                sourceConfig = this.formConfiguration[fieldConfig['form_field']];
                ddConfig = this.optionsConfiguration[fieldConfig['form_field']];
            }
            if (fieldConfig['encryption']) {
                finalValue = await this.general.decryptData(finalValue, fieldConfig['enc_method']);
            }
            if (!_.isEmpty(ddConfig) && ddConfig.type === 'enum') {
                const enumRecord = _.find(ddConfig.list, { id: finalValue });
                if (_.isObject(enumRecord)) {
                    finalValue = enumRecord['val'];
                }
            }
            if (fieldConfig['renderer']) {
                const renderCallback = this.getCallbackObject(fieldConfig['renderer']);
                if (typeof renderCallback === 'function') {
                    finalValue = renderCallback({
                        id: recordId,
                        api: this.moduleAPI,
                        index: rowIdx,
                        value: finalValue,
                        row_data: row,
                        field_name: fieldName,
                        input_params: inputParams,
                        list_config: fieldConfig,
                        form_config: sourceConfig,
                        service_config: this.serviceConfig,
                    });
                }
            }
            else if (fieldConfig['format']) {
                finalValue = this.moduleService.convertServerData(finalValue, fieldConfig);
            }
        }
        return finalValue;
    }
    async detailFieldFormatter(val, row, opts) {
        let finalValue = val;
        const fieldName = opts?.field;
        const inputParams = opts?.params;
        const recordId = row[this.serviceConfig.primary_alias];
        const fieldConfig = this.formConfiguration[fieldName];
        if (_.isObject(fieldConfig) && !_.isEmpty(fieldConfig)) {
            if (fieldConfig['encryption']) {
                finalValue = await this.general.decryptData(finalValue, fieldConfig['enc_method']);
            }
            if (fieldConfig['renderer']) {
                const renderCallback = this.getCallbackObject(fieldConfig['renderer']);
                if (typeof renderCallback === 'function') {
                    finalValue = renderCallback({
                        id: recordId,
                        api: this.moduleAPI,
                        value: finalValue,
                        row_data: row,
                        field_name: fieldName,
                        input_params: inputParams,
                        form_config: fieldConfig,
                        service_config: this.serviceConfig,
                    });
                }
            }
            else if (fieldConfig['format']) {
                finalValue = this.moduleService.convertServerData(finalValue, fieldConfig);
            }
            if (fieldConfig['type'] === 'multi_select_dropdown') {
                if (val) {
                    finalValue = val.split(',').map(Number);
                }
            }
        }
        return finalValue;
    }
    async formFieldFormatter(val, row, opts) {
        let finalValue = val;
        const fieldName = opts?.field;
        const inputParams = opts?.params;
        const fieldConfig = this.formConfiguration[fieldName];
        if (_.isObject(fieldConfig) && !_.isEmpty(fieldConfig)) {
            if (fieldConfig['encryption']) {
                if (fieldConfig['type'] == 'password' && val == '******') {
                    finalValue = undefined;
                }
                else {
                    finalValue = await this.general.encryptData(finalValue, fieldConfig['enc_method']);
                }
            }
            if (fieldConfig['callback']) {
                const saveCallback = this.getCallbackObject(fieldConfig['callback']);
                if (typeof saveCallback === 'function') {
                    finalValue = saveCallback({
                        id: row.id,
                        api: this.moduleAPI,
                        value: finalValue,
                        field_name: fieldName,
                        input_params: inputParams,
                        form_config: fieldConfig,
                        service_config: this.serviceConfig,
                    });
                }
            }
            else if (fieldConfig['format']) {
                finalValue = this.moduleService.convertClientData(finalValue, fieldConfig);
            }
            if (fieldConfig['type'] === 'multi_select_dropdown') {
                if (Array.isArray(val)) {
                    finalValue = val.join(',');
                }
            }
        }
        return finalValue;
    }
    getCallbackObject(callback) {
        if (custom.isEmpty(callback)) {
            return callback;
        }
        if (callback.substring(0, 9) === 'service::' && callback.slice(9) !== '') {
            const serviceMethod = callback.slice(9);
            if (typeof this[serviceMethod] === 'function') {
                return this[serviceMethod];
            }
        }
        else if (callback.substring(0, 9) === 'general::' &&
            callback.slice(9) !== '') {
            const generalMethod = callback.slice(9);
            if (typeof this.general[generalMethod] === 'function') {
                return this.general[generalMethod];
            }
        }
        else {
            return callback;
        }
    }
    async executeQuery(rawQuery, bindings) {
        let success;
        let message;
        let data;
        try {
            if (_.isArray(bindings) && bindings.length > 0) {
                data = await this.entityManager.query(rawQuery, bindings);
            }
            else {
                data = await this.entityManager.query(rawQuery);
            }
            success = 1;
            message = 'Record(s) found.';
        }
        catch (err) {
            success = 0;
            this.log.error(err);
            if (typeof err === 'object') {
                if (err.sqlMessage) {
                    message = err.sqlMessage;
                }
                else if (err.message) {
                    message = err.message;
                }
                else {
                    message = 'Unable to show error message.';
                }
            }
            else if (typeof err === 'string') {
                message = err;
            }
        }
        return {
            success,
            message,
            data,
        };
    }
    async executeSelect(queryConfig) {
        let success;
        let message;
        let data;
        try {
            const tableName = queryConfig.table_name;
            const joinTables = queryConfig.join_tables;
            const selectType = queryConfig.select_type;
            const selectFields = queryConfig.select_fields;
            const whereFields = queryConfig.where_fields;
            const whereType = queryConfig.where_type;
            if (!tableName) {
                const err = { code: 404, message: 'Table name not found.' };
                throw err;
            }
            if (['min', 'max', 'sum', 'avg'].includes(selectType)) {
                if (!_.isArray(selectFields) || !selectFields.length) {
                    const err = { code: 404, message: 'Select columns not found.' };
                    throw err;
                }
            }
            const queryObject = this.entityManager.createQueryBuilder();
            queryObject.from(tableName, tableName);
            if (_.isArray(joinTables) && joinTables.length > 0) {
                this.addJoinTables(queryObject, joinTables);
            }
            if (selectType === 'count') {
                queryObject.select('COUNT(*)', 'numrows');
            }
            else if (selectType === 'min') {
                queryObject.select(`MIN(${selectFields[0].field})`, selectFields[0].alias);
            }
            else if (selectType === 'max') {
                queryObject.select(`MAX(${selectFields[0].field})`, selectFields[0].alias);
            }
            else if (selectType === 'sum') {
                queryObject.select(`SUM(${selectFields[0].field})`, selectFields[0].alias);
            }
            else if (selectType === 'avg') {
                queryObject.select(`AVG(${selectFields[0].field})`, selectFields[0].alias);
            }
            else if (_.isArray(selectFields) && selectFields.length > 0) {
                this.addSelectFields(queryObject, selectFields);
            }
            else {
                queryObject.select('*');
            }
            if (whereType === 'raw') {
                if (queryConfig.where_condition) {
                    if (_.isObject(queryConfig.where_bindings) &&
                        !_.isEmpty(queryConfig.where_bindings)) {
                        queryObject.where(queryConfig.where_condition, queryConfig.where_bindings);
                    }
                    else {
                        queryObject.where(queryConfig.where_condition);
                    }
                }
            }
            else if (_.isArray(whereFields) && whereFields.length > 0) {
                this.addWhereFields(queryObject, whereFields, whereType);
            }
            if (queryConfig.group_by) {
                if (_.isArray(queryConfig.group_by)) {
                    queryObject.groupBy(queryConfig.group_by);
                }
                else {
                    queryObject.groupBy(queryConfig.group_by);
                }
            }
            if (queryConfig.having_condition) {
                if (_.isArray(queryConfig.having_bindings &&
                    queryConfig.having_bindings.length > 0)) {
                    queryObject.having(queryConfig.having_condition, queryConfig.having_bindings);
                }
                else {
                    queryObject.having(queryConfig.having_condition);
                }
            }
            if (queryConfig.order_by) {
                if (_.isArray(queryConfig.order_by)) {
                    for (const item in queryConfig.order_by) {
                        queryObject.addOrderBy(item['prop'], item['dir']);
                    }
                }
                else if (_.isObject(queryConfig.order_by)) {
                    queryObject.addOrderBy(queryConfig.order_by['prop'], queryConfig.order_by['dir']);
                }
            }
            if ('limit' in queryConfig && queryConfig.limit > 0) {
                queryObject.limit(queryConfig.limit);
            }
            if ('offset' in queryConfig && queryConfig.offset >= 0) {
                queryObject.offset(queryConfig.offset);
            }
            data = await queryObject.getRawMany();
            if (!_.isArray(data) || _.isEmpty(data)) {
                const err = { code: 404, message: 'No records found.' };
                throw err;
            }
            success = 1;
            message = 'Record(s) found.';
        }
        catch (err) {
            this.log.error(err);
            success = 0;
            if (typeof err === 'object') {
                if (err.sqlMessage) {
                    message = err.sqlMessage;
                }
                else if (err.message) {
                    message = err.message;
                }
                else {
                    message = 'Unable to show error message.';
                }
            }
            else if (typeof err === 'string') {
                message = err;
            }
        }
        return {
            success,
            message,
            data,
        };
    }
    async executeInsert(queryConfig) {
        let success;
        let message;
        let data;
        try {
            const tableName = queryConfig.table_name;
            const insertFields = queryConfig.insert_fields;
            if (!tableName) {
                const err = { code: 404, message: 'Table name not found.' };
                throw err;
            }
            if (!_.isObject(insertFields) && !_.isArray(insertFields)) {
                const err = { code: 404, message: 'Insert columns not found.' };
                throw err;
            }
            const queryObject = this.entityManager.createQueryBuilder();
            queryObject.insert().into(tableName).values(insertFields);
            const res = await queryObject.execute();
            if (!_.isArray(res) || _.isEmpty(res)) {
                const err = { code: 404, message: 'Failure in insertion.' };
                throw err;
            }
            if (_.isArray(insertFields)) {
                data = {
                    insert_ids: res,
                };
            }
            else {
                data = {
                    insert_id: res,
                };
            }
            success = 1;
            message = 'Record(s) inserted.';
        }
        catch (err) {
            success = 0;
            if (typeof err === 'object') {
                if (err.sqlMessage) {
                    message = err.sqlMessage;
                }
                else if (err.message) {
                    message = err.message;
                }
                else {
                    message = 'Unable to show error message.';
                }
            }
            else if (typeof err === 'string') {
                message = err;
            }
        }
        return {
            success,
            message,
            data,
        };
    }
    async executeUpdate(queryConfig) {
        let success;
        let message;
        let data;
        try {
            const tableName = queryConfig.table_name;
            const updateFields = queryConfig.update_fields;
            const whereFields = queryConfig.where_fields;
            const whereType = queryConfig.where_type;
            if (!tableName) {
                const err = { code: 404, message: 'Table name not found.' };
                throw err;
            }
            if (!_.isObject(updateFields)) {
                const err = { code: 404, message: 'Update columns not found.' };
                throw err;
            }
            const queryObject = this.entityManager.createQueryBuilder();
            if (whereType === 'raw') {
                if (queryConfig.where_condition) {
                    if (_.isArray(queryConfig.where_bindings) &&
                        queryConfig.where_bindings.length > 0) {
                        queryObject.where(queryConfig.where_condition, queryConfig.where_bindings);
                    }
                    else {
                        queryObject.where(queryConfig.where_condition);
                    }
                }
                else {
                    const err = { code: 404, message: 'Where condition not found.' };
                    throw err;
                }
            }
            else if (_.isArray(whereFields) && whereFields.length > 0) {
                this.addWhereFields(queryObject, whereFields, whereType);
            }
            else {
                const err = { code: 404, message: 'Where fields not found.' };
                throw err;
            }
            queryObject.update(tableName).set(updateFields);
            const res = await queryObject.execute();
            if (!res) {
                const err = { code: 404, message: 'Failure in updation.' };
                throw err;
            }
            data = {
                affected_rows: res,
            };
            success = 1;
            message = 'Record(s) updated.';
        }
        catch (err) {
            success = 0;
            if (typeof err === 'object') {
                if (err.sqlMessage) {
                    message = err.sqlMessage;
                }
                else if (err.message) {
                    message = err.message;
                }
                else {
                    message = 'Unable to show error message.';
                }
            }
            else if (typeof err === 'string') {
                message = err;
            }
        }
        return {
            success,
            message,
            data,
        };
    }
    async executeDelete(queryConfig) {
        let success;
        let message;
        let data;
        try {
            const tableName = queryConfig.table_name;
            const whereFields = queryConfig.where_fields;
            const whereType = queryConfig.where_type;
            if (!tableName) {
                const err = { code: 404, message: 'Table name not found.' };
                throw err;
            }
            const queryObject = this.entityManager.createQueryBuilder();
            if (whereType === 'raw') {
                if (queryConfig.where_condition) {
                    if (_.isArray(queryConfig.where_bindings) &&
                        queryConfig.where_bindings.length > 0) {
                        queryObject.where(queryConfig.where_condition, queryConfig.where_bindings);
                    }
                    else {
                        queryObject.where(queryConfig.where_condition);
                    }
                }
                else {
                    const err = { code: 404, message: 'Where condition not found.' };
                    throw err;
                }
            }
            else if (_.isArray(whereFields) && whereFields.length > 0) {
                this.addWhereFields(queryObject, whereFields, whereType);
            }
            else {
                const err = { code: 404, message: 'Where fields not found.' };
                throw err;
            }
            queryObject.delete().from(tableName);
            const res = await queryObject.execute();
            if (!res) {
                const err = { code: 404, message: 'Failure in deletion.' };
                throw err;
            }
            data = {
                affected_rows: res,
            };
            success = 1;
            message = 'Record(s) deleted.';
        }
        catch (err) {
            success = 0;
            if (typeof err === 'object') {
                if (err.sqlMessage) {
                    message = err.sqlMessage;
                }
                else if (err.message) {
                    message = err.message;
                }
                else {
                    message = 'Unable to show error message.';
                }
            }
            else if (typeof err === 'string') {
                message = err;
            }
        }
        return {
            success,
            message,
            data,
        };
    }
    addJoinTables(queryObject, joinDetails) {
        if (!_.isArray(joinDetails) || !joinDetails.length) {
            return;
        }
        joinDetails.forEach((joinObj) => {
            const joinTable = {
                [joinObj.join_alias]: joinObj.join_table,
            };
            const mainField = `${joinObj.main_alias}.${joinObj.main_field}`;
            const joinField = `${joinObj.join_alias}.${joinObj.join_field}`;
            const joinType = joinObj.join_type.toLowerCase();
            const extraJoin = joinObj.extra_join;
            if (joinType === 'right') {
                if (extraJoin) {
                    queryObject
                        .rightJoin(joinTable, mainField, joinField)
                        .joinRaw(extraJoin);
                }
                else {
                    queryObject.rightJoin(joinTable, mainField, joinField);
                }
            }
            else if (joinType === 'left') {
                if (extraJoin) {
                    queryObject
                        .leftJoin(joinTable, mainField, joinField)
                        .joinRaw(extraJoin);
                }
                else {
                    queryObject.leftJoin(joinTable, mainField, joinField);
                }
            }
            else if (extraJoin) {
                queryObject.join(joinTable, mainField, joinField).joinRaw(extraJoin);
            }
            else {
                queryObject.join(joinTable, mainField, joinField);
            }
        });
    }
    addSelectFields(queryObject, fields) {
        if (!_.isArray(fields) || !fields.length) {
            return;
        }
        for (const item of fields) {
            queryObject.addSelect(item.field, item.alias);
        }
    }
    addWhereFields(queryObject, fields, type) {
        if (!_.isArray(fields) || !fields.length) {
            return;
        }
        for (const item of fields) {
            type = type ? type.toLowerCase() : 'and';
            if ('field' in item) {
                const { field } = item;
                const data = 'value' in item ? item.value : undefined;
                const oper = 'oper' in item ? item.oper : 'eq';
                if (data === undefined) {
                    if (type === 'or') {
                        queryObject.orWhere(field);
                    }
                    else {
                        queryObject.andWhere(field);
                    }
                }
                else {
                    switch (oper) {
                        case 'eq':
                        case 'li':
                            if (type === 'or') {
                                queryObject.orWhere(`${field} = :${field}`, {
                                    [field]: data,
                                });
                            }
                            else {
                                queryObject.andWhere(`${field} = :${field}`, {
                                    [field]: data,
                                });
                            }
                            break;
                        case 'ne':
                            if (type === 'or') {
                                queryObject.orWhere(`${field} <> :${field}`, {
                                    [field]: data,
                                });
                            }
                            else {
                                queryObject.andWhere(`${field} <> :${field}`, {
                                    [field]: data,
                                });
                            }
                            break;
                        case 'lt':
                            if (type === 'or') {
                                queryObject.orWhere(`${field} < :${field}`, {
                                    [field]: data,
                                });
                            }
                            else {
                                queryObject.where(`${field} < :${field}`, {
                                    [field]: data,
                                });
                            }
                            break;
                        case 'le':
                            if (type === 'or') {
                                queryObject.orWhere(`${field} <= :${field}`, {
                                    [field]: data,
                                });
                            }
                            else {
                                queryObject.where(`${field} <= :${field}`, {
                                    [field]: data,
                                });
                            }
                            break;
                        case 'gt':
                            if (type === 'or') {
                                queryObject.orWhere(`${field} > :${field}`, {
                                    [field]: data,
                                });
                            }
                            else {
                                queryObject.where(`${field} > :${field}`, {
                                    [field]: data,
                                });
                            }
                            break;
                        case 'ge':
                            if (type === 'or') {
                                queryObject.orWhere(`${field} >= :${field}`, {
                                    [field]: data,
                                });
                            }
                            else {
                                queryObject.where(`${field} >= :${field}`, {
                                    [field]: data,
                                });
                            }
                            break;
                        case 'bw':
                            if (type === 'or') {
                                queryObject.orWhere(`${field} like :${field}`, {
                                    [field]: `${data}%`,
                                });
                            }
                            else {
                                queryObject.where(`${field} like :${field}`, {
                                    [field]: `${data}%`,
                                });
                            }
                            break;
                        case 'bn':
                            if (type === 'or') {
                                queryObject.orWhereNot(`${field} not like :${field}`, {
                                    [field]: `${data}%`,
                                });
                            }
                            else {
                                queryObject.whereNot(`${field} not like :${field}`, {
                                    [field]: `${data}%`,
                                });
                            }
                            break;
                        case 'ew':
                            if (type === 'or') {
                                queryObject.orWhere(`${field} like :${field}`, {
                                    [field]: `%${data}`,
                                });
                            }
                            else {
                                queryObject.where(`${field} like :${field}`, {
                                    [field]: `%${data}`,
                                });
                            }
                            break;
                        case 'en':
                            if (type === 'or') {
                                queryObject.orWhereNot(`${field} not like :${field}`, {
                                    [field]: `%${data}`,
                                });
                            }
                            else {
                                queryObject.whereNot(`${field} not like :${field}`, {
                                    [field]: `%${data}`,
                                });
                            }
                            break;
                        case 'cn':
                            if (type === 'or') {
                                queryObject.orWhere(`${field} like :${field}`, {
                                    [field]: `%${data}%`,
                                });
                            }
                            else {
                                queryObject.where(`${field} like :${field}`, {
                                    [field]: `%${data}%`,
                                });
                            }
                            break;
                        case 'nc':
                            if (type === 'or') {
                                queryObject.orWhereNot(`${field} not like :${field}`, {
                                    [field]: `%${data}%`,
                                });
                            }
                            else {
                                queryObject.whereNot(`${field} not like :${field}`, {
                                    [field]: `%${data}%`,
                                });
                            }
                            break;
                        case 'in':
                            if (type === 'or') {
                                queryObject.orWhere(`${field} IN (:...${field})`, {
                                    [field]: data,
                                });
                            }
                            else {
                                queryObject.andWhere(`${field} IN (:...${field})`, {
                                    [field]: data,
                                });
                            }
                            break;
                        case 'ni':
                            if (type === 'or') {
                                queryObject.orWhere(`${field} NOT IN (:...${field})`, {
                                    [field]: data,
                                });
                            }
                            else {
                                queryObject.andWhere(`${field} NOT IN (:...${field})`, {
                                    [field]: data,
                                });
                            }
                            break;
                        case 'bt':
                            if (type === 'or') {
                                queryObject.orWhereBetween(field, data);
                            }
                            else {
                                queryObject.whereBetween(field, data);
                            }
                            break;
                        case 'nb':
                            if (type === 'or') {
                                queryObject.orWhereNotBetween(field, data);
                            }
                            else {
                                queryObject.whereNotBetween(field, data);
                            }
                            break;
                    }
                }
            }
            else if (_.isObject(item)) {
                const whereKey = Object.keys(item)[0];
                const whereVal = Object.values(item)[0];
                if (type === 'or') {
                    if (_.isArray(whereVal)) {
                        queryObject.orWhere(`${whereKey} IN (:...${whereKey})`, {
                            [whereKey]: whereVal,
                        });
                    }
                    else {
                        queryObject.orWhere(`${whereKey} = :${whereKey}`, {
                            [whereKey]: whereVal,
                        });
                    }
                }
                else if (_.isArray(whereVal)) {
                    queryObject.andWhere(`${whereKey} IN (:...${whereKey})`, {
                        [whereKey]: whereVal,
                    });
                }
                else {
                    queryObject.andWhere(`${whereKey} = :${whereKey}`, {
                        [whereKey]: whereVal,
                    });
                }
            }
        }
    }
};
exports.BaseService = BaseService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", typeorm_1.EntityManager)
], BaseService.prototype, "entityManager", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", module_service_1.ModuleService)
], BaseService.prototype, "moduleService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", cit_general_library_1.CitGeneralLibrary)
], BaseService.prototype, "general", void 0);
exports.BaseService = BaseService = BaseService_1 = __decorate([
    (0, common_1.Injectable)()
], BaseService);
//# sourceMappingURL=base.service.js.map
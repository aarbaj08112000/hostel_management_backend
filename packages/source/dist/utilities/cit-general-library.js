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
var CitGeneralLibrary_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitGeneralLibrary = void 0;
const common_1 = require("@nestjs/common");
const _ = __importStar(require("lodash"));
const logger_handler_1 = require("./logger-handler");
const general_library_1 = require("./general-library");
const custom = __importStar(require("./custom-helper"));
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const date_fns_1 = require("date-fns");
const lookup_entity_1 = require("../entities/lookup.entity");
let CitGeneralLibrary = CitGeneralLibrary_1 = class CitGeneralLibrary extends general_library_1.GeneralLibrary {
    dataSource;
    httpService;
    log = new logger_handler_1.LoggerHandler(CitGeneralLibrary_1.name).getInstance();
    lookupEntityRepo;
    verifyCustomerLoginPassword(inputParams) {
        const curPassword = inputParams.password;
        const oldPassword = inputParams.mc_password;
        const encryptType = 'bcrypt';
        let isMatched = 0;
        const verifyResult = this.verifyEncrypted(curPassword, oldPassword, encryptType);
        if (verifyResult) {
            isMatched = 1;
        }
        return {
            is_matched: isMatched,
        };
    }
    async getAdminName(id, entity_name, module) {
        entity_name = entity_name ? entity_name : 'user';
        let select;
        if (entity_name == 'customer') {
            select = `CONCAT(
                JSON_UNQUOTE(JSON_EXTRACT(lookup.entityJson, '$.first_name')),
                ' ',
                JSON_UNQUOTE(JSON_EXTRACT(lookup.entityJson, '$.last_name'))
              )`;
        }
        else {
            select = "JSON_UNQUOTE(JSON_EXTRACT(lookup.entityJson, '$.name'))";
        }
        if (id > 0) {
            const lookup = await this.lookupEntityRepo
                .createQueryBuilder('lookup')
                .select(select, 'name')
                .where('lookup.entityId = :id', { id })
                .andWhere('lookup.entityName = :entityName', {
                entityName: entity_name,
            })
                .getRawOne();
            let name = lookup?.name || null;
            if (!name) {
                name = await this.getAdminNameDb(id, entity_name);
            }
            return name || null;
        }
        else {
            return null;
        }
    }
    async getAdminNameDb(id, entity_name) {
        try {
            if (id > 0) {
                let user_data = {};
                let search_key = id;
                let search_by = 'id';
                let index = 'nest_local_user_list';
                if (entity_name == 'customer') {
                    index = 'nest_local_customer_list';
                }
                const data = await this.elasticService.getById(search_key, index, search_by);
                if (_.isObject(data) && !_.isEmpty(data)) {
                    return entity_name == 'customer' ? data?.full_name : data?.name;
                }
                else {
                    return null;
                }
                if (entity_name == 'customer') {
                    const user_data = await this.dataSource.query(`SELECT CONCAT(firstName, ' ', lastName) AS name FROM mod_customer WHERE id = ?`, [id]);
                }
                else {
                    user_data = await this.dataSource.query('SELECT name FROM mod_admin WHERE id = ?', [id]);
                }
                return user_data[0]?.name || null;
            }
            else {
                return null;
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    async getCarName(id) {
        if (id > 0) {
            const lookup = await this.lookupEntityRepo
                .createQueryBuilder('lookup')
                .select("JSON_UNQUOTE(JSON_EXTRACT(lookup.entityJson, '$.name'))", 'name')
                .where('lookup.entityId = :id', { id })
                .andWhere('lookup.entityName = :entityName', { entityName: 'car' })
                .getRawOne();
            return lookup?.name || null;
        }
        else {
            return null;
        }
    }
    async getAdminData() {
        let blockResult = {};
        try {
            let index = 'nest_local_user_list';
            let filter = [
                {
                    key: 'group_code',
                    value: ['portal_admin', 'PORTAL_ADMIN'],
                    operator: 'in',
                },
            ];
            let inputParams = {};
            inputParams.filters = filter;
            let search_params = this.createElasticSearchQuery(inputParams);
            let pageIndex = 1;
            pageIndex = pageIndex > 0 ? pageIndex : 1;
            const results = await this.elasticService.search(index, search_params);
            if (!_.isObject(results) || _.isEmpty(results)) {
                throw new Error('No records found.');
            }
            const data = await Promise.all(results.hits.map(async (hit) => hit._source['email']));
            if (_.isObject(data) && data.length > 0) {
                const success = 1;
                const message = 'Records found.';
                const queryResult = {
                    success,
                    message,
                    data,
                };
                blockResult = queryResult;
            }
            else {
                throw new Error('No records found.');
            }
        }
        catch (error) {
            blockResult.success = 0;
            blockResult.data = [];
            console.log(error);
        }
        return blockResult;
    }
    async addActivityLogs(inputParams) {
        try {
            let data = await this.activityLogService.startActivityLogAdd(inputParams);
            return data;
        }
        catch (err) {
            console.log(err);
            return err.message;
        }
    }
    async getActivityCode(module_name, module_api) {
        let code = '';
        switch (module_api) {
            case 'add':
                code = `${module_name}_added`;
                break;
            case 'update':
                code = `${module_name}_updated`;
                break;
            default:
                code = `${module_name}_${module_api}`;
                break;
        }
        return code;
    }
    async addActivity(moduleName, moduleAPI, added_by, value_json, request_id) {
        let activityParams = {};
        let code = await this.getActivityCode(moduleName, moduleAPI);
        if (code == 'note_added') {
            moduleName = value_json?.ENTITY;
        }
        activityParams.activity_code = code;
        activityParams.value_json = value_json;
        activityParams.module_code = moduleName;
        activityParams.request_id = request_id;
        activityParams.added_by = added_by;
        activityParams.activity_for = value_json?.activity_for;
        if (value_json.TYPE != undefined) {
            activityParams.added_by_type =
                value_json.TYPE.toLowerCase() == 'front' ? 'customer' : 'user';
        }
        else {
            activityParams.added_by_type = 'user';
        }
        activityParams.added_by_name = await this.getAdminName(added_by, activityParams.added_by_type, activityParams.module_code);
        await this.addActivityLogs(activityParams);
    }
    async callThirdPartyApi(method, url, data, headers) {
        try {
            const config = {
                method,
                url,
                data,
                headers,
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.request(config));
            return response;
        }
        catch (error) {
            return error;
        }
    }
    async deleteAwsFile(filePath) {
        let options = {};
        options.bucket_name = await this.cacheService.get('AWS_BUCKET_NAME');
        const urlObj = new URL(filePath);
        options.file_name = urlObj.pathname.substring(1);
        return await this.amazonService.deleteFile(options);
    }
    verifyAdminLoginPassword(inputParams) {
        const curPassword = inputParams.password;
        const oldPassword = inputParams.ma_password;
        const encryptType = 'bcrypt';
        let isMatched = 0;
        const verifyResult = this.verifyEncrypted(curPassword, oldPassword, encryptType);
        if (verifyResult) {
            isMatched = 1;
        }
        return {
            is_matched: isMatched,
        };
    }
    verifyAdminResetPassword(inputParams, reqObj) {
        const oldPassword = inputParams.old_password;
        const curPassword = inputParams.ma_password;
        const encryptType = 'bcrypt';
        let isMatched = 0;
        const verifyResult = this.verifyEncrypted(oldPassword, curPassword, encryptType);
        if (verifyResult) {
            isMatched = 1;
        }
        let oldPasswordsLimit = Number(this.configService.get('app.admin_password_history'));
        oldPasswordsLimit = oldPasswordsLimit || 5;
        return {
            is_matched: isMatched,
            old_passwords_limit: oldPasswordsLimit,
        };
    }
    verifyAdminOldPasswords(inputParams, reqObj) {
        const oldPasswords = inputParams.get_old_passwords;
        const oldPassword = inputParams.old_password;
        const newPassword = inputParams.new_password;
        const encryptType = 'bcrypt';
        let verifyResult = false;
        let isOldPassword = 0;
        if (oldPassword === newPassword) {
            isOldPassword = 1;
        }
        else {
            oldPasswords.forEach((val) => {
                if (!verifyResult) {
                    verifyResult = this.verifyEncrypted(newPassword, val.map_password, encryptType);
                }
            });
            if (verifyResult) {
                isOldPassword = 1;
            }
        }
        return {
            is_old_password: isOldPassword,
        };
    }
    generateOTPCode() {
        return custom.getRandomNumber(6);
    }
    encryptVerifyToken(keysObject) {
        let verifyToken;
        try {
            verifyToken = this.encryptService.encryptContent(JSON.stringify(keysObject));
        }
        catch (err) {
            this.log.error('[encryptVerifyToken] >> Error ', err);
        }
        return verifyToken;
    }
    getAutocompleteWhere(queryObject, inputParams, extraConfig) {
        if ('type' in inputParams && inputParams.type !== 'all') {
            if (inputParams.type === 'inactive' || inputParams.type === 'Inactive') {
                queryObject.andWhere(`${extraConfig.table_alias}.status IN (:...customStatus)`, { customStatus: ['Inactive'] });
            }
            else {
                queryObject.andWhere(`${extraConfig.table_alias}.status IN (:...customStatus)`, { customStatus: ['Active'] });
            }
        }
        if (extraConfig.table_name === 'mod_group_master') {
            const restrictedGroups = this.configService.get('app.restrict_admin_groups');
            if (!restrictedGroups.includes(inputParams.group_code)) {
                queryObject.andWhere(`${extraConfig.table_alias}.groupCode NOT IN (:...restrictedGroups)`, { restrictedGroups: restrictedGroups });
            }
        }
    }
    prepareListingCriteria(searchObj, inputParams, aliasList, queryObject) {
        const recLimit = Number(this.getConfigItem('REC_LIMIT'))
            ? Number(this.getConfigItem('REC_LIMIT'))
            : 20;
        searchObj.page_index =
            Number(inputParams.page) || Number(inputParams.page_index) || 1;
        searchObj.limit = Number(inputParams.limit)
            ? Number(inputParams.limit)
            : recLimit;
        let aliasKey;
        let aliasVal;
        if ('filters' in inputParams) {
            if (_.isString(inputParams.filters) &&
                !custom.isEmpty(inputParams.filters)) {
                inputParams.filters = JSON.parse(inputParams.filters);
            }
            if (_.isArray(inputParams.filters)) {
                const { filters } = inputParams;
                filters.forEach((data) => {
                    aliasKey = data.key;
                    aliasVal = data.value;
                    if (aliasKey && aliasKey in aliasList) {
                        const prop_val = `custom_${aliasKey}`;
                        queryObject.andWhere(`${aliasList[aliasKey]} = :${prop_val}`, {
                            [prop_val]: aliasVal,
                        });
                    }
                });
            }
        }
        if ('sort' in inputParams) {
            if (_.isString(inputParams.sort) && !custom.isEmpty(inputParams.sort)) {
                inputParams.sort = JSON.parse(inputParams.sort);
            }
            if (_.isArray(inputParams.sort)) {
                const sortList = inputParams.sort;
                sortList.map((sortField) => {
                    if (sortField.prop &&
                        sortField.dir &&
                        aliasList[sortField.prop] &&
                        ['asc', 'desc'].indexOf(sortField.dir) !== -1) {
                        queryObject.addOrderBy(`${aliasList[sortField.prop]} ${sortField.dir}`);
                    }
                });
            }
        }
        return searchObj;
    }
    async decryptVerifyToken(token) {
        let tokenInfo;
        try {
            if (token) {
                const decodedStr = await this.encryptService.decryptContent(token);
                tokenInfo = JSON.parse(decodedStr);
            }
        }
        catch (err) {
            this.log.error('[decryptVerifyToken] >> Error ', err);
        }
        return tokenInfo;
    }
    getAdminWhereCriteria(actionType = '', inputParams = {}, queryObject, reqObject) {
        let whereClause = '';
        const defaultAdminUsers = this.configService.get('app.default_admin_users');
        const restrictAdminGroups = this.configService.get('app.restrict_admin_groups');
        if (actionType) {
            switch (actionType) {
                case 'delete':
                    if (_.isArray(defaultAdminUsers) && defaultAdminUsers.length > 0) {
                        queryObject.andWhere('userName NOT IN (:...custom_defaultAdminUsers)', { custom_defaultAdminUsers: defaultAdminUsers });
                    }
                    break;
                case 'update':
                    if (inputParams.status.toLowerCase() === 'inactive' ||
                        inputParams.ma_group_id !== inputParams.group_id) {
                        if (_.isArray(defaultAdminUsers) && defaultAdminUsers.length > 0) {
                            if (defaultAdminUsers.includes(inputParams.username)) {
                                whereClause = 0;
                            }
                            else {
                                whereClause = 1;
                            }
                        }
                    }
                    break;
                case 'change_status':
                    if (inputParams.status.toLowerCase() === 'inactive') {
                        if (_.isArray(defaultAdminUsers) && defaultAdminUsers.length > 0) {
                            queryObject.andWhere('userName NOT IN (:...custom_defaultAdminUsers)', { custom_defaultAdminUsers: defaultAdminUsers });
                        }
                    }
                    break;
                case 'details':
                    if (_.isArray(restrictAdminGroups) &&
                        restrictAdminGroups.length > 0) {
                        if (!restrictAdminGroups.includes(reqObject.user.group_code)) {
                            queryObject.andWhere('groupCode NOT IN (:...custom_restrictAdminGroups)', { custom_restrictAdminGroups: restrictAdminGroups });
                        }
                    }
                    break;
                case 'list':
                    if (_.isArray(restrictAdminGroups) &&
                        restrictAdminGroups.length > 0) {
                        if (!restrictAdminGroups.includes(reqObject.user.group_code)) {
                            queryObject.andWhere('groupCode NOT IN (:...custom_restrictAdminGroups)', { custom_restrictAdminGroups: restrictAdminGroups });
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        return whereClause;
    }
    getGroupWhereCriteria(type = '', inputParams, queryObject, requestObj) {
        let whereCond = '';
        const defaultAdminGroups = this.configService.get('app.default_admin_groups');
        const restrictAdminGroups = this.configService.get('app.restrict_admin_groups');
        if (type) {
            switch (type) {
                case 'delete':
                    if (_.isArray(defaultAdminGroups) && defaultAdminGroups.length > 0) {
                        queryObject.andWhere('groupCode NOT IN (:...custom_defaultAdminGroups)', { custom_defaultAdminGroups: defaultAdminGroups });
                    }
                    break;
                case 'update':
                    if (inputParams.status.toLowerCase() === 'inactive') {
                        if (_.isArray(defaultAdminGroups) &&
                            defaultAdminGroups.length > 0) {
                            if (defaultAdminGroups.includes(inputParams.group_code)) {
                                whereCond = 0;
                            }
                            else {
                                whereCond = 1;
                            }
                        }
                    }
                    break;
                case 'change_status':
                    if (inputParams.status.toLowerCase() === 'inactive') {
                        if (_.isArray(defaultAdminGroups) &&
                            defaultAdminGroups.length > 0) {
                            queryObject.andWhere('groupCode NOT IN (:...custom_defaultAdminGroups)', { custom_defaultAdminGroups: defaultAdminGroups });
                        }
                    }
                    break;
                case 'details':
                    if (_.isArray(restrictAdminGroups) &&
                        restrictAdminGroups.length > 0) {
                        if (!restrictAdminGroups.includes(requestObj.user.group_code)) {
                            queryObject.andWhere('groupCode NOT IN (:...custom_restrictAdminGroups)', { custom_restrictAdminGroups: restrictAdminGroups });
                        }
                    }
                    break;
                case 'list':
                    if (_.isArray(restrictAdminGroups) &&
                        restrictAdminGroups.length > 0) {
                        if (!restrictAdminGroups.includes(requestObj.user.group_code)) {
                            queryObject.andWhere('groupCode NOT IN (:...custom_restrictAdminGroups)', { custom_restrictAdminGroups: restrictAdminGroups });
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        return whereCond;
    }
    encryptPassword(value) {
        return this.encryptData(value, 'bcrypt');
    }
    verifyCustomerResetPassword(inputParams) {
        const oldPassword = inputParams.old_password;
        const curPassword = inputParams.mc_password;
        const encryptType = 'bcrypt';
        let isMatched = 0;
        const verifyResult = this.verifyEncrypted(oldPassword, curPassword, encryptType);
        if (verifyResult) {
            isMatched = 1;
        }
        return {
            is_matched: isMatched,
        };
    }
    extractHashVarName(str) {
        if (!str) {
            return '';
        }
        return str.trim().substring(1, str.length - 1);
    }
    extractReplaceConfigVars(inputData) {
        const dataObject = {};
        Object.keys(inputData).forEach((conKey) => {
            const replaceVal = inputData[conKey];
            if (replaceVal.substr(0, 8) === '#SYSTEM.' &&
                replaceVal.substr(-1) === '#') {
                const settingName = replaceVal.substr(8, replaceVal.length - 9);
                dataObject[conKey] = this.getConfigItem(settingName);
            }
            else {
                dataObject[conKey] = replaceVal;
            }
        });
        return dataObject;
    }
    getSysDateFormat1(sourceName, name) {
        return this.dateService.getSystemFormatLabels(sourceName, name);
    }
    prepareListingCriteriaOrderBy(inputParams, aliasList, queryObject) {
        if ('sort' in inputParams) {
            if (_.isString(inputParams.sort) && !custom.isEmpty(inputParams.sort)) {
                inputParams.sort = JSON.parse(inputParams.sort);
            }
            if (_.isArray(inputParams.sort)) {
                const sortList = inputParams.sort;
                sortList.map((sortField) => {
                    const upperSortDir = sortField.dir
                        ? sortField.dir.toUpperCase()
                        : 'ASC';
                    if (sortField.prop &&
                        upperSortDir &&
                        aliasList[sortField.prop] &&
                        ['ASC', 'DESC'].indexOf(upperSortDir) !== -1) {
                        queryObject.addOrderBy(aliasList[sortField.prop], upperSortDir);
                    }
                });
            }
        }
        return 1;
    }
    prepareListingCriteriaWhere(inputParams, aliasList, queryObject) {
        let aliasKey;
        let aliasVal;
        if ('filters' in inputParams) {
            if (_.isString(inputParams.filters) &&
                !custom.isEmpty(inputParams.filters)) {
                inputParams.filters = JSON.parse(inputParams.filters);
            }
            if (_.isArray(inputParams.filters)) {
                const { filters } = inputParams;
                filters.forEach((data) => {
                    aliasKey = data.key;
                    aliasVal = data.value;
                    if (aliasKey && aliasKey in aliasList) {
                        const prop_val = `custom_${aliasKey}`;
                        queryObject.andWhere(`${aliasList[aliasKey]} = :${prop_val}`, {
                            [prop_val]: aliasVal,
                        });
                    }
                });
            }
        }
    }
    stringifyJson(value = '', name = '', obj = '') {
        return JSON.stringify(name.preferences);
    }
    updateExportOpts(inputParams) {
        if (inputParams.export_mode == 'all' ||
            inputParams.export_mode == 'selected') {
            inputParams.limit = 50000;
            inputParams.page = 1;
        }
        return inputParams;
    }
    removeEmptyKeys(obj) {
        return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value !== undefined && value !== null && value !== ''));
    }
    toRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) *
                Math.cos(this.toRadians(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        const roundedDistance = distance.toFixed(2);
        return `${roundedDistance} km`;
    }
    chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }
    async getServerName() {
        let server_name = await this.getConfigItem('ELASTIC_SERVER');
        server_name = server_name
            ? `NEST_${server_name.toUpperCase()}`
            : 'NEST_LOCAL';
        return server_name;
    }
    getCustomeKey(alisa, index, id, page, size) {
        let key = '';
        if (alisa != '' && typeof alisa != 'undefined') {
            key = alisa;
        }
        if (index != '' && typeof index != 'undefined') {
            key += '_' + index;
        }
        if (id != '' && typeof id != 'undefined') {
            key += '_' + id;
        }
        if (page != '' && page != 'undefined') {
            key += '_' + page;
        }
        if (size != '' && typeof size != 'undefined') {
            key += '_' + size;
        }
        return key;
    }
    numberFormat(value = 0.0, type = 'decimal', currencyCode = 'USD', is_currency = 'no') {
        {
            let formattedValue;
            value = Number(parseFloat(value).toFixed(2));
            if (type === 'currency') {
                formattedValue = new Intl.NumberFormat('en', {
                    style: 'currency',
                    currency: currencyCode,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(value || 0);
            }
            else if (type === 'numerical') {
                formattedValue = new Intl.NumberFormat('en', {
                    style: 'decimal',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(value || 0);
            }
            else {
                formattedValue = new Intl.NumberFormat('en', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(value || 0);
            }
            const symbolRegex = /[^\d.,]/g;
            let extractedValue = formattedValue.replace(symbolRegex, '');
            if (is_currency == 'yes') {
                extractedValue = currencyCode + ' ' + extractedValue;
            }
            return extractedValue;
        }
    }
    createElasticSearchQuery(params) {
        let is_front = params?.is_front == 'Yes' ? 'Yes' : 'No';
        const { filters = {}, sort = {}, boost = {} } = params;
        if ('manufactureYear' in filters) {
            let years = filters.manufactureYear[0].split('-');
            if (typeof years[1] != 'undefined') {
                let year_res = this.getYearsBetween(years[0], years[1]);
                filters.manufactureYear = year_res;
            }
        }
        const cleanedQueryParams = this.removeEmptyKeys(filters);
        const cleanedSortParams = this.removeEmptyKeys(sort);
        const boostParams = this.removeEmptyKeys(boost);
        if (is_front == 'No') {
            return this.buildElasticsearchSQLQuery(cleanedQueryParams, cleanedSortParams);
        }
        let mustClauses = Object.entries(cleanedQueryParams)
            .filter(([key]) => key !== 'address' && key !== 'distance' && key !== 'price')
            .map(([key, value]) => Array.isArray(value)
            ? { terms: { [key]: value } }
            : { match: { [key == 'car_tag' ? key.toLowerCase() : key]: value } });
        let sortClauses = Object.entries(cleanedSortParams).map(([key, { prop, dir }]) => ({
            [prop]: { order: dir },
        }));
        let boostClauses = Object.entries(boostParams).flatMap(([field, items]) => items.map(({ key, boost }) => ({
            term: {
                [field]: {
                    value: key,
                    boost: boost,
                },
            },
        })));
        let geoFilter = {};
        if (cleanedQueryParams.distance &&
            typeof cleanedQueryParams.address === 'object') {
            let tempGeoSort = {};
            geoFilter = {
                geo_distance: {
                    distance: cleanedQueryParams.distance,
                    address: {
                        lat: cleanedQueryParams.address.latitude,
                        lon: cleanedQueryParams.address.longitude,
                    },
                },
            };
            tempGeoSort = {
                _geo_distance: {
                    address: geoFilter['geo_distance']['address'],
                    order: 'asc',
                    unit: 'km',
                    mode: 'min',
                    distance_type: 'arc',
                },
            };
            sortClauses.push(tempGeoSort);
        }
        let priceFilter = {};
        if (cleanedQueryParams.price && cleanedQueryParams.price.length > 0) {
            let price_res = cleanedQueryParams.price[0].split('-');
            let minPrice = parseFloat(price_res[0]);
            let maxPrice = parseFloat(price_res[1]);
            if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice <= maxPrice) {
                if (minPrice > maxPrice) {
                    console.error('Invalid price range');
                }
                priceFilter = {
                    range: {
                        price: {
                            gte: minPrice,
                            lte: maxPrice,
                        },
                    },
                };
            }
            else {
                console.error('Invalid price range');
            }
        }
        let query = { bool: {} };
        if (mustClauses.length > 0)
            query.bool['must'] = mustClauses;
        if (Object.keys(geoFilter).length > 0)
            query.bool['filter'] = geoFilter;
        if (Object.keys(priceFilter).length > 0)
            query.bool['filter'] = priceFilter;
        if (Object.keys(boostClauses).length > 0)
            query.bool['should'] = boostClauses;
        let result = { query };
        if (sortClauses.length > 0)
            result['sort'] = sortClauses;
        return result;
    }
    calculateDistancesFromArray(searchLat, searchLon, locations) {
        return locations.map((location) => {
            const { latitude, longitude } = location;
            const distance = this.calculateDistance(searchLat, searchLon, latitude, longitude);
            return { ...location, distance };
        });
    }
    async submitGearmanJob(inputParams) {
        try {
            const worker_path = await this.getConfigItem('WORKER_URL');
            const gearman_enabled = await this.getConfigItem('GEARMAN_ENABLE');
            let path = 'api/master/sync-elastic-data';
            let { job_function, job_params } = inputParams;
            if (inputParams.job_function == 'process_car_data') {
                inputParams.job_params.path = `${worker_path}/${inputParams?.path ? inputParams.path : path}`;
                let res = await this.gearmanService.submitJob(job_function, job_params);
                console.log(res);
            }
            else {
                let index = inputParams?.job_params?.module;
                let res;
                if (index != 'all') {
                    if ('job_function' in inputParams) {
                        switch (inputParams.job_function) {
                            case 'sync_elastic_data':
                                let data = job_params?.data;
                                res = await this.elasticService.syncElasticData(index, data);
                                break;
                            case 'delete_elastic_data':
                                let id = job_params?.data;
                                res = await this.elasticService.deleteDocument(index, id);
                                break;
                        }
                    }
                }
                else {
                    await this.elasticService.syncElasticData();
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    async sendEmail(inputParams) {
        try {
            const { job_function, job_params } = inputParams;
            if (!job_function || !job_params) {
                console.warn('⚠️ Missing job_function or job_params in input');
                return;
            }
            const res = await this.gearmanService.submitJob('send_email', job_params);
            return;
        }
        catch (err) {
            console.error('❌ Error in submitGearmanJob:', err);
        }
    }
    timeAgo(date) {
        date = this.cleanDateString(date);
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 },
        ];
        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
            }
        }
        return 'just now';
    }
    cleanDateString(str) {
        str = str.replace(/\b(AM|PM)\b/i, '').trim();
        const [datePart, timePart] = str.split(' ');
        const [day, month, year] = datePart.split('-');
        return `${year}-${month}-${day}T${timePart}`;
    }
    getYearsBetween(startYear, endYear) {
        let years = [];
        for (let year = startYear; year <= endYear; year++) {
            years.push(parseInt(year));
        }
        return years;
    }
    buildElasticsearchSQLQuery(cleanedQueryParams, cleanedSortParams) {
        let conditions = [];
        let sortConditions = [];
        const isNumericString = (val) => {
            return typeof val === 'string' && !isNaN(val) && val.trim() !== '';
        };
        const formatValue = (val) => {
            if (val instanceof Date) {
                return `'${val.toISOString()}'`;
            }
            if (typeof val === 'string' &&
                /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val)) {
                return `'${val.replace(' ', 'T')}Z'`;
            }
            if (typeof val === 'number')
                return `${val}`;
            if (isNumericString(val))
                return `${Number(val)}`;
            return `'${val}'`;
        };
        if (cleanedQueryParams) {
            Object.entries(cleanedQueryParams).forEach(([_, values]) => {
                if (typeof values === 'object' &&
                    'key' in values &&
                    'value' in values &&
                    'operator' in values) {
                    let { key, value, operator } = values;
                    conditions.push(this.buildCondition(key, operator, value));
                }
                else if (typeof values === 'object' &&
                    'keys' in values &&
                    'value' in values &&
                    'operator' in values) {
                    let { keys, value, operator } = values;
                    if (keys.length > 1) {
                        const orConditions = keys.map((key) => this.buildCondition(key, operator, value));
                        conditions.push(`(${orConditions.join(' OR ')})`);
                    }
                }
                else {
                    conditions.push(`${_.toString()} = ${formatValue(values)}`);
                }
            });
        }
        if (cleanedSortParams && Object.keys(cleanedSortParams).length) {
            Object.entries(cleanedSortParams).forEach(([_, sort]) => {
                const { prop, dir } = sort;
                sortConditions.push(`${prop} ${dir.toUpperCase()}`);
            });
        }
        let query = '';
        if (conditions.length > 0) {
            query += `WHERE ${conditions.join(' AND ')}`;
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
    buildCondition(key, operator, value) {
        const isNumericString = (val) => {
            return typeof val === 'string' && !isNaN(val) && val.trim() !== '';
        };
        const formatValue = (val) => {
            if (val instanceof Date) {
                return `'${val.toISOString()}'`;
            }
            if (typeof val === 'string' &&
                /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val)) {
                return `'${val.replace(' ', 'T')}Z'`;
            }
            if (typeof val === 'number')
                return `${val}`;
            if (isNumericString(val))
                return `${Number(val)}`;
            return `'${val}'`;
        };
        switch (operator) {
            case 'begin':
                return !isNumericString(value)
                    ? `${key} LIKE '${value}%'`
                    : `CAST(${key} AS CHAR) LIKE '${value}%'`;
            case 'notbegin':
                return !isNumericString(value)
                    ? `${key} NOT LIKE '${value}%'`
                    : `CAST(${key} AS CHAR) NOT LIKE '${value}%'`;
            case 'end':
                return !isNumericString(value)
                    ? `${key} LIKE '%${value}'`
                    : `CAST(${key} AS CHAR) LIKE '%${value}'`;
            case 'notend':
                return !isNumericString(value)
                    ? `${key} NOT LIKE '%${value}'`
                    : `CAST(${key} AS CHAR) NOT LIKE '%${value}'`;
            case 'contain':
                return !isNumericString(value)
                    ? `${key} LIKE '%${value}%'`
                    : `CAST(${key} AS CHAR) LIKE '%${value}%'`;
            case 'notcontain':
                return !isNumericString(value)
                    ? `${key} NOT LIKE '%${value}%'`
                    : `CAST(${key} AS CHAR) NOT LIKE '%${value}%'`;
            case 'equal':
                return `${key} = ${!isNumericString(value) ? formatValue(value) : value}`;
            case 'notequal':
                return `${key} != ${!isNumericString(value) ? formatValue(value) : value}`;
            case 'in':
                if (Array.isArray(value)) {
                    const inValues = value
                        .map((v) => (!isNumericString(v) ? formatValue(v) : v))
                        .join(', ');
                    return `${key} IN (${inValues})`;
                }
                return `${key} IN (${!isNumericString(value) ? formatValue(value) : value})`;
            case 'notin':
                if (Array.isArray(value)) {
                    const notInValues = value
                        .map((v) => (!isNumericString(v) ? formatValue(v) : v))
                        .join(', ');
                    return `${key} NOT IN (${notInValues})`;
                }
                return `${key} NOT IN (${!isNumericString(value) ? formatValue(value) : value})`;
            case 'empty':
                return `${key} IS NULL`;
            case 'notempty':
                return `${key} IS NOT NULL`;
            case 'between':
                if (Array.isArray(value) && value.length === 2) {
                    const [start, end] = value.map((v) => formatValue(v));
                    return `${key} BETWEEN ${start} AND ${end}`;
                }
                return '';
            default:
                return `${key} = ${!isNumericString(value) ? formatValue(value) : value}`;
        }
    }
    async getCustomToken(entity, code, mode = 'Update') {
        let table, module, where;
        let count;
        let formattedCount;
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        let company_prefix = await this.getConfigItem('COMPANY_PREFIX');
        if (company_prefix == null || company_prefix == '') {
            company_prefix = 'KM';
        }
        switch (entity) {
            case 'cars':
                table = 'cars';
                if (typeof code != 'undefined' && code != '') {
                    module = code.modelCode;
                }
                break;
            case 'sell_car':
                table = 'sell_car';
                if (typeof code != 'undefined' && code != '') {
                    module = code;
                }
                break;
            case 'inquiry':
                table = 'inquiry';
                if (typeof code != 'undefined' && code != '') {
                    module = code;
                }
                break;
            case 'test_drive':
                table = 'test_drive';
                if (typeof code != 'undefined' && code != '') {
                    module = code;
                }
                break;
            case 'booking':
                table = 'bookings';
                if (typeof code != 'undefined' && code != '') {
                    module = code;
                }
                break;
            case 'invoice':
                table = 'attachments';
                where = `where attachmentFor = 'invoice'`;
                if (typeof code != 'undefined' && code != '') {
                    module = code;
                }
                break;
            case 'payment':
                table = 'payments';
                if (typeof code != 'undefined' && code != '') {
                    module = code;
                }
                break;
            case 'lead':
                table = 'leads';
                where = `where leadType = 'Lead'`;
                if (typeof code != 'undefined' && code != '') {
                    module = code;
                }
                break;
            case 'opportunity':
                table = 'leads';
                where = `where leadType = 'Opportunity'`;
                if (typeof code != 'undefined' && code != '') {
                    module = code;
                }
                break;
            case 'opportunity':
                table = 'leads';
                where = `where leadType = 'Opportunity'`;
                if (typeof code != 'undefined' && code != '') {
                    module = code;
                }
                break;
        }
        if (table != '' && entity != '') {
            const return_data = await this.dataSource.query(`select count(*) as count FROM ${table} ${where}`);
            if (mode == 'Add') {
                count = parseInt(return_data[0].count) + 1;
            }
            else {
                count = parseInt(return_data[0].count);
            }
        }
        else {
            count = 1;
        }
        formattedCount = String(count).padStart(5, '0');
        return module
            ? `${company_prefix}/${module}/${year}/${month}/${formattedCount}`
            : `${company_prefix}/${year}/${month}/${formattedCount}`;
    }
    async getUsernameFromKeycloak(token, keycloakUrl, keycloakRealm) {
        try {
            const url = `${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/userinfo`;
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await this.callThirdPartyApi('GET', url, {}, headers);
            return response.data?.preferred_username || null;
        }
        catch (error) {
            this.log.error('Error fetching username from Keycloak:', error);
            return null;
        }
    }
    createTimeSlots(startDate, endDate, durationMinutes) {
        const startTime = (0, date_fns_1.parse)(startDate, 'yyyy-MM-dd HH:mm:ss', new Date());
        const endTime = (0, date_fns_1.parse)(endDate, 'yyyy-MM-dd HH:mm:ss', new Date());
        const timeSlots = [];
        let currentStartTime = startTime;
        while ((0, date_fns_1.isBefore)(currentStartTime, endTime)) {
            const currentEndTime = new Date(currentStartTime.getTime() + durationMinutes * 60000);
            if ((0, date_fns_1.isBefore)(currentEndTime, endTime) ||
                currentEndTime.getTime() === endTime.getTime()) {
                const slotTime = `${(0, date_fns_1.format)(currentStartTime, 'HH:mm:ss')} - ${(0, date_fns_1.format)(currentEndTime, 'HH:mm:ss')}`;
                const displayTime = `${(0, date_fns_1.format)(currentStartTime, 'HH:mm')} - ${(0, date_fns_1.format)(currentEndTime, 'HH:mm')}`;
                timeSlots.push({
                    slot_time: slotTime,
                    displayTime: displayTime,
                });
            }
            currentStartTime = currentEndTime;
        }
        return timeSlots;
    }
    async applyDynamicSelectsFromLookup(queryObject, selFields, tableAlias) {
        if (!selFields || typeof selFields !== 'object')
            return;
        let isFirst = true;
        for (const [field, alias] of Object.entries(selFields)) {
            const fullField = `${tableAlias}.${field}`;
            if (isFirst) {
                queryObject.select(fullField, alias);
                isFirst = false;
            }
            else {
                queryObject.addSelect(fullField, alias);
            }
        }
    }
    async setRedisData(key, data, timeOut) {
        const redisEnabled = await this.isRedisEnabled();
        if (!redisEnabled) {
            return false;
        }
        try {
            await this.redisService.set(key, data, timeOut);
        }
        catch (err) {
            console.log(err);
        }
    }
    async getRedisData(key) {
        const redisEnabled = await this.isRedisEnabled();
        if (!redisEnabled) {
            return false;
        }
        try {
            return await this.redisService.get(key);
        }
        catch (err) {
            console.log(err);
        }
    }
    async deleteRedisData(key) {
        const redisEnabled = await this.isRedisEnabled();
        if (!redisEnabled) {
            return false;
        }
        try {
            return this.redisService.delete(key);
        }
        catch (err) {
            console.log(err);
        }
    }
    async isRedisEnabled() {
        let isRedisEnabled = process.env.REDIS_ENABLED;
        if (isRedisEnabled == 'Yes') {
            return true;
        }
        else {
            return false;
        }
    }
    async getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    async findOneByDynamicFields(alias, filters, jsonColumn = 'entityJson') {
        const queryBuilder = this.lookupEntityRepo.createQueryBuilder(alias);
        let paramIndex = 0;
        for (const [key, val] of Object.entries(filters)) {
            const paramKey = `param_${paramIndex++}`;
            const isJsonField = !(await this.lookupEntityRepo.metadata.findColumnWithPropertyName(key));
            if (isJsonField) {
                queryBuilder.andWhere(`JSON_UNQUOTE(JSON_EXTRACT(${alias}.${jsonColumn}, '$.${key}')) = :${paramKey}`, { [paramKey]: val });
            }
            else {
                queryBuilder.andWhere(`${alias}.${key} = :${paramKey}`, {
                    [paramKey]: val,
                });
            }
        }
        return await queryBuilder.getOne();
    }
};
exports.CitGeneralLibrary = CitGeneralLibrary;
__decorate([
    (0, typeorm_2.InjectDataSource)(),
    __metadata("design:type", typeorm_1.DataSource)
], CitGeneralLibrary.prototype, "dataSource", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", axios_1.HttpService)
], CitGeneralLibrary.prototype, "httpService", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(lookup_entity_1.LookupEntity),
    __metadata("design:type", typeorm_1.Repository)
], CitGeneralLibrary.prototype, "lookupEntityRepo", void 0);
exports.CitGeneralLibrary = CitGeneralLibrary = CitGeneralLibrary_1 = __decorate([
    (0, common_1.Injectable)()
], CitGeneralLibrary);
//# sourceMappingURL=cit-general-library.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomString = getRandomString;
exports.getRandomNumber = getRandomNumber;
exports.truncateChars = truncateChars;
exports.evaluateExpression = evaluateExpression;
exports.isExternalURL = isExternalURL;
exports.getTotalPages = getTotalPages;
exports.getStartIndex = getStartIndex;
exports.getPagination = getPagination;
exports.getFilteredList = getFilteredList;
exports.getAssocDropdown = getAssocDropdown;
exports.getTreeDropdown = getTreeDropdown;
exports.getIPAddress = getIPAddress;
exports.getPasswordHash = getPasswordHash;
exports.comparePasswordHash = comparePasswordHash;
exports.replaceHashedParameters = replaceHashedParameters;
exports.processRequestPregMatch = processRequestPregMatch;
exports.processSystemPregMatch = processSystemPregMatch;
exports.compareTime = compareTime;
exports.getRouteAPIName = getRouteAPIName;
exports.sanitizeUniqueName = sanitizeUniqueName;
exports.snakeToPascal = snakeToPascal;
exports.snakeToCamel = snakeToCamel;
exports.isEmpty = isEmpty;
exports.lang = lang;
const _ = __importStar(require("lodash"));
const bcrypt = __importStar(require("bcryptjs"));
const randomize = __importStar(require("randomatic"));
const mathjs_1 = require("mathjs");
const path_to_regexp_1 = require("path-to-regexp");
const cit_api_routes_1 = __importDefault(require("../config/cit-api-routes"));
function getRandomString(pattern, length, params) {
    params = _.isObject(params) ? params : {};
    return randomize(pattern, length, params);
}
function getRandomNumber(length) {
    return randomize('0', length);
}
function truncateChars(str, len) {
    len = len || 25;
    if (str.trim() === '' || len < 3) {
        return str;
    }
    if (str.length > len) {
        str = `${str.substr(0, len - 3)}...`;
    }
    return str;
}
function evaluateExpression(expr) {
    if (expr === '') {
        return false;
    }
    return (0, mathjs_1.evaluate)(expr);
}
function isExternalURL(url) {
    let flag = false;
    if (url) {
        url = url.trim().toLowerCase();
        if (url.substr(0, 8) === 'https://' || url.substr(0, 7) === 'http://') {
            flag = true;
        }
    }
    return flag;
}
function getTotalPages(total, perPage) {
    if (perPage === 0) {
        return 1;
    }
    return Math.ceil(total / perPage);
}
function getStartIndex(page, limit) {
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 20;
    return (page - 1) * limit;
}
function getPagination(total, page, limit) {
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
        count: total,
        per_page: limit,
        curr_page: page,
        last_page: lastPage,
        prev_page: prevPage ? true : false,
        next_page: nextPage ? true : false,
    };
}
function getFilteredList(list) {
    const retList = [];
    const tmpList = _.isString(list) ? list.split(',') : list;
    if (_.isArray(tmpList)) {
        for (let i = 0; i < tmpList.length; i += 1) {
            if (!this.isEmpty(tmpList[i])) {
                retList.push(tmpList[i]);
            }
        }
    }
    if (!retList.length) {
        return false;
    }
    return tmpList;
}
function getAssocDropdown(list) {
    const assoc = {};
    if (_.isArray(list)) {
        for (let i = 0; i < list.length; i += 1) {
            const { parId } = list[i];
            if (!_.isArray(assoc[parId])) {
                assoc[parId] = [];
            }
            assoc[parId].push(list[i]);
        }
    }
    return assoc;
}
function getTreeDropdown(data, id, inc, lbl, opt) {
    let list = [];
    const items = data[id];
    if (_.isArray(items)) {
        for (let i = 0; i < items.length; i += 1) {
            let lblVal;
            let optVal;
            if (inc === 1) {
                lblVal = `${items[i].val}`;
                optVal = `${items[i].val}`;
            }
            else {
                lblVal = `${lbl} >> ${items[i].val}`;
                optVal = `${opt} >> ${items[i].val}`;
            }
            list.push({
                id: items[i].id,
                val: items[i].val,
                lblTmp: lblVal,
                optTmp: optVal,
            });
            opt = opt || '';
            const nxtLbl = lblVal;
            const nxtOpt = `${opt}&nbsp;&nbsp;&nbsp;&nbsp;`;
            const children = this.getTreeDropdown(data, items[i].id, inc + 1, nxtLbl, nxtOpt);
            list = _.union(list, children);
        }
    }
    return list;
}
function getIPAddress(req) {
    let ipAddress = '';
    if (req.headers['X-Forwarded-For']) {
        [ipAddress] = req.headers['X-Forwarded-For'].split(',');
    }
    else if (req.headers['x-forwarded-for']) {
        [ipAddress] = req.headers['x-forwarded-for'].split(',');
    }
    else if (req.client.remoteAddress) {
        ipAddress = req.client.remoteAddress;
    }
    else if (req.connection.remoteAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    else {
        ipAddress = req.socket.remoteAddress;
    }
    return ipAddress;
}
function getPasswordHash(password) {
    return bcrypt.hashSync(password, 10);
}
function comparePasswordHash(plainPwd, hashPwd) {
    return bcrypt.compareSync(plainPwd, hashPwd);
}
function replaceHashedParameters(str, params) {
    if (!str) {
        return str;
    }
    if (_.isObject(params)) {
        Object.keys(params).forEach((key) => {
            if (!_.isArray(params[key]) && !_.isObject(params[key])) {
                const hashKey = `#${key}#`;
                if (str.indexOf(hashKey) >= 0) {
                    str = str.replace(hashKey, params[key]);
                }
            }
        });
    }
    return str;
}
function processRequestPregMatch(str, params) {
    if (!str) {
        return str;
    }
    if (str.indexOf('{%REQUEST') >= 0) {
        const matches = [...str.matchAll(/{%REQUEST\.([a-zA-Z0-9_]{1,})/gi)];
        if (_.isArray(matches) && matches.length > 0) {
            matches.forEach((item) => {
                if (_.isArray(item) && item[1]) {
                    const key = item[1];
                    if (!_.isArray(params[key]) && !_.isObject(params[key])) {
                        if (str.indexOf('{%REQUEST') >= 0) {
                            str = str.replace(`{%REQUEST.${key}%}`, params[key]);
                        }
                    }
                }
            });
        }
    }
    return str;
}
function processSystemPregMatch(str, params) {
    if (!str) {
        return str;
    }
    if (str.indexOf('{%SYSTEM') >= 0) {
        const matches = [...str.matchAll(/{%SYSTEM\.([a-zA-Z0-9_]{1,})/gi)];
        if (_.isArray(matches) && matches.length > 0) {
            matches.forEach((item) => {
                if (_.isArray(item) && item[1]) {
                    const key = item[1];
                    if (str.indexOf('{%SYSTEM') >= 0) {
                        str = str.replace(`{%SYSTEM.${key}%}`, params[key]);
                    }
                }
            });
        }
    }
    return str;
}
function compareTime(time1, time2, operator) {
    let field1 = time1.split(':');
    field1 = parseInt(field1[0], 10) * 3600 + parseInt(field1[1], 10) * 60;
    let field2 = time2.split(':');
    field2 = parseInt(field2[0], 10) * 3600 + parseInt(field2[1], 10) * 60;
    if (operator === 'timeLessThan') {
        return field1 < field2 ? 1 : 0;
    }
    if (operator === 'timeLessEqual') {
        return field1 <= field2 ? 1 : 0;
    }
    if (operator === 'timeGreaterThan') {
        return field1 > field2 ? 1 : 0;
    }
    if (operator === 'timeGreaterEqual') {
        return field1 >= field2 ? 1 : 0;
    }
    return 0;
}
function getRouteAPIName(routePath, method) {
    routePath = routePath.replace(/\/$/, '');
    routePath = routePath.replace(/^\//, '');
    let apiName = routePath;
    const res_methods = typeof cit_api_routes_1.default[method] != 'undefined' ? cit_api_routes_1.default[method] : [];
    if (Object.keys(res_methods).length > 0) {
        let exact_match = '';
        for (const route in res_methods) {
            const regex = (0, path_to_regexp_1.pathToRegexp)(route);
            const match = regex.regexp.exec(routePath);
            if (match) {
                exact_match = route;
            }
        }
        if (exact_match != '') {
            apiName = res_methods[exact_match];
        }
    }
    return apiName;
}
function sanitizeUniqueName(item) {
    return item
        .toLowerCase()
        .replace(/[^a-z0-9-\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
}
function snakeToPascal(str) {
    return str
        .split('_')
        .map((substr) => substr.charAt(0).toUpperCase() + substr.slice(1))
        .join('');
}
function snakeToCamel(str) {
    return str
        .toLowerCase()
        .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
}
function isEmpty(str) {
    return (_.isNull(str) ||
        _.isUndefined(str) ||
        (_.isString(str) && str.trim() === ''));
}
function lang(key, language, options) {
    return key;
}
//# sourceMappingURL=custom-helper.js.map
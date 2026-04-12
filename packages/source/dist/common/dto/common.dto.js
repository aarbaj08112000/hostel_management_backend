"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsParamsDto = exports.BlockResultDto = exports.DynamicKeyMixDto = exports.DynamicKeyNumDto = exports.DynamicKeyStrDto = exports.DynamicKeyAnyDto = exports.StandardCallbackDto = exports.StandardPromiseDto = exports.PromiseResponseDto = exports.StandardReturnDto = exports.StandardResultDto = void 0;
class StandardResultDto {
    success;
    message;
    status;
}
exports.StandardResultDto = StandardResultDto;
class StandardReturnDto {
    success;
    message;
}
exports.StandardReturnDto = StandardReturnDto;
class PromiseResponseDto {
    data;
    error;
}
exports.PromiseResponseDto = PromiseResponseDto;
class StandardPromiseDto {
    success;
    message;
    status;
    error;
    data;
}
exports.StandardPromiseDto = StandardPromiseDto;
class StandardCallbackDto {
    callback;
    async;
}
exports.StandardCallbackDto = StandardCallbackDto;
class DynamicKeyAnyDto {
}
exports.DynamicKeyAnyDto = DynamicKeyAnyDto;
class DynamicKeyStrDto {
}
exports.DynamicKeyStrDto = DynamicKeyStrDto;
class DynamicKeyNumDto {
}
exports.DynamicKeyNumDto = DynamicKeyNumDto;
class DynamicKeyMixDto {
}
exports.DynamicKeyMixDto = DynamicKeyMixDto;
class BlockResultDto {
    success;
    message;
    data;
}
exports.BlockResultDto = BlockResultDto;
class SettingsParamsDto {
    status;
    success;
    message;
    access_token;
    count;
    per_page;
    curr_page;
    last_page;
    prev_page;
    next_page;
}
exports.SettingsParamsDto = SettingsParamsDto;
//# sourceMappingURL=common.dto.js.map
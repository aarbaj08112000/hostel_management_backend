"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerModuleWrapper = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const ejs_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/ejs.adapter");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const setting_entity_1 = require("@repo/source/entities/setting.entity");
let MailerModuleWrapper = class MailerModuleWrapper {
};
exports.MailerModuleWrapper = MailerModuleWrapper;
exports.MailerModuleWrapper = MailerModuleWrapper = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([setting_entity_1.SettingEntity]),
            mailer_1.MailerModule.forRootAsync({
                imports: [typeorm_1.TypeOrmModule.forFeature([setting_entity_1.SettingEntity])],
                inject: [(0, typeorm_1.getRepositoryToken)(setting_entity_1.SettingEntity)],
                useFactory: async (settingEntityRepo) => {
                    const queryObject = settingEntityRepo.createQueryBuilder('ms');
                    queryObject.select('ms.name', 'name');
                    queryObject.addSelect('ms.value', 'value');
                    queryObject.where('ms.name IN (:...configType)', {
                        configType: [
                            'COMPANY_SUPPORT_EMAIL',
                            'USE_SMTP_SERVERHOST',
                            'USE_SMTP_SERVERPASS',
                            'USE_SMTP_SERVERPORT',
                            'USE_SMTP_SERVERUSERNAME',
                            'COMPANY_NAME',
                            'USE_SMTP_SERVERTYPE',
                        ],
                    });
                    const data = await queryObject.getRawMany();
                    const config = {};
                    data.forEach((setting) => {
                        config[setting.name] = setting.value;
                    });
                    const params = {
                        host: config.USE_SMTP_SERVERHOST,
                        port: Number(config.USE_SMTP_SERVERPORT),
                        secure: true,
                        auth: {
                            user: config.USE_SMTP_SERVERUSERNAME,
                            pass: config.USE_SMTP_SERVERPASS,
                        },
                    };
                    return {
                        transport: params,
                        defaults: {
                            from: '"' +
                                config.COMPANY_NAME +
                                '" <' +
                                config.COMPANY_SUPPORT_EMAIL +
                                '>',
                        },
                        template: {
                            dir: 'src/views/',
                            adapter: new ejs_adapter_1.EjsAdapter(),
                        },
                    };
                },
            }),
        ],
    })
], MailerModuleWrapper);
//# sourceMappingURL=mailer.module.js.map
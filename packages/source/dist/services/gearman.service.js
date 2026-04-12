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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GearmanService = void 0;
const common_1 = require("@nestjs/common");
const gearmanode = __importStar(require("gearmanode"));
let GearmanService = class GearmanService {
    client;
    onModuleInit() {
        if (process.env.GEARMAN_ENABLE == 'Yes') {
            this.client = gearmanode.client();
            console.log('✅ Gearman Client Initialized');
        }
    }
    onModuleDestroy() {
        this.client.close();
        console.log('🛑 Gearman Client Closed');
    }
    submitJob(jobName, workload) {
        return new Promise((resolve, reject) => {
            console.log(`📤 Sending job "${jobName}" with workload:`, workload);
            const job = this.client.submitJob(jobName, JSON.stringify(workload), {
                encoding: 'utf8',
            });
            job.on('workData', function (data) {
                console.log('WORK_DATA >>> ' + data);
            });
            job.on('complete', function () {
                const result = job.response.toString('utf8');
                console.log('RESULT >>> ' + job.response);
                resolve(job.response);
            });
        });
    }
};
exports.GearmanService = GearmanService;
exports.GearmanService = GearmanService = __decorate([
    (0, common_1.Injectable)()
], GearmanService);
//# sourceMappingURL=gearman.service.js.map
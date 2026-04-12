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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GearmanWorkerService = void 0;
const common_1 = require("@nestjs/common");
const gearmanode = __importStar(require("gearmanode"));
const elastic_service_1 = require("./elastic.service");
const cit_general_library_1 = require("@repo/source/utilities/cit-general-library");
const email_execution_service_1 = require("./email-execution.service");
let GearmanWorkerService = class GearmanWorkerService {
    elasticService;
    callingEmailExecution;
    worker;
    general;
    constructor(elasticService, callingEmailExecution) {
        this.elasticService = elasticService;
        this.callingEmailExecution = callingEmailExecution;
    }
    onModuleInit() {
        if (process.env.GEARMAN_ENABLE != 'Yes') {
            return true;
        }
        const worker = gearmanode.worker({
            servers: [
                { host: process.env.GEARMAN_HOST, port: process.env.GEARMAN_PORT },
            ],
        });
        worker.addFunction('sync_elastic_data', (job) => {
            try {
                console.log('🛠 Processing job:', job.payload.toString());
                return new Promise((resolve, reject) => {
                    let result = this.elasticService.syncElasticData(job.payload.toString());
                    resolve(result);
                    job.workComplete(result);
                    console.log('✅ Job completed with result:', result);
                });
            }
            catch (error) {
                job.workFail();
                console.error('⚠️ Job failed:', error);
            }
        });
        worker.addFunction('send_email', (job) => {
            try {
                const data = JSON.parse(job.payload.toString());
                console.log(`🛠️ params: ${data}`);
                let result = this.callingEmailExecution.callEmailExecutionApi(data);
                job.workComplete(result.toString());
            }
            catch (error) {
                job.workFail();
                console.error('⚠️ Job failed:', error);
            }
        });
        console.log('✅ Gearman Worker Started - Listening for jobs');
    }
};
exports.GearmanWorkerService = GearmanWorkerService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", cit_general_library_1.CitGeneralLibrary)
], GearmanWorkerService.prototype, "general", void 0);
exports.GearmanWorkerService = GearmanWorkerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [elastic_service_1.ElasticService,
        email_execution_service_1.CallingEmailExecution])
], GearmanWorkerService);
//# sourceMappingURL=gearman.worker.service.js.map
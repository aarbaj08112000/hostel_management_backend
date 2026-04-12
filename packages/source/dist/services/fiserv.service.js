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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiservService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
const uuid_1 = require("uuid");
let FiservService = class FiservService {
    configService;
    apiKey;
    apiSecret;
    baseUrl;
    webhook;
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('FISERV_API_KEY');
        this.apiSecret = this.configService.get('FISERV_SECRET_KEY');
        this.baseUrl = this.configService.get('FISERV_BASE_URL');
        this.webhook = this.configService.get('FISERB_WEBHOOK');
    }
    generateSignature(payload, timestamp, clientRequestId) {
        const message = this.apiKey + clientRequestId + timestamp + payload;
        const hmac = crypto.createHmac('sha256', this.apiSecret);
        hmac.update(message, 'utf8');
        return hmac.digest('base64');
    }
    async createCheckout(amount, currency, metadata = {}, success_url, cancel_url) {
        const clientRequestId = (0, uuid_1.v4)();
        const timestamp = Date.now().toString();
        const uniqueSeparate = this.configService.get('ENVIRONMENT');
        const payload = {
            transactionOrigin: 'ECOM',
            transactionType: 'SALE',
            transactionAmount: {
                total: amount,
                currency: currency,
            },
            checkoutSettings: {
                locale: 'en_GB',
                redirectBackUrls: {
                    successUrl: success_url,
                    failureUrl: cancel_url,
                },
                webHooksUrl: this.webhook + '/fiserv/webhook',
            },
            paymentMethodDetails: {
                cards: {
                    authenticationPreferences: {
                        challengeIndicator: '01',
                        skipTra: false,
                    },
                    createToken: {
                        declineDuplicateToken: false,
                        reusable: true,
                        toBeUsedFor: 'UNSCHEDULED',
                    },
                    tokenBasedTransaction: {
                        transactionSequence: 'FIRST',
                    },
                },
                sepaDirectDebit: {
                    transactionSequenceType: 'SINGLE',
                },
            },
            storeId: this.configService.get('FISERV_STORE_ID'),
            order: {
                orderId: metadata?.payment_code + uniqueSeparate,
            },
        };
        const jsonPayload = JSON.stringify(payload);
        const signature = this.generateSignature(jsonPayload, timestamp, clientRequestId);
        const headers = {
            'Content-Type': 'application/json',
            'Api-Key': this.apiKey,
            Timestamp: timestamp,
            'Client-Request-Id': clientRequestId,
            'Message-Signature': signature,
        };
        console.log(payload);
        try {
            const response = await axios_1.default.post(`${this.baseUrl}`, jsonPayload, {
                headers,
            });
            if (response.status === 201 && response.data?.checkout?.redirectionUrl) {
                return response.data.checkout.redirectionUrl;
            }
            throw new Error('Missing checkout redirection URL in response');
        }
        catch (err) {
            console.error('Fiserv createCheckout error:', err.response?.data || err);
            throw new common_1.InternalServerErrorException('Failed to create Fiserv checkout');
        }
    }
    verifyWebhookSignature(rawPayload, signature, timestamp, clientRequestId) {
        const message = this.apiKey + clientRequestId + timestamp + rawPayload.toString('utf8');
        const hmac = crypto.createHmac('sha256', this.apiSecret);
        hmac.update(message, 'utf8');
        const expectedSignature = hmac.digest('base64');
        try {
            return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
        }
        catch (err) {
            console.error('Signature comparison failed:', err);
            return false;
        }
    }
};
exports.FiservService = FiservService;
exports.FiservService = FiservService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FiservService);
//# sourceMappingURL=fiserv.service.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
let StripeService = class StripeService {
    configService;
    stripe;
    constructor(configService) {
        this.configService = configService;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'));
    }
    async createCustomer(email, name) {
        try {
            return await this.stripe.customers.create({ email, name });
        }
        catch (err) {
            console.error('Stripe createCustomer error:', err);
            throw new common_1.InternalServerErrorException('Failed to create customer');
        }
    }
    async createPaymentIntent(amount, currency, customerId, metadata = {}) {
        try {
            return await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency,
                customer: customerId,
                metadata,
                automatic_payment_methods: { enabled: true },
            });
        }
        catch (err) {
            console.error('Stripe createPaymentIntent error:', err);
            throw new common_1.InternalServerErrorException('Failed to create payment intent');
        }
    }
    async retrievePaymentIntent(paymentIntentId) {
        try {
            return await this.stripe.paymentIntents.retrieve(paymentIntentId);
        }
        catch (err) {
            console.error('Stripe retrievePaymentIntent error:', err);
            throw new common_1.InternalServerErrorException('Failed to retrieve payment intent');
        }
    }
    async createCheckoutSession(sessionData) {
        try {
            return await this.stripe.checkout.sessions.create(sessionData);
        }
        catch (err) {
            console.error('Stripe createCheckoutSession error:', err);
            throw new common_1.InternalServerErrorException('Failed to create checkout session');
        }
    }
    async retrieveCheckoutSession(sessionId) {
        try {
            return await this.stripe.checkout.sessions.retrieve(sessionId);
        }
        catch (err) {
            console.error('Stripe retrieveCheckoutSession error:', err);
            throw new common_1.InternalServerErrorException('Failed to retrieve checkout session');
        }
    }
    constructWebhookEvent(payload, signature, endpointSecret) {
        try {
            return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
        }
        catch (err) {
            console.error('Stripe webhook signature verification failed:', err);
            throw new common_1.InternalServerErrorException('Invalid Stripe webhook signature');
        }
    }
    async refundPayment(paymentIntentId) {
        try {
            return await this.stripe.refunds.create({
                payment_intent: paymentIntentId,
            });
        }
        catch (err) {
            console.error('Stripe refund error:', err);
            throw new common_1.InternalServerErrorException('Failed to refund payment');
        }
    }
    async createSetupIntent(customerId) {
        try {
            return await this.stripe.setupIntents.create({
                customer: customerId,
                automatic_payment_methods: { enabled: true },
            });
        }
        catch (err) {
            console.error('Stripe createSetupIntent error:', err);
            throw new common_1.InternalServerErrorException('Failed to create setup intent');
        }
    }
    async createPaymentUrl(amount, currency, metadata = {}, success_url, cancel_url, payment_types) {
        try {
            const sessionData = {
                payment_method_types: payment_types,
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency,
                            product_data: {
                                name: 'Service Payment',
                            },
                            unit_amount: Math.round(amount * 100),
                        },
                        quantity: 1,
                    },
                ],
                success_url: success_url,
                cancel_url: cancel_url,
                metadata,
            };
            const session = await this.createCheckoutSession(sessionData);
            return session.url;
        }
        catch (error) {
            console.error('Error creating payment URL:', error);
            throw new Error('Failed to create payment URL');
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
export declare class StripeService {
    private readonly configService;
    private stripe;
    constructor(configService: ConfigService);
    createCustomer(email: string, name?: string): Promise<Stripe.Customer>;
    createPaymentIntent(amount: number, currency: string, customerId?: string, metadata?: Record<string, string>): Promise<Stripe.PaymentIntent>;
    retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
    createCheckoutSession(sessionData: Stripe.Checkout.SessionCreateParams): Promise<Stripe.Checkout.Session>;
    retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session>;
    constructWebhookEvent(payload: Buffer, signature: string, endpointSecret: string): Stripe.Event;
    refundPayment(paymentIntentId: string): Promise<Stripe.Refund>;
    createSetupIntent(customerId: string): Promise<Stripe.SetupIntent>;
    createPaymentUrl(amount: number, currency: string, metadata: Record<string, string>, success_url: string, cancel_url: string, payment_types: []): Promise<string>;
}
//# sourceMappingURL=stripe.service.d.ts.map
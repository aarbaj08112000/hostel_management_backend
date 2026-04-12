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
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const playwright_1 = require("playwright");
const Handlebars = __importStar(require("handlebars"));
const date_fns_1 = require("date-fns");
let PdfService = class PdfService {
    baseDir = path.join(__dirname, '../../pdf_letter_head');
    outputDir = path.join(process.cwd(), '/public/upload');
    assets = {
        css: this.readFile('invoice_new.css'),
        headerTemplate: this.readFile('header.html'),
        paymentReceiptTemplate: this.readFile('payment_receipt.html'),
        invoiceTemplate: this.readFile('invoice_content.html'),
        footerTemplate: this.readFile('footer.html'),
    };
    images = {
        watermark: this.readImageBase64('images/km-light.png'),
        logo: this.readImageBase64('images/logo.png'),
        callIcon: this.readImageBase64('images/call.png'),
        globalIcon: this.readImageBase64('images/global.png'),
        emailIcon: this.readImageBase64('images/sms.png'),
        topImg: this.readImageBase64('images/pdf-top-bg.png'),
        paidImg: this.readImageBase64('images/paid.png'),
    };
    constructor() {
        Handlebars.registerHelper('watermarkUrl', () => `data:image/png;base64,${this.images.watermark}`);
        Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {
            let result;
            switch (operator) {
                case 'eq':
                    result = lvalue == rvalue;
                    break;
                case 'neq':
                    result = lvalue != rvalue;
                    break;
                case '===':
                    result = lvalue === rvalue;
                    break;
                case '!==':
                    result = lvalue !== rvalue;
                    break;
                case 'gt':
                    result = lvalue > rvalue;
                    break;
                case 'gte':
                    result = lvalue >= rvalue;
                    break;
                case 'lt':
                    result = lvalue < rvalue;
                    break;
                case 'lte':
                    result = lvalue <= rvalue;
                    break;
                default:
                    throw new Error(`Unknown operator: ${operator}`);
            }
            return result ? options.fn(this) : options.inverse(this);
        });
    }
    readFile(fileName) {
        return fs.readFileSync(path.join(this.baseDir, fileName), 'utf8');
    }
    readImageBase64(relativePath) {
        return fs.readFileSync(path.join(this.baseDir, relativePath), {
            encoding: 'base64',
        });
    }
    getContext() {
        return {
            imgs: {
                topImgUrl: `data:image/png;base64,${this.images.topImg}`,
                paidImgUrl: `data:image/png;base64,${this.images.paidImg}`,
                logoUrl: `data:image/png;base64,${this.images.logo}`,
                callIcon: `data:image/png;base64,${this.images.callIcon}`,
                globalIcon: `data:image/png;base64,${this.images.globalIcon}`,
                emailIcon: `data:image/png;base64,${this.images.emailIcon}`,
            },
            footer: {
                companyName: process.env.COMPANY_NAME,
                contact: process.env.COMPANY_CONTACT,
                email: process.env.COMPANY_EMAIL,
                website_display: process.env.COMPANY_WEBSITE_DISPLAY,
                website_url: process.env.COMPANY_WEBSITE_URL,
                address: process.env.COMPANY_ADDRESS,
                trn: process.env.COMPANY_TRN,
                current_date: (0, date_fns_1.format)(new Date(), 'dd/MM/yyyy '),
                current_time: (0, date_fns_1.format)(new Date(), 'hh:mm a'),
            },
        };
    }
    async generateInvoicePdf(inputContext) {
        let result = {
            success: 0,
            status: 200,
            message: 'failed to generate pdf',
            data: {},
        };
        try {
            const context_def = this.getContext();
            inputContext.finance_evaluation = process.env.FINANCE_EVALUATION || 500;
            let context = {
                ...context_def,
                ...inputContext,
            };
            context.invoiceTitleLower =
                inputContext.invoiceTitle?.toLowerCase() || '';
            const compile = (tpl) => Handlebars.compile(tpl)(context);
            let template = context.invoiceType == 'payment_receipt'
                ? this.assets.paymentReceiptTemplate
                : this.assets.invoiceTemplate;
            const finalHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>${this.assets.css}</style>
          </head>
          <body>
            <div class="watermark-container">
              <img src="data:image/png;base64,${this.images.watermark}" />
            </div>
            <div class="content">
              ${compile(this.assets.headerTemplate)}
              ${compile(template)}
            </div>
            <div class="footer">
              ${compile(this.assets.footerTemplate)}
            </div>
          </body>
        </html>
      `;
            const browser = await playwright_1.chromium.launch({
                headless: true,
                executablePath: process.env.PDF_EXECUTABLE_PATH,
                args: ['--headless=new'],
            });
            const page = await browser.newPage();
            await page.setContent(finalHtml, { waitUntil: 'load' });
            fs.mkdirSync(this.outputDir, { recursive: true });
            let pdf_name = context.invoiceType ? context.invoiceType : 'pdf';
            const fileName = `${pdf_name}-${Date.now()}.pdf`;
            const pdfPath = path.join(this.outputDir, fileName);
            await page.pdf({
                path: pdfPath,
                format: context.invoiceType == 'payment_receipt' ? 'A5' : 'A4',
                landscape: context.invoiceType === 'payment_receipt',
                printBackground: true,
            });
            await browser.close();
            result = {
                success: 1,
                status: 200,
                message: 'pdf generated',
                data: {
                    file_name: fileName,
                    file_path: pdfPath,
                },
            };
            console.log('result');
            console.log(result);
        }
        catch (err) {
            console.error('PDF Generation Error:', err);
        }
        return result;
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PdfService);
//# sourceMappingURL=pdf_generate.service.js.map
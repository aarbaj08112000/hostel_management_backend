import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';
import * as Handlebars from 'handlebars';
import { Any } from 'typeorm';
import { format } from 'date-fns';

@Injectable()
export class PdfService {
  private baseDir = path.join(__dirname, '../../pdf_letter_head');
  private outputDir = path.join(process.cwd(), '/public/upload');

  private assets = {
    css: this.readFile('invoice_new.css'),
    headerTemplate: this.readFile('header.html'),
    paymentReceiptTemplate: this.readFile('payment_receipt.html'),
    invoiceTemplate: this.readFile('invoice_content.html'),
    footerTemplate: this.readFile('footer.html'),
  };

  private images = {
    watermark: this.readImageBase64('images/km-light.png'),
    logo: this.readImageBase64('images/logo.png'),
    callIcon: this.readImageBase64('images/call.png'),
    globalIcon: this.readImageBase64('images/global.png'),
    emailIcon: this.readImageBase64('images/sms.png'),
    topImg: this.readImageBase64('images/pdf-top-bg.png'),
    paidImg: this.readImageBase64('images/paid.png'),
  };

  constructor() {
    Handlebars.registerHelper(
      'watermarkUrl',
      () => `data:image/png;base64,${this.images.watermark}`,
    );
    Handlebars.registerHelper(
      'compare',
      function (lvalue: any, operator: string, rvalue: any, options) {
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
      },
    );
  }

  private readFile(fileName: string): string {
    return fs.readFileSync(path.join(this.baseDir, fileName), 'utf8');
  }

  private readImageBase64(relativePath: string): string {
    return fs.readFileSync(path.join(this.baseDir, relativePath), {
      encoding: 'base64',
    });
  }

  private getContext() {
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
        current_date: format(new Date(), 'dd/MM/yyyy '),
        current_time: format(new Date(), 'hh:mm a'),
      },
    };
  }

  async generateInvoicePdf(inputContext?): Promise<any> {
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
      const compile = (tpl: string) => Handlebars.compile(tpl)(context);
      let template =
        context.invoiceType == 'payment_receipt'
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

      const browser = await chromium.launch({
        headless: true,
        executablePath: process.env.PDF_EXECUTABLE_PATH,
        args: ['--headless=new'],
      });

      const page = await browser.newPage();
      await page.setContent(finalHtml, { waitUntil: 'load' });

      // fs.writeFileSync(path.join(__dirname, '../../public/debug.html'), finalHtml);

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
    } catch (err) {
      console.error('PDF Generation Error:', err);
    }

    return result;
  }
}

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
exports.PdfExportService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = __importStar(require("puppeteer"));
const ejs = __importStar(require("ejs"));
const XLSX = __importStar(require("xlsx"));
const fs = __importStar(require("fs"));
const date_fns_1 = require("date-fns");
const response_export_config_1 = __importDefault(require("./response.export.config"));
let PdfExportService = class PdfExportService {
    general;
    constructor() { }
    async exportFile(data, type = 'pdf', api_name = '') {
        let export_data = this.exportResponseFormatting(null, data);
        let final_obj;
        switch (type.toLocaleLowerCase()) {
            case 'pdf':
                final_obj = await this.generatePdf(export_data.data, export_data.api_name);
                break;
            case 'xlsx':
                final_obj = this.generateXlsx(export_data.data, export_data.api_name);
                break;
            case 'csv':
                final_obj = this.generateCsv(export_data.data, export_data.api_name);
                break;
        }
        return final_obj;
    }
    exportResponseFormatting(apiCode, apiData) {
        if (!apiCode)
            return { api_name: '', data: apiData };
        const dateFormat = 'dd MMM, yyyy | hh:mm a';
        const returnData = [];
        const apiConfig = response_export_config_1.default[apiCode];
        try {
            if (apiConfig) {
                let order_by = apiConfig.order_by || Object.keys(apiConfig.fields);
                apiConfig.fields = { ...apiConfig.fields };
                apiData.forEach((ele) => {
                    let newObj = {};
                    for (const key of order_by) {
                        if (key in apiConfig.fields) {
                            const keyConfig = apiConfig.fields[key];
                            let formatValue = (ele[key] && ele[key]) || '-';
                            if ('initial' in keyConfig &&
                                (!formatValue || formatValue == '-')) {
                                formatValue = keyConfig.initial;
                            }
                            if ('formatter' in keyConfig && formatValue != '-') {
                                switch (keyConfig.formatter) {
                                    case 'datetime':
                                        formatValue = new Date(formatValue);
                                        formatValue = (0, date_fns_1.format)(formatValue, dateFormat);
                                        break;
                                }
                            }
                            newObj[keyConfig.columnTitle] = formatValue;
                        }
                    }
                    returnData.push(newObj);
                });
            }
        }
        catch (err) {
            console.log(err);
        }
        return { api_name: apiConfig.api_name, data: returnData };
    }
    async generatePdf(data, api_name) {
        const file_name = api_name + '_' + Date.now() + '.pdf';
        let scale = 0.1;
        const datakeys = Object.keys(data[0]).length;
        if (datakeys >= 1 && datakeys <= 3) {
            scale = 1.5;
        }
        else if (datakeys <= 5) {
            scale = 1;
        }
        else if (datakeys <= 8) {
            scale = 0.8;
        }
        else if (datakeys <= 11) {
            scale = 0.3;
        }
        const ejsdata = ejs.compile(fs.readFileSync(process.cwd() + '/views/pdf.ejs', 'utf-8'));
        const html = ejsdata({ data, api_name });
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle2' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            scale,
            margin: {
                top: '10px',
                left: '10px',
                right: '10px',
                bottom: '0px',
            },
        });
        await page.close();
        await browser.close();
        return { file_data: pdfBuffer, file_name };
    }
    generateXlsx(data, api_name) {
        const file_name = api_name + '_' + Date.now() + '.xlsx';
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
        const file_data = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
        return { file_name, file_data };
    }
    generateCsv(data, api_name) {
        const file_name = api_name + '_' + Date.now() + '.csv';
        const sheetData = XLSX.utils.json_to_sheet(data);
        const file_data = XLSX.utils.sheet_to_csv(sheetData);
        return { file_name, file_data };
    }
};
exports.PdfExportService = PdfExportService;
exports.PdfExportService = PdfExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PdfExportService);
//# sourceMappingURL=pdf-exporter.js.map
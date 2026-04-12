import { CitGeneralLibrary } from './cit-general-library';
interface FinalResponseInterface {
    file_data: any;
    file_name: string;
}
type FileType = 'pdf' | 'xlsx' | 'csv';
export declare class PdfExportService {
    protected readonly general: CitGeneralLibrary;
    constructor();
    exportFile(data: any[], type?: FileType, api_name?: string): Promise<FinalResponseInterface>;
    private exportResponseFormatting;
    private generatePdf;
    private generateXlsx;
    private generateCsv;
}
export {};
//# sourceMappingURL=pdf-exporter.d.ts.map
import { PdfData } from './interfaces/pdf-data.interface';
export declare class PdfService {
    generate(data: PdfData): Promise<Buffer>;
}

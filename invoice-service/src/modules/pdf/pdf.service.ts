import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as htmlPdfNode from 'html-pdf-node';
import { PdfData } from './interfaces/pdf-data.interface';

@Injectable()
export class PdfService {
  /**
   * Generates a PDF document from invoice data using a Handlebars HTML template.
   * Compiles the template, injects data, then renders HTML to PDF via html-pdf-node.
   * @param data - Data to populate the invoice template
   * @returns PDF file as a Buffer
   */
  async generate(data: PdfData): Promise<Buffer> {
    const templatePath = path.join(
      __dirname,
      'templates',
      'invoice.template.hbs',
    );
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const html = Handlebars.compile(templateSource)(data);
    return htmlPdfNode.generatePdf(
      { content: html },
      { format: 'A4' },
    ) as unknown as Promise<Buffer>;
  }
}

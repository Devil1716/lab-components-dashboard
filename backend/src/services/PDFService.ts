import PDFDocument from 'pdfkit';
import { SQLiteIssueRepository } from '../repositories/sqlite/SQLiteIssueRepository';

const issueRepo = new SQLiteIssueRepository();

export class PDFService {
  static async generateTransactionReport(): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const transactions = await issueRepo.getAllTransactions();
        
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Header
        doc.fontSize(20).text('Amity Lab Issuance Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        // Body
        transactions.forEach(tx => {
          doc.fontSize(14).text(`Transaction: ${tx.id}`, { underline: true });
          doc.fontSize(10).text(`Batch: ${tx.batch_id} | Issued: ${new Date(tx.issued_at).toLocaleString()} | Status: ${tx.return_status}`);
          
          if (tx.items && tx.items.length > 0) {
            doc.moveDown(0.5);
            doc.text('Components:');
            tx.items.forEach((item: any) => {
              doc.text(`- ${item.component_id} | Issued: ${item.quantity_issued} | Status: ${item.item_status}`, { indent: 20 });
            });
          } else {
            doc.text('No components associated.', { indent: 20 });
          }
          doc.moveDown();
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

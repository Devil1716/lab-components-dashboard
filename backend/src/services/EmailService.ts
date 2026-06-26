import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      // For development, we use Ethereal Email (a fake SMTP service provided by Nodemailer)
      // In production, replace this with your actual SMTP config (e.g., Gmail, SendGrid)
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, 
          pass: testAccount.pass, 
        },
      });
      console.log('EmailService: Nodemailer initialized with Ethereal Email for testing.');
    } catch (err) {
      console.error('Failed to initialize EmailService:', err);
    }
  }

  async sendIssuanceReceipt(studentEmail: string, batchId: string, items: any[]) {
    if (!this.transporter) return;
    
    const itemList = items.map(i => `- ${i.component_id}: ${i.quantity_issued} pcs`).join('\n');
    
    const mailOptions = {
      from: '"Amity Lab Admin" <admin@amity.edu>',
      to: studentEmail,
      subject: `Lab Components Issued - Batch ${batchId}`,
      text: `Hello,\n\nThe following components have been issued to your batch (${batchId}):\n\n${itemList}\n\nPlease ensure they are returned safely.\n\nThanks,\nAmity Lab Admin`,
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }

  async sendFineNotification(studentEmail: string, batchId: string, amount: number, reason: string) {
    if (!this.transporter) return;

    const mailOptions = {
      from: '"Amity Lab Admin" <admin@amity.edu>',
      to: studentEmail,
      subject: `Fine Levied - Batch ${batchId}`,
      text: `Hello,\n\nA fine of ₹${amount} has been levied against your batch (${batchId}) for the following reason:\n\n${reason}\n\nPlease clear this fine at the earliest.\n\nThanks,\nAmity Lab Admin`,
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
}

export const emailService = new EmailService();

import express from 'express';
import { PDFService } from '../services/PDFService';

const router = express.Router();

router.get('/pdf', async (req, res) => {
  try {
    const pdfBuffer = await PDFService.generateTransactionReport();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Amity_Lab_Report.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate PDF', error });
  }
});

export default router;

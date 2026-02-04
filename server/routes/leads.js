import express from 'express';
import { prisma } from '../index.js';
import { upload } from '../middleware/upload.js';
import { sendLeadEmail } from '../utils/email.js';

const router = express.Router();

router.post('/', upload.array('files', 5), async (req, res) => {
  try {
    const { name, email, company, phone, message } = req.body;
    
    const files = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        company: company || null,
        phone: phone || null,
        message,
        files: JSON.stringify(files)
      }
    });

    // Send email notification
    if (process.env.SMTP_HOST) {
      try {
        await sendLeadEmail({
          name,
          email,
          company,
          phone,
          message,
          files
        });
      } catch (emailError) {
        console.error('Email send failed:', emailError);
      }
    }

    res.json({ message: 'Lead submitted successfully', id: lead.id });
  } catch (error) {
    console.error('Lead submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

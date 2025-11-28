import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// POST /api/test-email
// body: { to, subject, text }
router.post('/', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing to/subject/text' });
  }

  try {
    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: (process.env.SMTP_SECURE === 'true'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else if (process.env.SMTP_SENDMAIL === 'true') {
      transporter = nodemailer.createTransport({ sendmail: true });
    }

    if (!transporter) {
      return res.status(400).json({ error: 'SMTP not configured' });
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@baraton.local',
      to,
      subject,
      text,
    });

    res.json({ success: true, info });
  } catch (err) {
    console.error('Error sending test email:', err);
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});

export default router;

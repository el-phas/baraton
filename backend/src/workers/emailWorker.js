import nodemailer from 'nodemailer';
import EmailQueue from '../models/emailQueue.js';
import Payment from '../models/payment.js';
import LodgingBooking from '../models/lodgingBooking.js';
import ConferenceBooking from '../models/conferenceBooking.js';
import { generateInvoicePdf } from '../utils/invoice.js';

const POLL_INTERVAL = Number(process.env.EMAIL_WORKER_INTERVAL_MS || 5000);
const MAX_ATTEMPTS = Number(process.env.EMAIL_MAX_ATTEMPTS || 5);

function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: (process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  if (process.env.SMTP_SENDMAIL === 'true') {
    return nodemailer.createTransport({ sendmail: true });
  }
  return null;
}

async function processOne(queueItem, transporter) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@baraton.local',
      to: queueItem.to,
      subject: queueItem.subject,
      text: queueItem.text || undefined,
      html: queueItem.html || undefined,
    };

    // attach invoice if requested and payment/booking available
    if (queueItem.attachments && Array.isArray(queueItem.attachments) && queueItem.attachments.length) {
      mailOptions.attachments = queueItem.attachments.map(a => ({ filename: a.filename, content: Buffer.from(a.content, 'base64'), contentType: a.contentType }));
    }

    if (!transporter) {
      console.log('✉️ [EmailWorker] SMTP not configured. Email contents: ', mailOptions);
      await queueItem.update({ status: 'sent', attempts: queueItem.attempts + 1 });
      return;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ [EmailWorker] Sent:', info.messageId || info);
    await queueItem.update({ status: 'sent', attempts: queueItem.attempts + 1, lastError: null });
  } catch (err) {
    console.error('✉️ [EmailWorker] Send error:', err.message || err);
    const attempts = (queueItem.attempts || 0) + 1;
    const next = new Date(Date.now() + Math.min(60 * 60 * 1000, Math.pow(2, attempts) * 1000));
    const status = attempts >= MAX_ATTEMPTS ? 'failed' : 'queued';
    await queueItem.update({ attempts, lastError: String(err.message || err), scheduledAt: next, status });
  }
}

export function startEmailWorker() {
  const transporter = createTransporter();

  setInterval(async () => {
    try {
      const now = new Date();
      const nextItem = await EmailQueue.findOne({ where: { status: 'queued', scheduledAt: null }, order: [['createdAt', 'ASC']] });
      if (!nextItem) return;
      await processOne(nextItem, transporter);
    } catch (err) {
      console.error('✉️ [EmailWorker] Poll error:', err.message || err);
    }
  }, POLL_INTERVAL);
  console.log('✉️ [EmailWorker] started, polling every', POLL_INTERVAL, 'ms');
}

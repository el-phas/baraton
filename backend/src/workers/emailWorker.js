import nodemailer from 'nodemailer';
import EmailQueue from '../models/emailQueue.js';
import { processEmailRedis } from '../queues/redisEmailQueue.js';
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

async function sendMailPayload(payload, transporter, metaDbItem = null) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@baraton.local',
      to: payload.to,
      subject: payload.subject,
      text: payload.text || undefined,
      html: payload.html || undefined,
    };

    if (payload.attachments && Array.isArray(payload.attachments) && payload.attachments.length) {
      mailOptions.attachments = payload.attachments.map(a => ({ filename: a.filename, content: Buffer.from(a.content, 'base64'), contentType: a.contentType }));
    }

    if (!transporter) {
      console.log('✉️ [EmailWorker] SMTP not configured. Email contents: ', mailOptions);
      if (metaDbItem) await metaDbItem.update({ status: 'sent', attempts: (metaDbItem.attempts || 0) + 1 });
      return;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ [EmailWorker] Sent:', info.messageId || info);
    if (metaDbItem) await metaDbItem.update({ status: 'sent', attempts: (metaDbItem.attempts || 0) + 1, lastError: null });
  } catch (err) {
    console.error('✉️ [EmailWorker] Send error:', err.message || err);
    if (metaDbItem) {
      const attempts = (metaDbItem.attempts || 0) + 1;
      const next = new Date(Date.now() + Math.min(60 * 60 * 1000, Math.pow(2, attempts) * 1000));
      const status = attempts >= MAX_ATTEMPTS ? 'failed' : 'queued';
      await metaDbItem.update({ attempts, lastError: String(err.message || err), scheduledAt: next, status });
    }
    throw err;
  }
}

export function startEmailWorker() {
  const transporter = createTransporter();

  // If Redis is configured, use Bull-backed queue processor
  if (process.env.REDIS_HOST || process.env.REDIS_URL) {
    try {
      processEmailRedis(async (payload) => {
        // payload may include a `dbId` we can use to update metadata in the DB
        let dbItem = null;
        if (payload.dbId) {
          try { dbItem = await EmailQueue.findByPk(payload.dbId); } catch (e) { /* ignore */ }
        }
        await sendMailPayload(payload, transporter, dbItem);
      });
      console.log('✉️ [EmailWorker] Using Redis-backed queue (Bull)');
      return;
    } catch (err) {
      console.error('✉️ [EmailWorker] Failed to initialize Redis queue processor:', err.message || err);
      // fall through to DB polling fallback
    }
  }

  // DB polling fallback (existing behavior)
  setInterval(async () => {
    try {
      const nextItem = await EmailQueue.findOne({ where: { status: 'queued', scheduledAt: null }, order: [['createdAt', 'ASC']] });
      if (!nextItem) return;
      const payload = {
        to: nextItem.to,
        subject: nextItem.subject,
        text: nextItem.text,
        html: nextItem.html,
        attachments: nextItem.attachments,
        dbId: nextItem.id,
      };
      await sendMailPayload(payload, transporter, nextItem);
    } catch (err) {
      console.error('✉️ [EmailWorker] Poll error:', err.message || err);
    }
  }, POLL_INTERVAL);
  console.log('✉️ [EmailWorker] started, polling every', POLL_INTERVAL, 'ms');
}

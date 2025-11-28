import express from 'express';
import crypto from 'crypto';

import Payment from '../models/payment.js';
import LodgingBooking from '../models/lodgingBooking.js';
import ConferenceBooking from '../models/conferenceBooking.js';
import nodemailer from 'nodemailer';
import EmailQueue from '../models/emailQueue.js';
import { enqueueEmailRedis } from '../queues/redisEmailQueue.js';
import { generateInvoicePdf } from '../utils/invoice.js';

const router = express.Router();

// POST /api/webhook (mounted in app.js)
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('📩 [Webhook] Received Paystack event');

  const signature = req.headers['x-paystack-signature'];
  const secret = process.env.PAYSTACK_SECRET_KEY;

  // Validate signature
  const hash = crypto
    .createHmac('sha512', secret)
    .update(req.body)
    .digest('hex');

  if (hash !== signature) {
    console.warn('❌ [Webhook] Invalid signature');
    return res.status(400).send('Invalid signature');
  }

  try {
    const event = JSON.parse(req.body.toString());
    console.log('📨 [Webhook] Event parsed:', event.event);

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const status = event.data.status;

      console.log(`💳 [Webhook] Payment status for ${reference}: ${status}`);

      if (status === 'success') {
        console.log(`🔔 [Webhook] Successful payment received for reference: ${reference}`);

        // Update payment record
        const [updated] = await Payment.update(
          { status: 'success' },
          { where: { reference } }
        );

        if (updated) {
          const payment = await Payment.findOne({ where: { reference } });

          if (payment) {
            console.log(`� [Webhook] Updating booking ID ${payment.booking_id} (type: ${payment.booking_type}) to confirmed`);
            if (payment.booking_type === 'lodging') {
              await LodgingBooking.update(
                { status: 'confirmed' },
                { where: { id: payment.booking_id } }
              );
              console.log(`✅ [Webhook] LodgingBooking #${payment.booking_id} confirmed`);
              // Fetch booking and enqueue confirmation email with invoice
              try {
                const booking = await LodgingBooking.findByPk(payment.booking_id);
                const metadata = payment.metadata || {};
                const guestEmail = booking?.guest_email || metadata?.guest_email;
                const guestName = booking?.guest_name || metadata?.guest_name || 'Guest';
                if (guestEmail) {
                  const subject = `Booking Confirmed — Reference ${booking?.reference || payment.reference}`;
                  const text = `Hello ${guestName},\n\nYour lodging booking (reference: ${booking?.reference || payment.reference}) has been confirmed.\n\nThank you for booking with us.`;
                  const html = `<p>Hello ${guestName},</p><p>Your lodging booking (reference: <strong>${booking?.reference || payment.reference}</strong>) has been confirmed.</p><p>Room: <strong>${booking?.room_name || metadata?.name || 'N/A'}</strong></p><p>Start: ${booking?.start_date || 'N/A'} — End: ${booking?.end_date || 'N/A'}</p><p>Amount paid: ${payment.amount}</p><p>Thank you for booking with us.</p>`;

                  // generate invoice PDF and attach as base64
                  let attachments = [];
                  try {
                    const pdfBuffer = await generateInvoicePdf({ booking: booking?.toJSON ? booking.toJSON() : booking, payment });
                    attachments.push({ filename: `invoice-${booking?.reference || payment.reference}.pdf`, content: pdfBuffer.toString('base64'), contentType: 'application/pdf' });
                  } catch (err) {
                    console.error('✉️ [Webhook] Failed to generate invoice PDF:', err.message || err);
                  }
                  
                  // If Redis is configured, also add to the Redis-backed queue for immediate processing
                  try {
                    const dbItem = await EmailQueue.create({
                      to: guestEmail,
                      subject,
                      text,
                      html,
                      attachments,
                      attempts: 0,
                      status: 'queued',
                      scheduledAt: null,
                    });
                    if (process.env.REDIS_HOST || process.env.REDIS_URL) {
                      // include dbId so the worker can update the DB record status
                      await enqueueEmailRedis({ ...dbItem.toJSON(), dbId: dbItem.id });
                    }
                    console.log(`✉️ [Webhook] Enqueued confirmation email for ${guestEmail}`);
                  } catch (err) {
                    console.error('✉️ [Webhook] Error creating/enqueuing email:', err.message || err);
                  }
                } else {
                  console.log('✉️ [Webhook] No guest email available to enqueue confirmation');
                }
              } catch (err) {
                console.error('✉️ [Webhook] Error enqueuing confirmation email:', err);
              }
            } else if (payment.booking_type === 'conference') {
              await ConferenceBooking.update(
                { status: 'confirmed' },
                { where: { id: payment.booking_id } }
              );
              console.log(`✅ [Webhook] ConferenceBooking #${payment.booking_id} confirmed`);
              // Fetch booking and enqueue confirmation email with invoice
              try {
                const booking = await ConferenceBooking.findByPk(payment.booking_id);
                const metadata = payment.metadata || {};
                const guestEmail = booking?.guest_email || metadata?.guest_email;
                const guestName = booking?.guest_name || metadata?.guest_name || 'Guest';
                if (guestEmail) {
                  const subject = `Booking Confirmed — Reference ${booking?.reference || payment.reference}`;
                  const text = `Hello ${guestName},\n\nYour conference booking (reference: ${booking?.reference || payment.reference}) has been confirmed.\n\nThank you for booking with us.`;
                  const html = `<p>Hello ${guestName},</p><p>Your conference booking (reference: <strong>${booking?.reference || payment.reference}</strong>) has been confirmed.</p><p>Conference: <strong>${booking?.conference_name || metadata?.name || 'N/A'}</strong></p><p>Start: ${booking?.start_date || 'N/A'} — End: ${booking?.end_date || 'N/A'}</p><p>Amount paid: ${payment.amount}</p><p>Thank you for booking with us.</p>`;

                  let attachments = [];
                  try {
                    const pdfBuffer = await generateInvoicePdf({ booking: booking?.toJSON ? booking.toJSON() : booking, payment });
                    attachments.push({ filename: `invoice-${booking?.reference || payment.reference}.pdf`, content: pdfBuffer.toString('base64'), contentType: 'application/pdf' });
                  } catch (err) {
                    console.error('✉️ [Webhook] Failed to generate invoice PDF:', err.message || err);
                  }

                  try {
                    const dbItem = await EmailQueue.create({
                      to: guestEmail,
                      subject,
                      text,
                      html,
                      attachments,
                      attempts: 0,
                      status: 'queued',
                      scheduledAt: null,
                    });
                    if (process.env.REDIS_HOST || process.env.REDIS_URL) {
                      await enqueueEmailRedis({ ...dbItem.toJSON(), dbId: dbItem.id });
                    }
                    console.log(`✉️ [Webhook] Enqueued confirmation email for ${guestEmail}`);
                  } catch (err) {
                    console.error('✉️ [Webhook] Error creating/enqueuing email:', err.message || err);
                  }
                } else {
                  console.log('✉️ [Webhook] No guest email available to enqueue confirmation');
                }
              } catch (err) {
                console.error('✉️ [Webhook] Error enqueuing confirmation email:', err);
              }
            } else {
              console.warn(`⚠️ [Webhook] Unknown booking_type: ${payment.booking_type}`);
            }
          } else {
            console.warn(`⚠️ [Webhook] Payment found but no booking linked`);
          }
        } else {
          console.warn(`⚠️ [Webhook] Payment record not updated. Possibly already confirmed.`);
        }
      } else {
        console.warn(`⚠️ [Webhook] Ignoring non-successful status: ${status}`);
      }
    } else {
      console.log(`ℹ️ [Webhook] Ignored event type: ${event.event}`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('💥 [Webhook] Error processing webhook:', err);
    res.status(500).send('Internal error');
  }
});

export default router;

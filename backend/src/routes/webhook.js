import express from 'express';
import crypto from 'crypto';

import Payment from '../models/payment.js';
import LodgingBooking from '../models/lodgingBooking.js';
import ConferenceBooking from '../models/conferenceBooking.js';
import nodemailer from 'nodemailer';

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
              // Fetch booking and send confirmation email if possible
              try {
                const booking = await LodgingBooking.findByPk(payment.booking_id);
                const metadata = payment.metadata || {};
                const guestEmail = booking?.guest_email || metadata?.guest_email;
                const guestName = booking?.guest_name || metadata?.guest_name || 'Guest';
                if (guestEmail) {
                  // Build a simple email body
                  const subject = `Booking Confirmed — Reference ${booking?.reference || payment.reference}`;
                  const body = `Hello ${guestName},\n\nYour lodging booking (reference: ${booking?.reference || payment.reference}) has been confirmed.\n\nBooking details:\n- Room: ${booking?.room_name || metadata?.name || 'N/A'}\n- Type: ${booking?.room_type || metadata?.room_type || 'N/A'}\n- Occupancy: ${booking?.room_occupancy || metadata?.occupancy || 'N/A'}\n- Start: ${booking?.start_date || 'N/A'}\n- End: ${booking?.end_date || 'N/A'}\n- Amount paid: ${payment.amount}\n\nThank you for booking with us.\n`;

                  // Configure transporter (use SMTP if configured, otherwise use sendmail or console fallback)
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

                  if (transporter) {
                    await transporter.sendMail({
                      from: process.env.EMAIL_FROM || 'no-reply@baraton.local',
                      to: guestEmail,
                      subject,
                      text: body,
                    });
                    console.log(`✉️ [Webhook] Confirmation email sent to ${guestEmail}`);
                  } else {
                    console.log('✉️ [Webhook] SMTP not configured; email content:\n', body);
                  }
                } else {
                  console.log('✉️ [Webhook] No guest email available to send confirmation');
                }
              } catch (err) {
                console.error('✉️ [Webhook] Error sending confirmation email:', err);
              }
            } else if (payment.booking_type === 'conference') {
              await ConferenceBooking.update(
                { status: 'confirmed' },
                { where: { id: payment.booking_id } }
              );
              console.log(`✅ [Webhook] ConferenceBooking #${payment.booking_id} confirmed`);
              // Fetch booking and send confirmation email if possible
              try {
                const booking = await ConferenceBooking.findByPk(payment.booking_id);
                const metadata = payment.metadata || {};
                const guestEmail = booking?.guest_email || metadata?.guest_email;
                const guestName = booking?.guest_name || metadata?.guest_name || 'Guest';
                if (guestEmail) {
                  const subject = `Booking Confirmed — Reference ${booking?.reference || payment.reference}`;
                  const body = `Hello ${guestName},\n\nYour conference booking (reference: ${booking?.reference || payment.reference}) has been confirmed.\n\nBooking details:\n- Conference: ${booking?.conference_name || metadata?.name || 'N/A'}\n- Size: ${booking?.conference_size || metadata?.size || 'N/A'}\n- Start: ${booking?.start_date || 'N/A'}\n- End: ${booking?.end_date || 'N/A'}\n- Amount paid: ${payment.amount}\n\nThank you for booking with us.\n`;

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

                  if (transporter) {
                    await transporter.sendMail({
                      from: process.env.EMAIL_FROM || 'no-reply@baraton.local',
                      to: guestEmail,
                      subject,
                      text: body,
                    });
                    console.log(`✉️ [Webhook] Confirmation email sent to ${guestEmail}`);
                  } else {
                    console.log('✉️ [Webhook] SMTP not configured; email content:\n', body);
                  }
                } else {
                  console.log('✉️ [Webhook] No guest email available to send confirmation');
                }
              } catch (err) {
                console.error('✉️ [Webhook] Error sending confirmation email:', err);
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

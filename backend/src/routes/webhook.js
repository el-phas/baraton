import express from 'express';
import crypto from 'crypto';

import Payment from '../models/payment.js';
import LodgingBooking from '../models/lodgingBooking.js';
import ConferenceBooking from '../models/conferenceBooking.js';

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
            } else if (payment.booking_type === 'conference') {
              await ConferenceBooking.update(
                { status: 'confirmed' },
                { where: { id: payment.booking_id } }
              );
              console.log(`✅ [Webhook] ConferenceBooking #${payment.booking_id} confirmed`);
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

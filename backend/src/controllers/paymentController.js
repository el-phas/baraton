import paystack from '../config/paystack.js';
import Payment from '../models/payment.js';
import LodgingBooking from '../models/lodgingBooking.js';
import ConferenceBooking from '../models/conferenceBooking.js';
import dotenv from 'dotenv';
dotenv.config();


/**
 * Initiate payment and create a pending payment record
 */
export const initiatePayment = async (req, res, next) => {
  try {
    const { amount, email, booking_id, booking_type } = req.body;
    console.log('📨 [initiatePayment] Incoming request:', { amount, email, booking_id, booking_type });

    if (!amount || !email || !booking_id || !booking_type) {
      console.warn('⚠️ Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['lodging', 'conference'].includes(booking_type)) {
      return res.status(400).json({ error: 'Invalid booking_type' });
    }

    const reference = `BOB-${Date.now()}`;
    const frontendUrl = process.env.FRONTEND_URL;

    console.log('🔗 [initiatePayment] Initializing transaction with Paystack...');
    const response = await paystack.transaction.initialize({
      amount,
      email,
      reference,
      callback_url: `${frontendUrl}/payment-success?reference=${reference}`,
    });

    console.log('✅ [initiatePayment] Paystack responded:', response.data);

    console.log('💾 [initiatePayment] Creating pending payment record in DB...');
    const payment = await Payment.create({
      booking_id,
      booking_type,
      amount,
      status: 'pending',
      reference,
    });

    console.log('✅ [initiatePayment] Payment record created:', payment.toJSON());

    res.json({ ...response.data, payment });
  } catch (err) {
    console.error('❌ [initiatePayment] Error occurred:', err);
    next(err);
  }
};


/**
 * Verify payment using reference and update status in DB
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;
    console.log(`🔍 [verifyPayment] Verifying payment for reference: ${reference}`);

    if (!reference) {
      console.warn('⚠️ [verifyPayment] Missing payment reference');
      return res.status(400).json({ success: false, message: 'Missing payment reference' });
    }

    console.log('🔗 [verifyPayment] Contacting Paystack for verification...');
    const response = await paystack.transaction.verify(reference);
    const paystackData = response.data;

    console.log('💳 [verifyPayment] Paystack verification response:', paystackData);

    if (paystackData.status !== 'success') {
      console.warn(`❌ [verifyPayment] Payment not successful: ${paystackData.status}`);
      return res.status(400).json({
        success: false,
        message: 'Payment was not successful',
        data: paystackData,
      });
    }

    console.log('💾 [verifyPayment] Updating payment status in DB...');
    await Payment.update(
      { status: 'success' },
      { where: { reference } }
    );

    const payment = await Payment.findOne({ where: { reference } });

    if (!payment) {
      console.error('❌ [verifyPayment] Payment record not found after update');
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    let booking = null;
    if (payment.booking_type === 'lodging') {
      console.log(`💾 [verifyPayment] Confirming LodgingBooking ID ${payment.booking_id}`);
      await LodgingBooking.update(
        { status: 'confirmed' },
        { where: { id: payment.booking_id } }
      );
      booking = await LodgingBooking.findByPk(payment.booking_id);
    } else if (payment.booking_type === 'conference') {
      console.log(`💾 [verifyPayment] Confirming ConferenceBooking ID ${payment.booking_id}`);
      await ConferenceBooking.update(
        { status: 'confirmed' },
        { where: { id: payment.booking_id } }
      );
      booking = await ConferenceBooking.findByPk(payment.booking_id);
    } else {
      console.warn('⚠️ [verifyPayment] Unknown booking_type');
    }

    console.log('✅ [verifyPayment] Booking updated and fetched:', booking?.toJSON());

    res.json({
      success: true,
      message: 'Payment verified and records updated',
      payment: paystackData,
      booking,
    });

  } catch (err) {
    console.error('💥 [verifyPayment] Error verifying payment:', err);
    next(err);
  }
};

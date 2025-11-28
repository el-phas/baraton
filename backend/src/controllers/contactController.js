import ContactMessage from '../models/contactMessage.js';
import nodemailer from 'nodemailer';

const createTransporter = () => {
  // Use SMTP config from env; nodemailer present in package.json
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass },
  });
};

export const createContactMessage = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;
    const saved = await ContactMessage.create({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      subject,
      message,
    });

    // Send email to admin if configured
    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL;
    if (transporter && adminEmail) {
      const text = `New contact message from ${firstName} ${lastName}\n\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nSubject: ${subject}\n\nMessage:\n${message}`;
      await transporter.sendMail({
        from: process.env.SMTP_FROM || user || adminEmail,
        to: adminEmail,
        subject: `Website Contact: ${subject}`,
        text,
      });
    }

    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

export const getAllContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

export const deleteContactMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByPk(req.params.id);
    if (!message) return res.status(404).json({ message: 'Not found' });
    await message.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

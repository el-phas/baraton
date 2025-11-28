import PDFDocument from 'pdfkit';
import getStream from 'get-stream';

export async function generateInvoicePdf({ booking, payment }) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.fontSize(20).text('Booking Invoice', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Reference: ${booking?.reference || payment?.reference || ''}`);
  doc.text(`Guest: ${booking?.guest_name || 'N/A'}`);
  doc.text(`Email: ${booking?.guest_email || 'N/A'}`);
  doc.moveDown();

  doc.text('Booking Details:', { underline: true });
  doc.moveDown(0.2);
  doc.text(`Room: ${booking?.room_name || 'N/A'}`);
  doc.text(`Type: ${booking?.room_type || 'N/A'}`);
  doc.text(`Occupancy: ${booking?.room_occupancy || 'N/A'}`);
  doc.text(`Start: ${booking?.start_date || 'N/A'}`);
  doc.text(`End: ${booking?.end_date || 'N/A'}`);
  doc.moveDown();

  doc.text('Payment:', { underline: true });
  doc.moveDown(0.2);
  doc.text(`Amount paid: ${payment?.amount || 'N/A'}`);
  doc.text(`Status: ${payment?.status || 'N/A'}`);

  doc.end();

  // convert to buffer
  const buffer = await getStream.buffer(doc);
  return buffer;
}

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, device, issue, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ref =
      'ZZ-' +
      new Date().getFullYear() +
      '-' +
      Math.floor(10000 + Math.random() * 90000);

    const { data, error } = await resend.emails.send({
  from: 'Z&Z iPhone Repairs <bookings@zziphonerepairs.com.au>',
  to: 'info@zziphonerepairs.com.au',
  subject: `New Repair Booking - ${ref}`,
  html: `
    <h2>New Repair Booking</h2>
    <p><strong>Reference:</strong> ${ref}</p>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email || 'Not provided'}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Device:</strong> ${device || 'Not provided'}</p>
    <p><strong>Issue:</strong> ${issue || 'Not provided'}</p>
    <p><strong>Message:</strong> ${message || 'Not provided'}</p>
  `,
});

if (error) {
  console.error('Resend error:', error);
  return res.status(500).json({
    error: error.message || 'Email could not be sent'
  });
}

console.log('Resend success:', data);
    return res.status(200).json({
      success: true,
      ref,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to submit booking' });
  }
}

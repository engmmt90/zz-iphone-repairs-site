import { Resend } from 'resend';
import { neon } from '@neondatabase/serverless';
const resend = new Resend(process.env.RESEND_API_KEY);
const sql = neon(process.env.POSTGRES_URL);
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, device, issue, message, preferredDate } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ref =
      'ZZ-' +
      new Date().getFullYear() +
      '-' +
      Math.floor(10000 + Math.random() * 90000);
await sql`
  INSERT INTO repair_requests (
    reference,
    name,
    phone,
    email,
    device,
    issue,
    message,
    preferred_date,
    status
  )
  VALUES (
    ${ref},
    ${name},
    ${phone},
    ${email || null},
    ${device || null},
    ${issue || null},
    ${message || null},
    ${preferredDate || null},
    'Received'
  )
`;
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
    if (email) {
  const { error: customerEmailError } = await resend.emails.send({
    from: 'Z&Z iPhone Repairs <bookings@zziphonerepairs.com.au>',
    to: email,
    subject: `We received your repair request - ${ref}`,
    html: `
      <h2>Thanks for choosing Z&Z iPhone Repairs</h2>

      <p>Hi ${name},</p>

      <p>We’ve received your iPhone repair request.</p>

      <p><strong>Your reference number:</strong> ${ref}</p>
      <p><strong>Device:</strong> ${device || 'Not provided'}</p>
      <p><strong>Repair:</strong> ${issue || 'Not provided'}</p>

      <p>We’ll review your request and contact you shortly to confirm the repair details.</p>

      <p>
        Z&Z iPhone Repairs<br>
        +61 401 825 549<br>
        info@zziphonerepairs.com.au<br>
        zziphonerepairs.com.au
      </p>
    `,
  });

  if (customerEmailError) {
    console.error('Customer confirmation email error:', customerEmailError);
  }
}
    return res.status(200).json({
      success: true,
      ref,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to submit booking' });
  }
}

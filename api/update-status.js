import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
const sql = neon(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
const adminToken = req.headers['x-admin-token'];

if (!process.env.ADMIN_TOKEN || adminToken !== process.env.ADMIN_TOKEN) {
  return res.status(401).json({
    error: 'Unauthorized'
  });
}
  try {
    const { reference, status } = req.body;

    if (!reference || !status) {
      return res.status(400).json({
        error: 'Reference and status are required'
      });
    }

    const allowedStatuses = [
      'Received',
      'In Progress',
      'Waiting for Parts',
      'Ready for Pickup',
      'Completed'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status'
      });
    }

    const result = await sql`
      UPDATE repair_requests
      SET
        status = ${status},
        updated_at = NOW()
      WHERE reference = ${reference}
      RETURNING
        reference,
        name,
        device,
        issue,
        status,
        preferred_date,
        created_at,
        updated_at
    `;

    if (result.length === 0) {
      return res.status(404).json({
        error: 'Repair request not found'
      });
    }

    return res.status(200).json({
      success: true,
      repair: result[0]
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Unable to update repair status'
    });
  }
}

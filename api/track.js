import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const reference = String(req.query.reference || '').trim();

  if (!reference) {
    return res.status(400).json({ error: 'Reference is required' });
  }

  try {
    const rows = await sql`
      SELECT
        reference,
        name,
        device,
        issue,
        status,
        preferred_date,
        created_at,
        updated_at
      FROM repair_requests
      WHERE reference = ${reference}
      LIMIT 1
    `;

    if (!rows.length) {
      return res.status(404).json({ error: 'Repair request not found' });
    }

    return res.status(200).json({
      success: true,
      repair: rows[0]
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return res.status(500).json({ error: 'Unable to retrieve repair status' });
  }
}

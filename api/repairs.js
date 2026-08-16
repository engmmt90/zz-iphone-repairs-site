import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminToken = req.headers['x-admin-token'];

  if (!process.env.ADMIN_TOKEN || adminToken !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const repairs = await sql`
      SELECT
        reference,
        name,
        phone,
        email,
        device,
        issue,
        status,
        preferred_date,
        created_at,
        updated_at
      FROM repair_requests
      ORDER BY created_at DESC
      LIMIT 100
    `;

    return res.status(200).json({
      success: true,
      repairs
    });
  } catch (error) {
    console.error('Repairs list error:', error);

    return res.status(500).json({
      error: 'Unable to load repair requests'
    });
  }
}

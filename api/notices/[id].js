import { sql } from '../_db.js';
import { requireAuth } from '../_auth.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const notice = await sql`SELECT * FROM notices WHERE id = ${id}`;
      if (notice.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(notice[0]);
    }

    if (req.method === 'PUT') {
      if (!requireAuth(req, res)) return;
      
      const { title, message, type, expires_at, active } = req.body;
      
      const updated = await sql`
        UPDATE notices 
        SET title = ${title}, 
            message = ${message}, 
            type = ${type}, 
            expires_at = ${expires_at}, 
            active = ${active}
        WHERE id = ${id}
        RETURNING *
      `;
      
      if (updated.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(updated[0]);
    }

    if (req.method === 'DELETE') {
      if (!requireAuth(req, res)) return;
      
      const deleted = await sql`DELETE FROM notices WHERE id = ${id} RETURNING *`;
      if (deleted.length === 0) return res.status(404).json({ error: 'Not found' });
      
      return res.status(200).json({ success: true, deleted: deleted[0].id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

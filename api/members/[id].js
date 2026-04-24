import { sql } from '../_db.js';
import { requireAuth } from '../_auth.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const member = await sql`SELECT * FROM members WHERE id = ${id}`;
      if (member.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(member[0]);
    }

    if (req.method === 'PUT') {
      if (!requireAuth(req, res)) return;
      
      const { name, role, photo_url, linkedin_url, github_url, email, display_order } = req.body;
      
      const updated = await sql`
        UPDATE members 
        SET name = ${name}, 
            role = ${role}, 
            photo_url = ${photo_url}, 
            linkedin_url = ${linkedin_url}, 
            github_url = ${github_url},
            email = ${email},
            display_order = ${display_order}
        WHERE id = ${id}
        RETURNING *
      `;
      
      if (updated.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(updated[0]);
    }

    if (req.method === 'DELETE') {
      if (!requireAuth(req, res)) return;
      
      const deleted = await sql`DELETE FROM members WHERE id = ${id} RETURNING *`;
      if (deleted.length === 0) return res.status(404).json({ error: 'Not found' });
      
      return res.status(200).json({ success: true, deleted: deleted[0].id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

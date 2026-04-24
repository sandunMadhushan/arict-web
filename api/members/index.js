import { sql } from '../_db.js';
import { requireAuth } from '../_auth.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    if (req.method === 'GET') {
      const members = await sql`
        SELECT * FROM members 
        ORDER BY display_order ASC, name ASC
      `;
      return res.status(200).json(members);
    } 
    
    if (req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      
      const { name, role, photo_url, linkedin_url, github_url, email, display_order } = req.body;
      
      const newMember = await sql`
        INSERT INTO members (name, role, photo_url, linkedin_url, github_url, email, display_order)
        VALUES (${name}, ${role}, ${photo_url}, ${linkedin_url}, ${github_url}, ${email}, ${display_order})
        RETURNING *
      `;
      
      return res.status(201).json(newMember[0]);
    }

    if (req.method === 'PATCH') {
      if (!requireAuth(req, res)) return;
      
      const { updates } = req.body;
      if (Array.isArray(updates)) {
        for (const update of updates) {
          await sql`UPDATE members SET display_order = ${update.display_order} WHERE id = ${update.id}`;
        }
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

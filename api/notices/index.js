import { sql } from '../_db.js';
import { requireAuth, checkAuth } from '../_auth.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    const isAuthed = checkAuth(req);
    
    if (req.method === 'GET') {
      let notices;
      
      // Public only sees active, unexpired notices
      if (isAuthed) {
        notices = await sql`SELECT * FROM notices ORDER BY created_at DESC`;
      } else {
        notices = await sql`
          SELECT * FROM notices 
          WHERE active = true 
            AND (expires_at IS NULL OR expires_at > NOW())
          ORDER BY created_at DESC
        `;
      }
      return res.status(200).json(notices);
    } 
    
    if (req.method === 'POST') {
      if (!isAuthed) return res.status(401).json({ error: 'Unauthorized' });
      
      const { title, message, type, expires_at, active } = req.body;
      
      const newNotice = await sql`
        INSERT INTO notices (title, message, type, expires_at, active)
        VALUES (${title}, ${message}, ${type || 'info'}, ${expires_at || null}, ${active !== undefined ? active : true})
        RETURNING *
      `;
      
      return res.status(201).json(newNotice[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

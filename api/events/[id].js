import { sql } from '../_db.js';
import { requireAuth } from '../_auth.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    if (req.method === 'GET') {
      const event = await sql`SELECT * FROM events WHERE id = ${id}`;
      if (event.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(event[0]);
    }

    if (req.method === 'PUT') {
      if (!requireAuth(req, res)) return;
      
      const { title, description, event_date, location, image_url, registration_link, capacity } = req.body;
      
      const updated = await sql`
        UPDATE events 
        SET title = ${title}, 
            description = ${description}, 
            event_date = ${event_date}::timestamp, 
            location = ${location}, 
            image_url = ${image_url}, 
            registration_link = ${registration_link}, 
            capacity = ${capacity},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      
      if (updated.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(updated[0]);
    }

    if (req.method === 'DELETE') {
      if (!requireAuth(req, res)) return;
      
      const deleted = await sql`DELETE FROM events WHERE id = ${id} RETURNING *`;
      if (deleted.length === 0) return res.status(404).json({ error: 'Not found' });
      
      return res.status(200).json({ success: true, deleted: deleted[0].id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

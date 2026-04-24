import { sql } from '../_db.js';
import { requireAuth } from '../_auth.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    if (req.method === 'GET') {
      const events = await sql`
        SELECT * FROM events 
        ORDER BY event_date ASC
      `;
      return res.status(200).json(events);
    } 
    
    if (req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      
      const { title, description, event_date, location, image_url, registration_link, capacity } = req.body;
      
      const newEvent = await sql`
        INSERT INTO events (title, description, event_date, location, image_url, registration_link, capacity)
        VALUES (${title}, ${description}, ${event_date}, ${location}, ${image_url}, ${registration_link}, ${capacity})
        RETURNING *
      `;
      
      return res.status(201).json(newEvent[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

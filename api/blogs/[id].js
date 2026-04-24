import { sql } from '../_db.js';
import { requireAuth } from '../_auth.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const blog = await sql`SELECT * FROM blogs WHERE id = ${id} OR slug = ${id}`;
      if (blog.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(blog[0]);
    }

    if (req.method === 'PUT') {
      if (!requireAuth(req, res)) return;
      
      const { title, slug, content, excerpt, author, cover_image_url, tags, reading_time, published } = req.body;
      
      // We need to fetch the existing blog to see if it's already published
      const existing = await sql`SELECT published, published_at FROM blogs WHERE id = ${id}`;
      if (existing.length === 0) return res.status(404).json({ error: 'Not found' });
      
      let new_published_at = existing[0].published_at;
      if (published && !existing[0].published) {
        new_published_at = new Date().toISOString();
      } else if (!published) {
         // Keep old published_at or clear it? Usually we keep it so if they republish the original date is preserved, or clear it. Let's keep it.
      }
      
      const updated = await sql`
        UPDATE blogs 
        SET title = ${title}, 
            slug = ${slug}, 
            content = ${content}, 
            excerpt = ${excerpt}, 
            author = ${author}, 
            cover_image_url = ${cover_image_url}, 
            tags = ${tags || []},
            reading_time = ${reading_time},
            published = ${published},
            published_at = ${new_published_at},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      
      return res.status(200).json(updated[0]);
    }

    if (req.method === 'DELETE') {
      if (!requireAuth(req, res)) return;
      
      const deleted = await sql`DELETE FROM blogs WHERE id = ${id} RETURNING *`;
      if (deleted.length === 0) return res.status(404).json({ error: 'Not found' });
      
      return res.status(200).json({ success: true, deleted: deleted[0].id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

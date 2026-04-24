import { sql } from '../_db.js';
import { requireAuth, checkAuth } from '../_auth.js';

export default async function handler(req, res) {
  try {
    const isAuthed = checkAuth(req);
    
    if (req.method === 'GET') {
      let blogs;
      // Admins see all blogs. Public only sees published blogs.
      if (isAuthed) {
        blogs = await sql`SELECT * FROM blogs ORDER BY created_at DESC`;
      } else {
        blogs = await sql`SELECT * FROM blogs WHERE published = true ORDER BY published_at DESC NULLS LAST, created_at DESC`;
      }
      return res.status(200).json(blogs);
    } 
    
    if (req.method === 'POST') {
      if (!isAuthed) return res.status(401).json({ error: 'Unauthorized' });
      
      const { title, slug, content, excerpt, author, cover_image_url, tags, reading_time, published } = req.body;
      
      // Calculate published_at if publishing for the first time
      const published_at = published ? new Date().toISOString() : null;
      
      const newBlog = await sql`
        INSERT INTO blogs (title, slug, content, excerpt, author, cover_image_url, tags, reading_time, published, published_at)
        VALUES (${title}, ${slug}, ${content}, ${excerpt}, ${author}, ${cover_image_url}, ${tags || []}, ${reading_time}, ${published || false}, ${published_at})
        RETURNING *
      `;
      
      return res.status(201).json(newBlog[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

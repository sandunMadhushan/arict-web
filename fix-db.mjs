import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
if (!dbUrlMatch) throw new Error("Could not find DATABASE_URL in .env.local");
process.env.DATABASE_URL = dbUrlMatch[1].trim();

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  try {
    console.log("Creating tables...");
    
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date TIMESTAMP,
        location VARCHAR(255),
        image_url TEXT,
        registration_link TEXT,
        capacity INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS members (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        department VARCHAR(255),
        year INTEGER,
        photo_url TEXT,
        linkedin_url TEXT,
        twitter_url TEXT,
        github_url TEXT,
        instagram_url TEXT,
        email VARCHAR(255),
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS blogs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        content TEXT,
        excerpt TEXT,
        author VARCHAR(255),
        cover_image_url TEXT,
        tags TEXT[],
        reading_time INTEGER,
        published BOOLEAN DEFAULT false,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS notices (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        type VARCHAR(20) DEFAULT 'info',
        expires_at TIMESTAMP,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log("Success! All database tables created successfully.");
  } catch (err) {
    console.error("Error setting up database:", err);
  }
}

setupDatabase();

-- Admin Dashboard Database Schema

CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP,
  location VARCHAR(255),
  image_url TEXT,                        -- converted Google Drive embed URL
  registration_link TEXT,
  capacity INTEGER,                      -- max attendees (NULL = unlimited)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  photo_url TEXT,                        -- Google Drive embed URL
  linkedin_url TEXT,
  github_url TEXT,
  email TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  content TEXT,                          -- TipTap HTML output
  excerpt TEXT,
  author VARCHAR(255),
  cover_image_url TEXT,                  -- Google Drive embed URL
  tags TEXT[],
  reading_time INTEGER,                  -- minutes, auto-calculated on save
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(20) DEFAULT 'info',  -- info | warning | urgent
  expires_at TIMESTAMP,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

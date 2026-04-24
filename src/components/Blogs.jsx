import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { apiFetch } from '../utils/api';
import './Blogs.css';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    apiFetch('/blogs')
      .then(data => setBlogs(data || []))
      .catch(err => console.error("Failed to load blogs:", err));
  }, []);

  return (
    <section className="blogs bg-black section-padding">
      <div className="container">
        <div className="blogs-grid">
          {blogs.length === 0 && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', width: '100%' }}>No published blogs yet.</p>}
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <div className="blog-img-wrapper">
                <img src={blog.cover_image_url || 'https://via.placeholder.com/600'} alt={blog.title} />
                <div className="blog-tag">{blog.tags?.[0] || 'Updates'}</div>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString()}</span>
                </div>
                <h3><a href={`/blogs/${blog.slug}`}>{blog.title}</a></h3>
                <a href={`/blogs/${blog.slug}`} className="read-more">Read More <ArrowUpRight size={16} /></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;

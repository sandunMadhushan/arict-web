import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, Calendar, Tag, ChevronRight } from 'lucide-react';
import { apiFetch } from '../utils/api';
import './Blogs.css';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    apiFetch('/blogs')
      .then(data => {
        if (data && data.length > 0) {
          setBlogs(data);
          setSelectedBlog(data[0]); // Default to first blog
        }
      })
      .catch(err => console.error("Failed to load blogs:", err));
  }, []);

  const handleSelectBlog = (blog) => {
    if (selectedBlog?.id === blog.id) return;
    
    // Trigger transition animation
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedBlog(blog);
      setIsTransitioning(false);
    }, 300); // 300ms matches the CSS transition duration
  };

  if (blogs.length === 0) {
    return (
      <section className="blogs bg-black section-padding">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '60px' }}>
            <p className="section-tag">Insights & Stories</p>
            <h2>Latest <span style={{ color: 'var(--color-primary)' }}>Blogs</span></h2>
          </div>
          <div className="empty-state">
            <p>No published blogs yet. Stay tuned!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blogs bg-black section-padding">
      <div className="container">

        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '60px' }}>
          <p className="section-tag">Insights & Stories</p>
          <h2>Our <span style={{ color: 'var(--color-primary)' }}>Blogs</span></h2>
        </div>

        <div className="blogs-split-layout">
          
          {/* LEFT: Master View (Selected Blog) */}
          <div className="blog-master-view">
            <div className={`master-glass-card ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
              <div className="master-glass-blur"></div>
              <div className="master-glass-top-line"></div>
              
              <div className="master-img-wrapper">
                <img 
                  src={selectedBlog?.cover_image_url || 'https://via.placeholder.com/800x500'} 
                  alt={selectedBlog?.title} 
                />
                <div className="master-tag">
                  <Tag size={14} />
                  {selectedBlog?.tags?.[0] || 'Updates'}
                </div>
              </div>

              <div className="master-content">
                <div className="master-meta">
                  <Calendar size={16} />
                  <span>{new Date(selectedBlog?.published_at || selectedBlog?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h3 className="master-title">{selectedBlog?.title}</h3>
                
                {/* Fallback excerpt if we don't have a specific field. 
                    Assuming 'content' might have HTML, we just render a brief text version or rely on a summary field */}
                <p className="master-excerpt">
                  {selectedBlog?.summary || 
                   (selectedBlog?.content ? selectedBlog.content.replace(/<[^>]*>?/gm, '').substring(0, 200) + '...' : 'Explore this insightful article from our team.')}
                </p>

                <a href={`/blogs/${selectedBlog?.slug}`} className="btn btn-primary read-master-btn">
                  Read Full Article <ArrowRight size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: List View (Scrollable remaining blogs) */}
          <div className="blog-list-view" ref={listRef}>
            <div className="blog-list-header">
              <h4>Recent Posts</h4>
              <div className="header-line"></div>
            </div>

            <div className="blog-list-items">
              {blogs.map((blog) => {
                const isSelected = selectedBlog?.id === blog.id;
                
                return (
                  <div 
                    key={blog.id} 
                    className={`list-glass-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectBlog(blog)}
                  >
                    <div className="list-img-wrapper">
                      <img src={blog.cover_image_url || 'https://via.placeholder.com/150'} alt={blog.title} />
                    </div>
                    <div className="list-content">
                      <span className="list-date">
                        {new Date(blog.published_at || blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <h4 className="list-title">{blog.title}</h4>
                      <span className="list-read-more">
                        {isSelected ? 'Currently Viewing' : 'Read Article'} 
                        {isSelected ? <ChevronRight size={14} /> : <ArrowUpRight size={14} />}
                      </span>
                    </div>
                    
                    {/* Active Indicator Line */}
                    {isSelected && <div className="list-active-indicator"></div>}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Blogs;

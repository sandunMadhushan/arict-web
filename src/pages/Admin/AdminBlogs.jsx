import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { getDriveEmbedUrl } from '../../utils/gdrive';
import { Plus, Edit, Trash2, X, Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, List, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

// TipTap Imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TipTapImage from '@tiptap/extension-image';
import TipTapLink from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import TipTapUnderline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { toast } from 'sonner';

const MenuBar = ({ editor }) => {
  const [inputMode, setInputMode] = React.useState(null); // 'link' | 'image' | null
  const [inputValue, setInputValue] = React.useState('');

  if (!editor) return null;

  const confirmLink = () => {
    const url = inputValue.trim();
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
      toast.success('Link inserted');
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setInputMode(null);
    setInputValue('');
  };

  const confirmImage = () => {
    const url = inputValue.trim();
    if (url) {
      const embedUrl = getDriveEmbedUrl(url) || url;
      editor.chain().focus().setImage({ src: embedUrl }).run();
      toast.success('Image inserted');
    }
    setInputMode(null);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); inputMode === 'link' ? confirmLink() : confirmImage(); }
    if (e.key === 'Escape') { setInputMode(null); setInputValue(''); }
  };

  const inlineInputStyle = {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '4px 8px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
    flexGrow: 1
  };
  const inlineInput = {
    background: 'transparent', border: 'none', outline: 'none',
    color: '#fff', fontSize: '0.85rem', flexGrow: 1, minWidth: 0
  };
  const confirmBtn = {
    background: 'var(--color-primary)', border: 'none', borderRadius: '6px',
    color: '#fff', padding: '3px 10px', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap'
  };
  const cancelBtn = {
    background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '6px',
    color: 'rgba(255,255,255,0.6)', padding: '3px 8px', fontSize: '0.8rem', cursor: 'pointer'
  };

  return (
    <div className="tiptap-toolbar" style={{ flexWrap: 'wrap', gap: '4px' }}>
      {inputMode ? (
        <div style={inlineInputStyle}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
            {inputMode === 'link' ? '🔗 URL:' : '🖼 Image URL:'}
          </span>
          <input
            autoFocus
            type="url"
            placeholder={inputMode === 'link' ? 'https://example.com' : 'https://drive.google.com/...'}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={inlineInput}
          />
          <button type="button" style={confirmBtn} onClick={inputMode === 'link' ? confirmLink : confirmImage}>Insert</button>
          <button type="button" style={cancelBtn} onClick={() => { setInputMode(null); setInputValue(''); }}>✕</button>
        </div>
      ) : (
        <>
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`} title="Bold"><Bold size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`} title="Italic"><Italic size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`toolbar-btn ${editor.isActive('underline') ? 'is-active' : ''}`} title="Underline"><Underline size={16} /></button>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></div>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`toolbar-btn ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`} title="Heading 1"><Heading1 size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`} title="Heading 2"><Heading2 size={16} /></button>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></div>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`} title="Align Left"><AlignLeft size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`} title="Align Center"><AlignCenter size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`} title="Align Right"><AlignRight size={16} /></button>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></div>
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`toolbar-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`} title="Bullet List"><List size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`toolbar-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`} title="Ordered List"><ListOrdered size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`toolbar-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`} title="Blockquote"><Quote size={16} /></button>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></div>
          <button type="button" onClick={() => { setInputMode('link'); setInputValue(''); }} className={`toolbar-btn ${editor.isActive('link') ? 'is-active' : ''}`} title="Add Link"><LinkIcon size={16} /></button>
          <button type="button" onClick={() => { setInputMode('image'); setInputValue(''); }} className="toolbar-btn" title="Add Image"><ImageIcon size={16} /></button>
        </>
      )}
    </div>
  );
};

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [rawImageUrl, setRawImageUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', author: '', 
    cover_image_url: '', tags: '', published: false
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      TipTapImage,
      TipTapLink.configure({ openOnClick: false }),
      TipTapUnderline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write your blog post here...' }),
      CharacterCount.configure({ limit: null })
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap-content'
      }
    }
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await apiFetch('/blogs');
      setBlogs(data);
    } catch (error) {
      toast.error('Failed to fetch blogs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setCurrentBlog(blog);
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        author: blog.author || '',
        cover_image_url: blog.cover_image_url || '',
        tags: blog.tags ? blog.tags.join(', ') : '',
        published: blog.published || false
      });
      setRawImageUrl(blog.cover_image_url || '');
      if (editor) {
        editor.commands.setContent(blog.content || '');
      }
    } else {
      setCurrentBlog(null);
      setFormData({
        title: '', slug: '', excerpt: '', author: '', 
        cover_image_url: '', tags: '', published: false
      });
      setRawImageUrl('');
      if (editor) {
        editor.commands.setContent('');
      }
    }
    setIsModalOpen(true);
  };

  const handleImageUrlChange = (e) => {
    const val = e.target.value;
    setRawImageUrl(val);
    const embedUrl = getDriveEmbedUrl(val);
    if (embedUrl) {
      setFormData({ ...formData, cover_image_url: embedUrl });
    } else {
      setFormData({ ...formData, cover_image_url: val });
    }
  };

  // Auto generate slug from title if slug is empty
  const handleTitleChange = (e) => {
    const title = e.target.value;
    if (!currentBlog && !formData.slug) {
      const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData({ ...formData, title, slug: autoSlug });
    } else {
      setFormData({ ...formData, title });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const htmlContent = editor.getHTML();
      // Calculate reading time based on 200 words per minute
      const wordCount = editor.storage.characterCount.words();
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      const payload = {
        ...formData,
        content: htmlContent,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        reading_time: readingTime
      };

      if (currentBlog) {
        await apiFetch(`/blogs/${currentBlog.id}`, {
          method: 'PUT',
          body: payload
        });
      } else {
        await apiFetch('/blogs', {
          method: 'POST',
          body: payload
        });
      }
      setIsModalOpen(false);
      toast.success(`Blog post ${currentBlog ? 'updated' : 'created'} successfully`);
      fetchBlogs();
    } catch (error) {
      toast.error('Error saving blog: ' + error.message);
    }
  };

  const handleDelete = (id) => {
    toast('Are you sure you want to delete this blog post?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await apiFetch(`/blogs/${id}`, { method: 'DELETE' });
            toast.success('Blog post deleted successfully');
            fetchBlogs();
          } catch (error) {
            toast.error('Failed to delete blog: ' + error.message);
          }
        }
      },
      cancel: { label: 'Cancel' }
    });
  };

  const togglePublishStatus = async (blog) => {
    try {
      await apiFetch(`/blogs/${blog.id}`, {
        method: 'PUT',
        body: {
          ...blog,
          published: !blog.published
        }
      });
      toast.success(`Blog post ${blog.published ? 'unpublished' : 'published'} successfully`);
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to toggle publish status: ' + error.message);
    }
  };

  if (loading) return <div>Loading blogs...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h2>Manage Blog Posts</h2>
        <button className="admin-btn" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No blog posts found.</td></tr>
            ) : (
              blogs.map(blog => (
                <tr key={blog.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{blog.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>/{blog.slug}</div>
                  </td>
                  <td>{blog.author}</td>
                  <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                  <td>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={blog.published} 
                        onChange={() => togglePublishStatus(blog)}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ color: blog.published ? '#10b981' : 'var(--color-text-muted)' }}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </label>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="action-btn edit" onClick={() => handleOpenModal(blog)} title="Edit"><Edit size={18} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(blog.id)} title="Delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="admin-modal" style={{ maxWidth: '800px' }} data-lenis-prevent="true">
            <div className="admin-modal-header">
              <h2>{currentBlog ? 'Edit Blog Post' : 'Write New Blog Post'}</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Title *</label>
                    <input required type="text" value={formData.title} onChange={handleTitleChange} />
                  </div>
                  <div className="form-group">
                    <label>URL Slug *</label>
                    <input required type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Author Name *</label>
                    <input required type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Tags (Comma separated)</label>
                    <input type="text" placeholder="e.g. Technology, UI/UX" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cover Image (Google Drive link)</label>
                  <input 
                    type="url" 
                    value={rawImageUrl} 
                    onChange={handleImageUrlChange} 
                    placeholder="https://drive.google.com/file/d/..."
                  />
                  {formData.cover_image_url && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={formData.cover_image_url} alt="Cover Preview" style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Short Excerpt</label>
                  <textarea rows="2" value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} placeholder="A brief summary for the blog listing page..."></textarea>
                </div>

                <div className="form-group">
                  <label>Content *</label>
                  <div className="tiptap-editor-container">
                    <MenuBar editor={editor} />
                    <EditorContent editor={editor} />
                  </div>
                  {editor && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'right', marginTop: '5px' }}>
                      {editor.storage.characterCount.words()} words
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    id="publishedStatus"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <label htmlFor="publishedStatus" style={{ margin: 0, cursor: 'pointer' }}>Publish immediately</label>
                </div>

                <div className="admin-modal-actions">
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="admin-btn">{currentBlog ? 'Save Changes' : 'Create Post'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;

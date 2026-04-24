import React, { useState } from 'react';
import { ArrowRight, MapPin, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading('Sending your message...');
    try {
      // Simulate network delay — replace with real API call when ready
      await new Promise((res) => setTimeout(res, 1200));
      toast.success('Message sent! We will get back to you soon.', { id: toastId });
      setForm({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message. Please try again.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact bg-black section-padding">
      <div className="container">
        <div className="contact-grid">
          
          <div className="contact-form-section">

            <div className="section-header">
              <h2>Join Us In Creating <br/>Remarkable Impact</h2>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input type="text" name="firstName" placeholder="First Name *" required value={form.firstName} onChange={handleChange} />
                <input type="text" name="lastName" placeholder="Last Name *" required value={form.lastName} onChange={handleChange} />
              </div>
              <div className="form-row">
                <input type="email" name="email" placeholder="Email *" required value={form.email} onChange={handleChange} />
                <input type="tel" name="phone" placeholder="Phone Number *" required value={form.phone} onChange={handleChange} />
              </div>
              <input type="text" name="subject" placeholder="Subject *" required value={form.subject} onChange={handleChange} />
              <textarea name="message" placeholder="Message *" rows="4" required value={form.message} onChange={handleChange}></textarea>
              <button type="submit" className="btn btn-primary submit-btn" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'} <ArrowRight size={20} />
              </button>
            </form>
          </div>

          <div className="contact-info-section">
            <div className="info-card">
              <div className="info-item">
                <div className="icon-wrapper">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3>Address</h3>
                  <p>4517 Washington Ave. Manchester, Kentucky 39495</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon-wrapper">
                  <Mail size={24} />
                </div>
                <div>
                  <h3>Contact</h3>
                  <p>hello@arict.com<br/>+1 (555) 000-0000</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon-wrapper">
                  <Phone size={24} />
                </div>
                <div>
                  <h3>Open Hours</h3>
                  <p>Mon - Fri: 9:00 - 18:00<br/>Sat - Sun: Closed</p>
                </div>
              </div>

              <div className="social-links-box">
                <span>Stay Connected</span>
                <div className="social-icons">
                  <a href="#">Fb</a>
                  <a href="#">Tw</a>
                  <a href="#">In</a>
                  <a href="#">Be</a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;

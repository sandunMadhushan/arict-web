import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Heart, Hourglass } from 'lucide-react';
import { apiFetch } from '../utils/api';
import './Events.css';

// Live countdown hook — ticks every second
const useCountdown = (targetDate) => {
  const parseLocal = (str) => str ? new Date(str.replace(/Z$/, '')) : null;
  const calcTime = () => {
    const target = parseLocal(targetDate);
    const diff = target - new Date();
    if (!target || diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
    const totalSecs = Math.floor(diff / 1000);
    return {
      hours: Math.floor(totalSecs / 3600),
      minutes: Math.floor((totalSecs % 3600) / 60),
      seconds: totalSecs % 60,
      expired: false
    };
  };
  const [time, setTime] = useState(calcTime);
  useEffect(() => {
    if (!targetDate) return;
    const id = setInterval(() => setTime(calcTime()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
};

// Wrapper so each card gets its own interval
const CountdownBox = ({ eventDate }) => {
  const { hours, minutes, seconds, expired } = useCountdown(eventDate);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="countdown-box">
      <div className="cd-title">
        <span>Remaining times</span>
        <Hourglass size={14} className="hg-icon" />
      </div>
      {expired ? (
        <div className="cd-expired">Event Started</div>
      ) : (
        <div className="cd-timers">
          <div className="cd-item"><strong>{pad(hours)}</strong><span>Hours</span></div>
          <div className="cd-item"><strong>{pad(minutes)}</strong><span>Minutes</span></div>
          <div className="cd-item"><strong>{pad(seconds)}</strong><span>Seconds</span></div>
        </div>
      )}
    </div>
  );
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/events')
      .then(data => {
        setEvents(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load events:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>Loading events...</div>;
  }

  // Strip trailing 'Z' if present: Neon returns timestamp (no-tz) values with a 'Z'
  // suffix, causing new Date() to treat them as UTC and shift by the local offset.
  // Removing 'Z' makes JS parse it as local time — matching what was stored.
  const parseLocalDate = (str) => {
    if (!str) return null;
    return new Date(str.replace(/Z$/, ''));
  };

  const formatDate = (dateString) => {
    if (!dateString) return { day: '-', month: '-' };
    const d = parseLocalDate(dateString);
    return {
      day: d.toLocaleString('default', { day: '2-digit' }),
      month: d.toLocaleString('default', { month: 'short' }),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      monthYear: d.toLocaleString('default', { month: 'long', year: 'numeric' }).replace(' ', '\n')
    };
  };
  return (
    <>
      {/* SECTION 1: Standard Grid */}
      <section id="events-grid" className="events-standard section-padding bg-black">
        <div className="container">
          <div className="section-header-flex">
            <h2>Events Near By Your City</h2>
            <a href="#" className="view-all-link">View All Events ↗</a>
          </div>
          
          <div className="events-grid-4">
            {events.slice(0, 4).map(event => {
              const dateMeta = formatDate(event.event_date);
              return (
              <div key={event.id} className="std-event-card">
                <div className="std-event-img-wrap">
                  <img src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"} alt={event.title} />
                  <div className="date-badge">
                    <span className="db-day">{dateMeta.day}</span>
                    <span className="db-month">{dateMeta.month}</span>
                  </div>
                  <button className="heart-btn"><Heart size={16} /></button>
                </div>
                <div className="std-event-info">
                  <h3>{event.title}</h3>
                  <div className="std-event-meta">
                    <span><MapPin size={12} /> {event.location || '-'}</span>
                    <span><Clock size={12} /> {dateMeta.time}</span>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* SECTION 2: Featured Grid (Dark Theme) */}
      <section className="events-featured section-padding bg-black-light">
        <div className="container">
          <div className="events-featured-header">
            <h2>Events For You</h2>
            <div className="event-filters">
              <button className="filter-pill active">Today</button>
              <button className="filter-pill">Tomorrow</button>
              <button className="filter-pill">This weekend</button>
            </div>
          </div>

          <div className="events-grid-3">
            {events.slice(0, 3).map(event => (
              <div key={event.id} className="feat-event-card">
                <img src={event.image_url || "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80"} alt={event.title} className="feat-img" />
                <div className="feat-event-info">
                  <h3>{event.title}</h3>
                  <p>{event.description?.substring(0, 80) || ''}...</p>
                  <CountdownBox eventDate={event.event_date} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Standard Grid (Bottom) */}
      <section className="events-standard section-padding bg-black">
        <div className="container">
          <div className="section-header-flex">
            <h2>More Events</h2>
            <a href="#" className="view-all-link">View All Events ↗</a>
          </div>
          
          <div className="events-grid-4">
            {events.slice(4, 8).map(event => {
              const dateMeta = formatDate(event.event_date);
              return (
              <div key={event.id} className="std-event-card">
                <div className="std-event-img-wrap">
                  <img src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"} alt={event.title} />
                  <div className="date-badge">
                    <span className="db-day">{dateMeta.day}</span>
                    <span className="db-month">{dateMeta.month}</span>
                  </div>
                  <button className="heart-btn"><Heart size={16} /></button>
                </div>
                <div className="std-event-info">
                  <h3>{event.title}</h3>
                  <div className="std-event-meta">
                    <span><MapPin size={12} /> {event.location || '-'}</span>
                    <span><Clock size={12} /> {dateMeta.time}</span>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* SECTION 4: Upcoming Events (List View, Dark Theme) */}
      <section className="events-upcoming section-padding bg-black-light">
        <div className="container">
          <div className="section-header-flex">
            <h2>Upcoming Events</h2>
            <a href="#" className="view-all-link">View All Events ↗</a>
          </div>

          <div className="upcoming-list">
            {events.slice(0, 4).map(event => {
              const dateMeta = formatDate(event.event_date);
              return (
              <div key={event.id} className="upcoming-row">
                <div className="up-date">
                  <span className="up-day">{dateMeta.day}</span>
                  <span className="up-month" style={{ whiteSpace: 'pre-line' }}>{dateMeta.monthYear}</span>
                </div>
                
                <div className="up-info">
                  <h3>{event.title}</h3>
                  <div className="up-meta">
                    <span><MapPin size={14} /> {event.location || '-'}</span>
                    <span><Clock size={14} /> {dateMeta.time}</span>
                  </div>
                </div>
                
                <div className="up-action">
                  {event.registration_link ? (
                    <a href={event.registration_link} target="_blank" rel="noreferrer">
                      <button className="buy-ticket-btn">Register</button>
                    </a>
                  ) : (
                    <button className="buy-ticket-btn">Register</button>
                  )}
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>
    </>
  );
};

export default Events;

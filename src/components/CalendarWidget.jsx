import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import './CalendarWidget.css';

const CalendarWidget = () => {
  // Helper to format date object to YYYY-MM-DD
  const formatDateString = (year, month, day) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const today = new Date();
  const todayString = formatDateString(today.getFullYear(), today.getMonth(), today.getDate());

  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(today);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(todayString); // Auto-sync to today
  
  const navigate = useNavigate();
  const widgetRef = useRef(null);
  const btnRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        widgetRef.current && !widgetRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Fetch events when component mounts
    apiFetch('/events')
      .then(data => {
        setEvents(data || []);
      })
      .catch(err => console.error("Failed to load events for calendar:", err));
  }, []);

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Monday start (0 = Mo, 6 = Su)
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  // Helper moved to top

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    
    const days = [];
    
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push({
        day: daysInPrevMonth - firstDay + i + 1,
        isCurrentMonth: false,
        fullDateString: formatDateString(year, month - 1, daysInPrevMonth - firstDay + i + 1)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        fullDateString: formatDateString(year, month, i)
      });
    }
    
    // Next month days
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        fullDateString: formatDateString(year, month + 1, i)
      });
    }
    
    return days;
  };

  // Get events for the currently selected date
  const selectedEvents = selectedDate 
    ? events.filter(e => e.event_date && e.event_date.startsWith(selectedDate))
    : [];

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        ref={btnRef}
        className={`calendar-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Calendar"
      >
        {isOpen ? <X size={24} /> : <CalendarIcon size={24} />}
      </button>

      {/* Calendar Modal/Popup */}
      <div ref={widgetRef} className={`calendar-widget-wrapper ${isOpen ? 'open' : ''}`}>
        {/* Colorful Blobs to ensure the glassmorphism blur is visible */}
        <div className="calendar-blob calendar-blob-1"></div>
        <div className="calendar-blob calendar-blob-2"></div>
        
        <div className="calendar-glass-panel">
          
          <div className="calendar-header">
            <button onClick={handlePrevMonth} className="cal-nav-btn"><ChevronLeft size={18} /></button>
            <h3 className="cal-month-year">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
            <button onClick={handleNextMonth} className="cal-nav-btn"><ChevronRight size={18} /></button>
          </div>

          <div className="calendar-grid">
            {daysOfWeek.map(day => (
              <div key={day} className="cal-day-name">{day}</div>
            ))}
            
            {generateCalendarDays().map((dateObj, index) => {
              // Check if this date has any events
              const hasEvents = events.some(e => e.event_date && e.event_date.startsWith(dateObj.fullDateString));
              const isSelected = selectedDate === dateObj.fullDateString;
              const isToday = todayString === dateObj.fullDateString;

              return (
                <div 
                  key={index} 
                  className={`cal-date-wrapper ${dateObj.isCurrentMonth ? 'current-month' : 'other-month'}`}
                  onClick={() => setSelectedDate(dateObj.fullDateString)}
                >
                  <div className={`cal-date-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}>
                    {dateObj.day}
                  </div>
                  {hasEvents && <div className="cal-event-dot"></div>}
                </div>
              );
            })}
          </div>

          {/* Selected Events List */}
          {selectedDate && (
            <div className="cal-events-list">
              <h4 className="cal-events-title">
                Events on {new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </h4>
              
              {selectedEvents.length > 0 ? (
                <div className="cal-events-scroll">
                  {selectedEvents.map(event => (
                    <div 
                      key={event.id} 
                      className="cal-event-item"
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/events');
                      }}
                    >
                      <div className="cal-event-item-title">{event.title}</div>
                      <div className="cal-event-item-meta">
                        <span className="cal-meta-item"><Clock size={12} /> {new Date(event.event_date.replace(/Z$/, '')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="cal-no-events">No events scheduled for this day.</div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default CalendarWidget;

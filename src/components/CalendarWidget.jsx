import React, { useState } from 'react';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarWidget.css';

const CalendarWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Monday start (0 = Mo, 6 = Su)
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

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
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true
      });
    }
    
    // Next month days to fill 6 rows (42 cells)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        className={`calendar-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Calendar"
      >
        {isOpen ? <X size={24} /> : <CalendarIcon size={24} />}
      </button>

      {/* Calendar Modal/Popup */}
      <div className={`calendar-widget-wrapper ${isOpen ? 'open' : ''}`}>
        <div className="calendar-glass-panel">
          
          <div className="calendar-header">
            <button onClick={handlePrevMonth} className="cal-nav-btn"><ChevronLeft size={18} /></button>
            <h3 className="cal-month-year">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
            <button onClick={handleNextMonth} className="cal-nav-btn"><ChevronRight size={18} /></button>
          </div>

          <div className="calendar-grid">
            {/* Days of Week */}
            {daysOfWeek.map(day => (
              <div key={day} className="cal-day-name">{day}</div>
            ))}
            
            {/* Dates */}
            {generateCalendarDays().map((dateObj, index) => (
              <div 
                key={index} 
                className={`cal-date-cell ${dateObj.isCurrentMonth ? 'current-month' : 'other-month'}`}
              >
                {dateObj.day}
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default CalendarWidget;

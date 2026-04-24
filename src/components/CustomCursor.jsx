import React, { useEffect, useState } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      // Check if hovering over clickable elements
      const isClickable = 
        e.target.tagName.toLowerCase() === 'a' || 
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.classList.contains('g-slide') ||
        window.getComputedStyle(e.target).cursor === 'pointer';
        
      setIsHovering(isClickable);
    };

    const handleMouseOut = (e) => {
      if (e.relatedTarget === null) {
        setIsVisible(false);
      }
    };

    const handleBlur = () => setIsVisible(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <div 
      className={`custom-cursor-container ${isHovering ? 'hovering' : ''} ${!isVisible ? 'hidden' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div className="cursor-glass-image"></div>
    </div>
  );
};

export default CustomCursor;

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './MeetTeam.css';

const team = [
  {
    id: 1,
    name: "Kavindu Perera",
    role: "President, Arict",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Senuri Bandara",
    role: "Vice President, Arict",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Tharindu Silva",
    role: "Secretary, Arict",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Dilini Fernando",
    role: "Treasurer, Arict",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Isuru Madusanka",
    role: "Former President, Arict",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Amali Wijesinghe",
    role: "Former Vice President, Arict",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  },
];

const MeetTeam = () => {
  const [active, setActive] = useState(2);

  const prev = () => setActive(i => Math.max(0, i - 1));
  const next = () => setActive(i => Math.min(team.length - 1, i + 1));

  return (
    <section className="meet-team section-padding bg-black">
      <div className="container">

        {/* Header row */}
        <div className="meet-team-header">
          <div className="meet-team-text">
            <h2 className="meet-team-title">Meet Our Team</h2>
            <p className="meet-team-sub">
              The passionate minds behind Arict — driving innovation,
              creativity, and impact across every project we take on.
            </p>
          </div>
          <div className="meet-team-arrows">
            <button
              className="mt-arrow"
              onClick={prev}
              disabled={active === 0}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="mt-arrow"
              onClick={next}
              disabled={active === team.length - 1}
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Accordion card strip */}
        <div className="mt-strip">
          {team.map((member, idx) => {
            const isActive = idx === active;
            return (
              <div
                key={member.id}
                className={`mt-card ${isActive ? 'active' : ''}`}
                onMouseEnter={() => setActive(idx)}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="mt-card-img"
                />
                {/* Gradient overlay only on active */}
                {isActive && <div className="mt-card-overlay" />}

                {/* Info — visible only on active */}
                <div className={`mt-card-info ${isActive ? 'visible' : ''}`}>
                  <span className="mt-card-role">{member.role}</span>
                  <h3 className="mt-card-name">{member.name}</h3>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default MeetTeam;

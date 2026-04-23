import React, { useRef } from 'react';
import { BadgeCheck, Users, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import './Committee.css';

const currentCommittee = [
  {
    id: 1,
    name: "Kavindu Perera",
    role: "President",
    desc: "Leading Arict with vision and innovation.",
    year: "2024/25",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Senuri Bandara",
    role: "Vice President",
    desc: "Driving strategy and partnerships forward.",
    year: "2024/25",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Tharindu Silva",
    role: "Secretary",
    desc: "Coordinating operations and communications.",
    year: "2024/25",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Dilini Fernando",
    role: "Treasurer",
    desc: "Managing finances and resource allocation.",
    year: "2024/25",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80"
  },
];

const formerCommittee = [
  {
    id: 1,
    name: "Isuru Madusanka",
    role: "President",
    desc: "Pioneered the foundation of Arict.",
    year: "2023/24",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Amali Wijesinghe",
    role: "Vice President",
    desc: "Built strategic partnerships from the ground up.",
    year: "2023/24",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Ravindu Jayawardena",
    role: "Secretary",
    desc: "Established core operational workflows.",
    year: "2023/24",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Sachini Kumari",
    role: "Treasurer",
    desc: "Managed inaugural budgets and resources.",
    year: "2023/24",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    name: "Kaveesha Rathnayake",
    role: "Events Director",
    desc: "Organized landmark events for the association.",
    year: "2023/24",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 6,
    name: "Dulitha Samarawickrama",
    role: "Media Director",
    desc: "Shaped the visual identity of Arict.",
    year: "2023/24",
    img: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80"
  },
];

const MemberCard = ({ member }) => (
  <div className="member-card">
    <div className="member-photo-wrap">
      <img src={member.img} alt={member.name} className="member-photo" />
    </div>
    <div className="member-info-panel">
      <div
        className="member-info-bg"
        style={{ backgroundImage: `url(${member.img})` }}
      />
      <div className="member-info-content">
        <div>
          <div className="member-name-row">
            <h3 className="member-name">{member.name}</h3>
            <BadgeCheck size={16} className="verified-icon" />
          </div>
          <p className="member-desc">{member.desc}</p>
        </div>
        <div className="member-footer">
          <div className="member-stats">
            <span className="member-stat"><Users size={13} /> {member.year}</span>
            <span className="member-stat"><Calendar size={13} /> {member.role}</span>
          </div>
          <button className="follow-btn">View +</button>
        </div>
      </div>
    </div>
  </div>
);

const Committee = () => {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <section className="committee section-padding bg-black">
      <div className="container">

        {/* Current Committee */}
        <div className="committee-block">
          <div className="committee-label">
            <span className="pill-tag">Current Committee</span>
          </div>
          <div className="current-grid">
            {currentCommittee.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </div>

        {/* Former Committee */}
        <div className="committee-block">
          <div className="committee-label former-label">
            <span className="pill-tag">Former Committee</span>
            <div className="scroll-arrows">
              <button className="arrow-btn" onClick={() => scroll(-1)} aria-label="Previous">
                <ChevronLeft size={20} />
              </button>
              <button className="arrow-btn" onClick={() => scroll(1)} aria-label="Next">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="former-scroll" ref={scrollRef}>
            {formerCommittee.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Committee;

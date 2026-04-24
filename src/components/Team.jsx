import React, { useRef, useEffect } from 'react';
import { Mail } from 'lucide-react';
import './Team.css';

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const members = [
  { id: 1,  name: "Ashan Perera",          role: "Full Stack Developer",    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&h=600&q=80", github: "https://github.com/", linkedin: "https://linkedin.com/in/", email: "ashan@arict.lk" },
  { id: 2,  name: "Nimasha Fernando",      role: "UI/UX Designer",          img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&h=600&q=80", github: "https://github.com/", linkedin: "https://linkedin.com/in/", email: "nimasha@arict.lk" },
  { id: 3,  name: "Kasun Silva",           role: "Backend Engineer",        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&h=600&q=80", github: "https://github.com/", linkedin: "https://linkedin.com/in/", email: "kasun@arict.lk" },
  { id: 4,  name: "Tharushi Jayawardena",  role: "Data Analyst",            img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=500&h=600&q=80", github: "https://github.com/", linkedin: "https://linkedin.com/in/", email: "tharushi@arict.lk" },
  { id: 5,  name: "Nuwan Bandara",         role: "DevOps Engineer",         img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&h=600&q=80", github: "https://github.com/", linkedin: "https://linkedin.com/in/", email: "nuwan@arict.lk" },
  { id: 6,  name: "Sethuli Rathnayake",    role: "Mobile Developer",        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&h=600&q=80", github: "https://github.com/", linkedin: "https://linkedin.com/in/", email: "sethuli@arict.lk" },
  { id: 7,  name: "Dimuth Samarawickrama", role: "Cloud Architect",         img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&h=600&q=80", github: "https://github.com/", linkedin: "https://linkedin.com/in/", email: "dimuth@arict.lk" },
  { id: 8,  name: "Sanduni Kumari",        role: "QA Engineer",             img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&h=600&q=80", github: "https://github.com/", linkedin: "https://linkedin.com/in/", email: "sanduni@arict.lk" },
  { id: 9,  name: "Chanaka Gunawardena",   role: "Cybersecurity Analyst",   img: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=500&h=600&q=80", github: "https://github.com/", linkedin: "https://linkedin.com/in/", email: "chanaka@arict.lk" },
  { id: 10, name: "Piyumi Wickramasinghe", role: "AI/ML Engineer",          img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&h=600&q=80", github: "https://github.com/", linkedin: "https://linkedin.com/in/", email: "piyumi@arict.lk" },
  { id: 11, name: "Lahiru Prasad",         role: "Systems Analyst",         img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=500&h=600&q=80", github: "https://github.com/", linkedin: "https://linkedin.com/in/", email: "lahiru@arict.lk" },
  { id: 12, name: "Thilini Madushani",     role: "Network Engineer",        img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&h=600&q=80", github: "https://github.com/", linkedin: "https://linkedin.com/in/", email: "thilini@arict.lk" },
];

const Team = () => {
  const scrollRef = useRef(null);
  const isPaused  = useRef(false);
  const halfRef   = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    /* Cache the half-width once DOM has settled */
    const init = setTimeout(() => {
      halfRef.current = el.scrollWidth / 2;
    }, 200);

    const timer = setInterval(() => {
      if (isPaused.current) return;

      el.scrollLeft += 1;

      /* Seamless reset: reached the duplicate copy → jump back silently */
      if (halfRef.current && el.scrollLeft >= halfRef.current) {
        el.scrollLeft -= halfRef.current;
      }
    }, 20);

    return () => { clearInterval(timer); clearTimeout(init); };
  }, []);

  return (
    <section className="team-section section-padding bg-black">
      <div className="container">

        <div className="team-header">
          <div>
            <h2 className="team-title">Our Team</h2>
            <p className="team-sub">
              12 passionate individuals united by a love for technology and innovation.
            </p>
          </div>
        </div>

        {/* Horizontal scroll strip */}
        <div
          className="team-scroll"
          ref={scrollRef}
          onMouseEnter={() => { isPaused.current = true; }}
          onMouseLeave={() => { isPaused.current = false; }}
        >
          {/* Render twice for seamless infinite loop */}
          {[...members, ...members].map((member, idx) => (
            <div key={`${member.id}-${idx}`} className="team-card">
              {/* Photo */}
              <div className="team-card-photo">
                <img src={member.img} alt={member.name} className="team-card-img" />
              </div>

              {/* Info */}
              <div className="team-card-info">
                <div>
                  <h3 className="team-card-name">{member.name}</h3>
                  <p className="team-card-role">{member.role}</p>
                </div>
                <div className="team-socials">
                  <a href={member.github} target="_blank" rel="noopener noreferrer"
                    className="team-social-btn" title="GitHub">
                    <GitHubIcon />
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                    className="team-social-btn team-social-li" title="LinkedIn">
                    <LinkedInIcon />
                  </a>
                  <a href={`mailto:${member.email}`}
                    className="team-social-btn team-social-mail" title="Email">
                    <Mail size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Team;

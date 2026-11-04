import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiSmartphone, FiUser, FiUsers, FiAward } from "react-icons/fi";

const SLIDES = [
  { eyebrow: "New Season", title: "Technology, Beautifully Chosen", text: "Premium gadgets and accessories at up to 50% off.", to: "/home?category=electronics", icon: FiSmartphone, tone: "hero-a" },
  { eyebrow: "Menswear", title: "Dress Sharp, Every Day", text: "Modern essentials and statement pieces from just ₹299.", to: "/home?category=men's%20clothing", icon: FiUser, tone: "hero-b" },
  { eyebrow: "Womenswear", title: "Effortless Elegance", text: "Discover new arrivals curated for the season.", to: "/home?category=women's%20clothing", icon: FiUsers, tone: "hero-c" },
  { eyebrow: "Fine Jewellery", title: "Gifts That Shine Forever", text: "Timeless designs with flat 40% off this week.", to: "/home?category=jewelery", icon: FiAward, tone: "hero-d" },
];

function Carousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, [paused]);

  const go = (dir) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {SLIDES.map((s, i) => {
          const Icon = s.icon;
          return (
            <div className={`hero-slide ${s.tone}`} key={s.title} aria-hidden={i !== index}>
              <div className="hero-content">
                <span className="eyebrow light">{s.eyebrow}</span>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
                <div className="hero-actions">
                  <Link to={s.to} className="btn btn-orange" tabIndex={i === index ? 0 : -1}>Shop now</Link>
                  <Link to="/home" className="btn btn-outline" tabIndex={i === index ? 0 : -1}>View all</Link>
                </div>
              </div>
              <div className="hero-art" aria-hidden="true">
                <span className="hero-ring" />
                <Icon size={150} />
              </div>
            </div>
          );
        })}
      </div>
      <button className="hero-arrow left" onClick={() => go(-1)} aria-label="Previous slide"><FiChevronLeft size={22} /></button>
      <button className="hero-arrow right" onClick={() => go(1)} aria-label="Next slide"><FiChevronRight size={22} /></button>
      <div className="hero-dots">
        {SLIDES.map((s, i) => (
          <button key={s.title} className={i === index ? "active" : ""} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}

export default Carousel;

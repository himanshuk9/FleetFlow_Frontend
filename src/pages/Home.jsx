
import {
  CarFront,
  Users,
  Route,
  CalendarCheck,
  Wrench,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Menu,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import "./Home.css";

const features = [
  {
    icon: CarFront,
    title: "Vehicle Management",
    description:
      "Maintain vehicle records, track availability and organize your fleet.",
  },
  {
    icon: Users,
    title: "Driver Management",
    description:
      "Keep driver information organized and assign drivers to rides.",
  },
  {
    icon: Route,
    title: "Ride Management",
    description:
      "Create rides, manage routes and coordinate daily operations.",
  },
  {
    icon: CalendarCheck,
    title: "Booking Management",
    description:
      "View bookings and manage passenger reservations in one place.",
  },
  {
    icon: Wrench,
    title: "Maintenance Tracking",
    description:
      "Keep vehicle maintenance and service requirements organized.",
  },
  {
    icon: BarChart3,
    title: "Operations Overview",
    description:
      "Bring fleet and ride operations together for easier management.",
  },
];

const benefits = [
  "Centralized fleet operations",
  "Organized driver and vehicle records",
  "Simplified ride assignment",
  "Better visibility into daily operations",
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <header className="home-navbar">
        <a href="#home" className="home-brand">
          <span className="home-brand-icon">
            <CarFront size={25} />
          </span>
          <span>
            Fleet<span className="home-brand-accent">Flow</span>
          </span>
        </a>

        <nav className="home-nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <button
          className="home-login-btn"
          onClick={() => navigate("/Login")}
        >
          Login <ArrowRight size={17} />
        </button>
      </header>

      <main>
        <section className="home-hero" id="home">
          <div className="home-hero-copy">
            <span className="home-eyebrow">
              FLEET & RIDE OPERATIONS PLATFORM
            </span>

            <h1>
              Manage your fleet.
              <br />
              <span>Move forward.</span>
            </h1>

            <p>
              FleetFlow brings vehicle management, driver coordination,
              ride scheduling and bookings together in one organized
              platform.
            </p>

            <div className="home-hero-actions">
              <button
                className="home-primary-btn"
                onClick={() => navigate("/Login")}
              >
                Access FleetFlow <ArrowRight size={18} />
              </button>

              <a className="home-secondary-btn" href="#features">
                Explore Features
              </a>
            </div>

            <div className="home-trust-points">
              <span>
                <CheckCircle2 size={17} /> Centralized operations
              </span>
              <span>
                <CheckCircle2 size={17} /> Easy fleet coordination
              </span>
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="home-visual-glow" />

            <div className="home-visual-card">
              <div className="home-visual-top">
                <div>
                  <span className="home-visual-label">
                    FLEETFLOW WORKSPACE
                  </span>
                  <h3>Fleet Operations</h3>
                </div>
                <CarFront size={28} />
              </div>

              <div className="home-visual-main">
                <div className="home-visual-icon">
                  <Route size={34} />
                </div>
                <div>
                  <strong>Rides & Resources</strong>
                  <p>Manage your daily operations</p>
                </div>
              </div>

              <div className="home-visual-list">
                <div>
                  <CarFront size={19} />
                  <span>Vehicle management</span>
                  <CheckCircle2 size={17} />
                </div>
                <div>
                  <Users size={19} />
                  <span>Driver coordination</span>
                  <CheckCircle2 size={17} />
                </div>
                <div>
                  <CalendarCheck size={19} />
                  <span>Ride & booking management</span>
                  <CheckCircle2 size={17} />
                </div>
              </div>

              <div className="home-visual-footer">
                <ShieldCheck size={18} />
                <span>One workspace. Organized operations.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="home-features" id="features">
          <div className="home-section-heading">
            <span className="home-eyebrow">WHAT YOU CAN DO</span>
            <h2>Everything your fleet needs, in one place</h2>
            <p>
              Manage essential fleet and ride workflows through
              one connected workspace.
            </p>
          </div>

          <div className="home-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  className="home-feature-card"
                  key={feature.title}
                >
                  <div className="home-feature-icon">
                    <Icon size={24} />
                  </div>

                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="home-about" id="about">
          <div className="home-about-copy">
            <span className="home-eyebrow">WHY FLEETFLOW</span>
            <h2>Less scattered work. More organized operations.</h2>
            <p>
              FleetFlow is designed to help fleet teams manage
              operational information without switching between
              disconnected workflows.
            </p>

            <ul>
              {benefits.map((benefit) => (
                <li key={benefit}>
                  <CheckCircle2 size={19} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="home-about-panel">
            <div className="home-about-panel-icon">
              <Route size={32} />
            </div>
            <h3>One connected workflow</h3>
            <p>
              Vehicles <ArrowRight size={15} /> Drivers
              <ArrowRight size={15} /> Rides
              <ArrowRight size={15} /> Bookings
            </p>
            <span>
              A structured approach to everyday fleet operations.
            </span>
          </div>
        </section>

        <section className="home-cta" id="contact">
          <div>
            <span className="home-eyebrow">GET STARTED</span>
            <h2>Bring your fleet operations together.</h2>
            <p>
              Sign in to access your FleetFlow workspace.
            </p>
          </div>

          <button
            className="home-cta-btn"
            onClick={() => navigate("/Login")}
          >
            Open FleetFlow <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <footer className="home-footer">
        <a href="#home" className="home-brand">
          <span className="home-brand-icon">
            <CarFront size={22} />
          </span>
          <span>
            Fleet<span className="home-brand-accent">Flow</span>
          </span>
        </a>

        <p>Fleet & Ride Operations Platform</p>

        <span>© {new Date().getFullYear()} FleetFlow</span>
      </footer>
    </div>
  );
}

export default Home;

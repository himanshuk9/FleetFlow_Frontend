
import "./DriverDashboard.css";

function DriverDashboard() {
  const driver = {
    name: "Driver",
    status: "Available",
  };

  const stats = [
    {
      icon: "🚘",
      title: "Assigned Trips",
      value: "08",
      note: "Trips assigned to you",
      className: "blue",
    },
    {
      icon: "✓",
      title: "Completed Trips",
      value: "24",
      note: "Successfully completed",
      className: "green",
    },
    {
      icon: "₹",
      title: "Total Earnings",
      value: "₹12,500",
      note: "Demo earnings",
      className: "purple",
    },
  ];

  return (
    <div className="driver-dashboard">
      {/* Sidebar */}
      <aside className="driver-sidebar">
        <div className="driver-brand">
          <div className="driver-brand-logo">F</div>
          <span>FleetFlow</span>
        </div>

        <p className="driver-menu-label">WORKSPACE</p>

        <nav className="driver-nav">
          <a href="/driver-dashboard" className="driver-nav-link active">
            <span>▦</span>
            Dashboard
          </a>

          <a href="/driver-trips" className="driver-nav-link">
            <span>🚘</span>
            My Trips
          </a>

          <a href="/driver-profile" className="driver-nav-link">
            <span>👤</span>
            My Profile
          </a>
        </nav>

        <div className="driver-sidebar-bottom">
          <div className="driver-avatar">D</div>
          <div className="driver-user-info">
            <strong>{driver.name}</strong>
            <span>Driver Account</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="driver-main">
        <header className="driver-topbar">
          <div>
            <p className="driver-breadcrumb">Workspace / Dashboard</p>
            <h2>Driver Dashboard</h2>
          </div>

          <div className="driver-topbar-right">
            <span className="driver-online-dot"></span>
            <span>{driver.status}</span>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="driver-welcome">
          <div>
            <p className="driver-welcome-label">FLEETFLOW DRIVER PORTAL</p>
            <h1>Hello ji, {driver.name}! 👋</h1>
            <p>
              Welcome back! Check your trips and stay updated
              with your driving activities.
            </p>
          </div>

          <div className="driver-welcome-icon">🚗</div>
        </section>

        {/* Statistics */}
        <section className="driver-stats">
          {stats.map((stat) => (
            <div className="driver-stat-card" key={stat.title}>
              <div className={`driver-stat-icon ${stat.className}`}>
                {stat.icon}
              </div>

              <p>{stat.title}</p>
              <h2>{stat.value}</h2>
              <span>{stat.note}</span>
            </div>
          ))}
        </section>

        {/* Trips Section */}
        <section className="driver-trips-section">
          <div className="driver-section-heading">
            <div>
              <h2>My Trips</h2>
              <p>Keep track of your assigned trips.</p>
            </div>

            <a href="/driver-trips" className="driver-view-all">
              View all →
            </a>
          </div>

          <div className="driver-empty-state">
            <div className="driver-empty-icon">🗓️</div>
            <h3>Your trips will appear here</h3>
            <p>
              Once the admin assigns a trip to you, its details
              will be available in this section.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="driver-footer">
          <span>© 2026 FleetFlow</span>
          <span>Drive safe. Stay organized.</span>
        </footer>
      </main>
    </div>
  );
}

export default DriverDashboard;

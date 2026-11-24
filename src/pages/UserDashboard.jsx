
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowRides from "./ShowRides";
import MyBookings from "./MyBookings";
import "./UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProfile, setShowProfile] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const openRides = () => {
    setShowProfile(false);
    setActiveTab("rides");
  };

  const openBookings = () => {
    setShowProfile(false);
    setActiveTab("bookings");
  };

  const openDashboard = () => {
    setShowProfile(false);
    setActiveTab("dashboard");
  };

  return (
    <div className="user-dashboard">
      {/* Navbar */}
      <nav className="user-navbar">
        <div className="user-brand">
          Fleet<span>Flow</span>
        </div>

        <div className="user-nav-links">
          <button
            className={activeTab === "dashboard" ? "nav-active" : ""}
            onClick={openDashboard}
          >
            Dashboard
          </button>

          <button
            className={activeTab === "rides" ? "nav-active" : ""}
            onClick={openRides}
          >
            Available Rides
          </button>

          <button
            className={activeTab === "bookings" ? "nav-active" : ""}
            onClick={openBookings}
          >
            My Bookings
          </button>

          <button
            onClick={() => setShowProfile(true)}
          >
            My Profile
          </button>

          <button
            className="user-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="user-main-content">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <section className="user-welcome">
            <p className="user-eyebrow">USER DASHBOARD</p>

            <h1>
              Welcome, {user.name || "User"}!
            </h1>

            <p>
              Manage your profile, explore available rides,
              and track your bookings.
            </p>

            <div className="user-dashboard-actions">
              <button
                className="explore-rides-btn"
                onClick={openRides}
              >
                Explore Rides
              </button>

              <button
                className="explore-rides-btn"
                onClick={openBookings}
              >
                My Bookings
              </button>
            </div>
          </section>
        )}

        {/* Available Rides */}
        {activeTab === "rides" && (
          <section className="user-rides-section">
            <div className="rides-heading">
              <div>
                <p className="user-eyebrow">YOUR NEXT JOURNEY</p>
                <h1>Available Rides</h1>
                <p>Explore rides published by the admin.</p>
              </div>

              <button
                className="back-dashboard-btn"
                onClick={openDashboard}
              >
                Back to Dashboard
              </button>
            </div>

            <ShowRides />
          </section>
        )}

        {/* My Bookings */}
        {activeTab === "bookings" && (
          <section className="user-rides-section">
            <div className="rides-heading">
              <div>
                <p className="user-eyebrow">YOUR JOURNEYS</p>
                <h1>My Bookings</h1>
                <p>
                  View the rides you have booked with FleetFlow.
                </p>
              </div>

              <button
                className="back-dashboard-btn"
                onClick={openDashboard}
              >
                Back to Dashboard
              </button>
            </div>

            <MyBookings />
          </section>
        )}
      </main>

      {/* My Profile Popup */}
      {showProfile && (
        <div
          className="profile-overlay"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="profile-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="profile-popup-header">
              <div>
                <p className="user-eyebrow">ACCOUNT DETAILS</p>
                <h2>My Profile</h2>
              </div>

              <button
                className="profile-close-btn"
                onClick={() => setShowProfile(false)}
                aria-label="Close profile"
              >
                &times;
              </button>
            </div>

            <div className="profile-avatar">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>

            <h3 className="profile-display-name">
              {user.name || "User"}
            </h3>

            <p className="profile-display-email">
              {user.email || "Email not available"}
            </p>

            <div className="profile-details">
              <div className="profile-detail-row">
                <span>User ID</span>
                <strong>{user.id ?? "N/A"}</strong>
              </div>

              <div className="profile-detail-row">
                <span>Full Name</span>
                <strong>{user.name || "N/A"}</strong>
              </div>

              <div className="profile-detail-row">
                <span>Email</span>
                <strong>{user.email || "N/A"}</strong>
              </div>

              <div className="profile-detail-row">
                <span>Role</span>
                <strong>{user.role || "User"}</strong>
              </div>
            </div>

            <button
              className="profile-done-btn"
              onClick={() => setShowProfile(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;


import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

import CreateRide from "./CreateRide";
import ShowRides from "./ShowRides";
import Vehicles from "./Vehicles";
import Drivers from "./Drivers";
import ManageBookings from "./ManageBookings";
import ManageRoutes from "./ManageRoutes";

function Admin() {
  const API_URL = "http://127.0.0.1:8000";
  const navigate = useNavigate();

  const [alluser, setAlluser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processingUserId, setProcessingUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const allusers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/allusers`);
      setAlluser(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(
        err.response?.data?.detail || "Unable to fetch users."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    allusers();
  }, [allusers]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/Login", { replace: true });
  };

  const toggleStatus = async (user) => {
    try {
      setProcessingUserId(user.id);
      setMessage("");
      setError("");

      await axios.patch(`${API_URL}/users/${user.id}/status`);

      setMessage(
        `${user.name} is now ${user.is_active ? "Inactive" : "Active"}.`
      );

      await allusers();
    } catch (err) {
      console.error("Status update error:", err);
      setError(
        err.response?.data?.detail || "Unable to update user status."
      );
    } finally {
      setProcessingUserId(null);
    }
  };

  const deleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setProcessingUserId(user.id);
      setMessage("");
      setError("");

      await axios.delete(`${API_URL}/deleteuser/${user.id}`);

      setMessage(`${user.name} deleted successfully.`);
      await allusers();
    } catch (err) {
      console.error("Delete user error:", err);
      setError(
        err.response?.data?.detail || "Unable to delete user."
      );
    } finally {
      setProcessingUserId(null);
    }
  };

  const activeUsers = alluser.filter(
    (user) => user.is_active
  ).length;

  const inactiveUsers = alluser.length - activeUsers;

  const driverUsers = alluser.filter(
    (user) => user.role?.toLowerCase() === "driver"
  ).length;

  const tabs = [
    { id: "dashboard", label: "Overview", icon: "▦" },
    { id: "create", label: "Create Ride", icon: "+" },
    { id: "rides", label: "Manage Rides", icon: "↗" },
    { id: "routes", label: "Manage Routes", icon: "↔" },
    { id: "vehicles", label: "Manage Vehicles", icon: "🚘" },
    { id: "drivers", label: "Manage Drivers", icon: "♙" },
    { id: "bookings", label: "Manage Bookings", icon: "▤" },
    { id: "users", label: "Manage Users", icon: "♧" },
  ];

  const changeTab = (tabId) => {
    setActiveTab(tabId);
    setMessage("");
    setError("");
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-mark">F</div>
          <div>
            <h2>FleetFlow</h2>
            <span>ADMIN CONSOLE</span>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`nav-item ${
                activeTab === tab.id ? "nav-item-active" : ""
              }`}
              onClick={() => changeTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span>{tab.label}</span>

              {activeTab === tab.id && (
                <span className="nav-indicator">●</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-status-dot"></div>
          <div>
            <strong>FleetFlow System</strong>
            <span>Admin workspace</span>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="topbar-eyebrow">FLEETFLOW / ADMIN</span>
            <h1>
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h1>
          </div>

          <div className="admin-topbar-actions">
            <button
              type="button"
              className="refresh-button"
              onClick={() => {
                setMessage("");
                setError("");
                setLoading(true);
                allusers();
              }}
            >
              ↻ <span>Refresh users</span>
            </button>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              ↪ Logout
            </button>
          </div>
        </header>

        <section className="admin-content">
          {message && (
            <div className="admin-alert alert-success" role="status">
              <span>✓</span>
              <p>{message}</p>
              <button
                type="button"
                aria-label="Dismiss message"
                onClick={() => setMessage("")}
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div className="admin-alert alert-error" role="alert">
              <span>!</span>
              <p>{error}</p>
              <button
                type="button"
                aria-label="Dismiss error"
                onClick={() => setError("")}
              >
                ×
              </button>
            </div>
          )}

          {/* OVERVIEW */}
          {activeTab === "dashboard" && (
            <>
              <section className="welcome-panel">
                <div>
                  <span className="welcome-tag">CONTROL CENTER</span>
                  <h2>Manage your fleet, effortlessly.</h2>
                  <p>
                    Monitor users, manage vehicles and drivers,
                    create rides and review bookings from one place.
                  </p>
                </div>

                <div
                  className="welcome-illustration"
                  aria-hidden="true"
                >
                  <span className="welcome-circle"></span>
                  <span className="welcome-car">🚘</span>
                </div>
              </section>

              <div className="section-heading">
                <div>
                  <h2>Platform overview</h2>
                  <p>A quick snapshot of your users.</p>
                </div>
                <span className="live-label">
                  <span></span> Live data
                </span>
              </div>

              <section className="admin-summary">
                <article className="summary-card">
                  <div className="summary-top">
                    <span>Total users</span>
                    <span className="summary-icon icon-blue">♙</span>
                  </div>
                  <strong className="summary-number">
                    {loading ? "—" : alluser.length}
                  </strong>
                  <p>Registered accounts</p>
                </article>

                <article className="summary-card">
                  <div className="summary-top">
                    <span>Active users</span>
                    <span className="summary-icon icon-green">✓</span>
                  </div>
                  <strong className="summary-number">
                    {loading ? "—" : activeUsers}
                  </strong>
                  <p>Currently enabled accounts</p>
                </article>

                <article className="summary-card">
                  <div className="summary-top">
                    <span>Inactive users</span>
                    <span className="summary-icon icon-orange">Ⅱ</span>
                  </div>
                  <strong className="summary-number">
                    {loading ? "—" : inactiveUsers}
                  </strong>
                  <p>Disabled accounts</p>
                </article>

                <article className="summary-card">
                  <div className="summary-top">
                    <span>Drivers</span>
                    <span className="summary-icon icon-purple">↗</span>
                  </div>
                  <strong className="summary-number">
                    {loading ? "—" : driverUsers}
                  </strong>
                  <p>Accounts with driver role</p>
                </article>
              </section>

              <section className="quick-actions">
                <div className="section-heading">
                  <div>
                    <h2>Quick actions</h2>
                    <p>Jump directly to your daily tasks.</p>
                  </div>
                </div>

                <div className="action-grid">
                  {[
                    {
                      id: "create",
                      symbol: "+",
                      title: "Create a ride",
                      description: "Set a route, driver and vehicle",
                      style: "action-blue",
                    },
                    {
                      id: "rides",
                      symbol: "↗",
                      title: "Manage rides",
                      description: "View and manage rides",
                      style: "action-green",
                    },
                    {
                      id: "routes",
                      symbol: "↔",
                      title: "Manage routes",
                      description: "View and manage routes",
                      style: "action-blue",
                    },
                    {
                      id: "vehicles",
                      symbol: "🚘",
                      title: "Manage vehicles",
                      description: "View and maintain fleet vehicles",
                      style: "action-blue",
                    },
                    {
                      id: "drivers",
                      symbol: "♙",
                      title: "Manage drivers",
                      description: "View driver records",
                      style: "action-purple",
                    },
                    {
                      id: "bookings",
                      symbol: "▤",
                      title: "Manage bookings",
                      description: "Review passenger bookings",
                      style: "action-green",
                    },
                    {
                      id: "users",
                      symbol: "♧",
                      title: "Manage users",
                      description: "Review accounts and access",
                      style: "action-purple",
                    },
                  ].map((action) => (
                    <button
                      type="button"
                      key={action.id}
                      className="action-card"
                      onClick={() => changeTab(action.id)}
                    >
                      <span
                        className={`action-symbol ${action.style}`}
                      >
                        {action.symbol}
                      </span>
                      <span className="action-copy">
                        <strong>{action.title}</strong>
                        <small>{action.description}</small>
                      </span>
                      <span className="action-arrow">→</span>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* CREATE RIDE */}
          {activeTab === "create" && (
            <section className="workspace-section">
              <div className="section-heading">
                <div>
                  <h2>Create a new ride</h2>
                  <p>Enter ride details and assign resources.</p>
                </div>
              </div>
              <div className="workspace-panel">
                <CreateRide />
              </div>
            </section>
          )}

          {/* MANAGE RIDES */}
          {activeTab === "rides" && (
            <section className="workspace-section">
              <div className="section-heading">
                <div>
                  <h2>Ride management</h2>
                  <p>Review available rides and their details.</p>
                </div>
              </div>
              <div className="workspace-panel rides-workspace">
                <ShowRides />
              </div>
            </section>
          )}

          {/* MANAGE ROUTES */}
          {activeTab === "routes" && (
            <section className="workspace-section">
              <div className="section-heading">
                <div>
                  <h2>Manage Routes</h2>
                  <p>View and manage your available routes.</p>
                </div>
              </div>
              <div className="workspace-panel">
                <ManageRoutes />
              </div>
            </section>
          )}

          {/* MANAGE VEHICLES */}
          {activeTab === "vehicles" && (
            <section className="workspace-section">
              <div className="section-heading">
                <div>
                  <h2>Manage Vehicles</h2>
                  <p>View, add and manage fleet vehicles.</p>
                </div>
              </div>
              <div className="workspace-panel">
                <Vehicles />
              </div>
            </section>
          )}

          {/* MANAGE DRIVERS */}
          {activeTab === "drivers" && (
            <section className="workspace-section">
              <div className="section-heading">
                <div>
                  <h2>Manage Drivers</h2>
                  <p>View and manage driver records.</p>
                </div>
              </div>
              <div className="workspace-panel">
                <Drivers />
              </div>
            </section>
          )}

          {/* MANAGE BOOKINGS */}
          {activeTab === "bookings" && (
            <section className="workspace-section">
              <div className="section-heading">
                <div>
                  <h2>Manage Bookings</h2>
                  <p>Review passenger bookings and booking status.</p>
                </div>
              </div>
              <div className="workspace-panel">
                <ManageBookings />
              </div>
            </section>
          )}

          {/* MANAGE USERS */}
          {activeTab === "users" && (
            <section className="workspace-section">
              <div className="section-heading">
                <div>
                  <h2>User management</h2>
                  <p>Manage registered accounts and their access.</p>
                </div>
                <span className="user-count">
                  {loading ? "Loading..." : `${alluser.length} users`}
                </span>
              </div>

              <div className="users-panel">
                {loading ? (
                  <div className="empty-state">
                    <div className="loading-spinner"></div>
                    <p>Loading users...</p>
                  </div>
                ) : alluser.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">♙</span>
                    <h3>No users found</h3>
                    <p>Registered accounts will appear here.</p>
                  </div>
                ) : (
                  <div className="users-table-wrap">
                    <table className="users-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {alluser.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <div className="table-user">
                                <div className="user-avatar">
                                  {(user.name || "U")
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                                <div className="table-user-info">
                                  <strong>{user.name}</strong>
                                  <small>ID: {user.id}</small>
                                </div>
                              </div>
                            </td>

                            <td className="user-email">
                              {user.email}
                            </td>

                            <td>
                              <span className="role-badge">
                                {user.role || "user"}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`status-badge ${
                                  user.is_active
                                    ? "status-active"
                                    : "status-inactive"
                                }`}
                              >
                                <span></span>
                                {user.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>

                            <td>
                              <div className="table-actions">
                                <button
                                  type="button"
                                  className={`btn btn-status ${
                                    user.is_active
                                      ? "btn-deactivate"
                                      : "btn-activate"
                                  }`}
                                  disabled={processingUserId !== null}
                                  onClick={() => toggleStatus(user)}
                                >
                                  {processingUserId === user.id
                                    ? "Please wait..."
                                    : user.is_active
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-delete"
                                  title={`Delete ${user.name}`}
                                  disabled={processingUserId !== null}
                                  onClick={() => deleteUser(user)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}
        </section>

        <footer className="admin-footer">
          <span>FleetFlow Admin Console</span>
          <span>Manage smarter. Move better.</span>
        </footer>
      </main>
    </div>
  );
}

export default Admin;


import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./ManageRoutes.css";

const API_URL = "http://127.0.0.1:8000";

function ManageRoutes() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchRides = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${API_URL}/rides`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      // Supports either a list or { rides: [...] }
      const data = response.data;
      const ridesList = Array.isArray(data)
        ? data
        : Array.isArray(data.rides)
        ? data.rides
        : [];

      setRides(ridesList);
    } catch (err) {
      console.error("Fetch rides error:", err);
      setError(
        err.response?.data?.detail ||
          "Rides load nahi ho paayi. API check karo."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  const toggleRideStatus = async (ride) => {
    const newActiveStatus = !ride.is_active;

    try {
      setUpdatingId(ride.id);
      setError("");
      setNotice("");

      const token = localStorage.getItem("access_token");

      await axios.patch(
        `${API_URL}/rides/${ride.id}/availability`,
        null,
        {
          params: {
            is_active: newActiveStatus,
          },
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      // Update the selected ride in React state
      setRides((previousRides) =>
        previousRides.map((item) =>
          item.id === ride.id
            ? { ...item, is_active: newActiveStatus }
            : item
        )
      );

      setNotice(
        `Ride #${ride.id} ${
          newActiveStatus ? "activated" : "deactivated"
        } successfully.`
      );
    } catch (err) {
      console.error("Update ride error:", err);
      setError(
        err.response?.data?.detail ||
          "Ride availability update nahi hui."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="manage-routes">
      <div className="routes-header">
        <div>
          <p className="routes-eyebrow">FLEETFLOW ADMIN</p>
          <h2>Manage Rides</h2>
          <p className="routes-subtitle">
            View all rides and manage their availability.
          </p>
        </div>

        <button
          type="button"
          className="routes-refresh-btn"
          onClick={fetchRides}
          disabled={loading || updatingId !== null}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="routes-stats">
        <div className="routes-stat-card">
          <span>Total Rides</span>
          <strong>{rides.length}</strong>
        </div>

        <div className="routes-stat-card">
          <span>Active Rides</span>
          <strong>
            {rides.filter((ride) => ride.is_active === true).length}
          </strong>
        </div>

        <div className="routes-stat-card">
          <span>Inactive Rides</span>
          <strong>
            {rides.filter((ride) => ride.is_active === false).length}
          </strong>
        </div>
      </div>

      {notice && (
        <div className="routes-notice" role="status">
          {notice}
        </div>
      )}

      {error && (
        <div className="routes-error" role="alert">
          {error}
          <button type="button" onClick={fetchRides}>
            Try Again
          </button>
        </div>
      )}

      <div className="routes-table-card">
        <div className="routes-table-heading">
          <div>
            <h3>All Rides</h3>
            <p>Manage ride availability without changing ride progress.</p>
          </div>
          <span className="routes-count">{rides.length} rides</span>
        </div>

        {loading ? (
          <div className="routes-state">
            <div className="routes-spinner" />
            <p>Loading rides...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="routes-state">
            <span className="routes-empty-icon">↔</span>
            <h3>No rides found</h3>
            <p>Rides will appear here when they are created.</p>
          </div>
        ) : (
          <div className="routes-table-wrapper">
            <table className="routes-table">
              <thead>
                <tr>
                  <th>Ride ID</th>
                  <th>Route</th>
                  <th>Departure</th>
                  <th>Price</th>
                  <th>Seats</th>
                  <th>Ride Status</th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {rides.map((ride) => (
                  <tr key={ride.id}>
                    <td>
                      <span className="routes-id">#{ride.id}</span>
                    </td>

                    <td>
                      <div className="routes-route">
                        <strong>{ride.source || "—"}</strong>
                        <span className="routes-route-arrow">↓</span>
                        <strong>{ride.destination || "—"}</strong>
                      </div>
                    </td>

                    <td className="routes-departure">
                      {formatDate(ride.departure_time)}
                    </td>

                    <td className="routes-price">
                      ₹{ride.price ?? "—"}
                    </td>

                    <td>{ride.available_seats ?? "—"}</td>

                    <td>
                      <span className="routes-progress-badge">
                        {ride.status || "Not Started"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`routes-availability ${
                          ride.is_active === true
                            ? "is-active"
                            : "is-inactive"
                        }`}
                      >
                        <span className="routes-status-dot" />
                        {ride.is_active === true
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`routes-toggle-btn ${
                          ride.is_active === true
                            ? "deactivate-btn"
                            : "activate-btn"
                        }`}
                        onClick={() => toggleRideStatus(ride)}
                        disabled={updatingId !== null}
                      >
                        {updatingId === ride.id
                          ? "Updating..."
                          : ride.is_active === true
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="routes-footer-note">
        Note: Ride progress and availability are separate. Deactivating a
        ride does not automatically cancel existing bookings.
      </p>
    </div>
  );
}

export default ManageRoutes;

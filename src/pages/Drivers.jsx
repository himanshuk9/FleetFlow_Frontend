
import { useEffect, useState } from "react";
import axios from "axios";
import "./Drivers.css";

const API_URL = "http://127.0.0.1:8000";

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getDrivers = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        `${API_URL}/drivers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDrivers(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not load drivers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDrivers();
  }, []);

  return (
    <div className="drivers-page">
      <header className="drivers-header">
        <div>
          <span className="eyebrow">
            FLEETFLOW MANAGEMENT
          </span>
          <h1>Drivers</h1>
          <p>
            Registered driver accounts from FleetFlow.
          </p>
        </div>

        <div className="driver-count">
          <span>Total Drivers</span>
          <strong>{drivers.length}</strong>
        </div>
      </header>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <section className="driver-list-section">
        <div className="list-heading">
          <div>
            <h2>Registered Drivers</h2>
            <p>
              Drivers are fetched automatically from user accounts.
            </p>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={getDrivers}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading drivers...
          </div>
        ) : drivers.length === 0 ? (
          <div className="empty-state">
            <h3>No registered drivers found</h3>
            <p>
              A user with the driver role will appear here
              automatically after registration.
            </p>
          </div>
        ) : (
          <div className="drivers-table-wrapper">
            <table className="drivers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Account Status</th>
                </tr>
              </thead>

              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver.id}>
                    <td>#{driver.id}</td>
                    <td className="driver-name-cell">
                      {driver.name}
                    </td>
                    <td>{driver.email}</td>
                    <td>
                      {driver.is_active
                        ? "Active"
                        : "Inactive"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Drivers;

import axios from "axios";
import { useEffect, useState } from "react";
import "./Drivers.css";

const API_URL = "http://127.0.0.1:8000/driver";

function Drivers() {
  const [alldrivers, setalldrivers] = useState([]);

  const [formData, setFormData] = useState({
    driver_name: "",
    phone_no: "",
    license_no: "",
    status: "Available",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // NEW: Track which driver is being edited
  const [editingId, setEditingId] = useState(null);

  // GET: Fetch all drivers
  const getdriver = async () => {
    try {
      setError("");

      const response = await axios.get(API_URL);
      setalldrivers(response.data);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError(
        err.response?.data?.detail || "Could not load drivers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getdriver();
  }, []);

  // Update form state
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // NEW: EDIT - Fill the form with existing driver details
  const handleEdit = (driver) => {
    setEditingId(driver.id);

    setFormData({
      driver_name: driver.driver_name,
      phone_no: driver.phone_no,
      license_no: driver.license_no,
      status: driver.status,
    });

    setError("");
    setSuccess("");

    // Scroll to the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // NEW: Reset form and exit edit mode
  const resetForm = () => {
    setEditingId(null);

    setFormData({
      driver_name: "",
      phone_no: "",
      license_no: "",
      status: "Available",
    });

    setError("");
    setSuccess("");
  };

  // POST: Add a driver OR PUT: Update a driver
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const phone = formData.phone_no.trim();

    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        driver_name: formData.driver_name.trim(),
        phone_no: phone,
        license_no: formData.license_no.trim(),
      };

      if (editingId !== null) {
        // PUT: Update existing driver
        await axios.put(`${API_URL}/${editingId}`, payload);

        setSuccess("Driver updated successfully!");
      } else {
        // POST: Create new driver
        const response = await axios.post(API_URL, payload);

        setSuccess("Driver added successfully!");

        // Add new driver to the current list
        setalldrivers((prev) => [...prev, response.data]);
      }

      // Reset form and refresh list
      setFormData({
        driver_name: "",
        phone_no: "",
        license_no: "",
        status: "Available",
      });

      setEditingId(null);

      await getdriver();
    } catch (err) {
      console.error("Error saving driver:", err);

      setError(
        err.response?.data?.detail || "Could not save driver."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // NEW: DELETE a driver
  const deleteDriver = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this driver?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await axios.delete(`${API_URL}/${id}`);

      // If deleting the driver currently being edited,
      // clear the edit form
      if (editingId === id) {
        setEditingId(null);

        setFormData({
          driver_name: "",
          phone_no: "",
          license_no: "",
          status: "Available",
        });
      }

      setSuccess("Driver deleted successfully!");

      // Refresh the list from the backend
      await getdriver();
    } catch (err) {
      console.error("Error deleting driver:", err);

      setError(
        err.response?.data?.detail || "Could not delete driver."
      );
    }
  };

  return (
    <div className="drivers-page">
      <header className="drivers-header">
        <div>
          <span className="eyebrow">FLEETFLOW MANAGEMENT</span>
          <h1>Drivers</h1>
          <p>Manage your drivers and keep your fleet moving.</p>
        </div>

        <div className="driver-count">
          <span>Total Drivers</span>
          <strong>{loading ? "..." : alldrivers.length}</strong>
        </div>
      </header>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="status">
          {success}
        </div>
      )}

      {/* ADD / EDIT FORM */}
      <section className="driver-form-card">
        <div className="section-heading">
          <div>
            <h2>
              {editingId !== null ? "Edit Driver" : "Add New Driver"}
            </h2>
            <p>
              {editingId !== null
                ? "Update the driver's details below."
                : "Enter the driver's details below."}
            </p>
          </div>

          <span className="form-icon">+</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="driver_name">Driver Name</label>
              <input
                id="driver_name"
                name="driver_name"
                type="text"
                placeholder="Enter full name"
                value={formData.driver_name}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_no">Phone Number</label>
              <input
                id="phone_no"
                name="phone_no"
                type="tel"
                placeholder="10-digit mobile number"
                value={formData.phone_no}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={10}
                pattern="[0-9]{10}"
                title="Enter exactly 10 digits"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="license_no">License Number</label>
              <input
                id="license_no"
                name="license_no"
                type="text"
                placeholder="Enter license number"
                value={formData.license_no}
                onChange={handleChange}
                maxLength={50}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Driver Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Available">Available</option>
                <option value="On Duty">On Duty</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            {/* Clear form or cancel editing */}
            <button
              type="button"
              className="btn-secondary"
              onClick={resetForm}
            >
              {editingId !== null ? "Cancel Edit" : "Clear Form"}
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting
                ? editingId !== null
                  ? "Updating Driver..."
                  : "Adding Driver..."
                : editingId !== null
                ? "Update Driver"
                : "+ Add Driver"}
            </button>
          </div>
        </form>
      </section>

      {/* ALL DRIVERS */}
      <section className="driver-list-section">
        <div className="list-heading">
          <div>
            <h2>All Drivers</h2>
            <p>Your registered drivers in one place.</p>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={getdriver}
            disabled={loading}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Loading drivers...</div>
        ) : alldrivers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♙</div>
            <h3>No drivers found</h3>
            <p>Add your first driver using the form above.</p>
          </div>
        ) : (
          <div className="drivers-table-wrapper">
            <table className="drivers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Driver Name</th>
                  <th>Phone</th>
                  <th>License Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {alldrivers.map((driver) => (
                  <tr key={driver.id}>
                    <td>#{driver.id}</td>

                    <td className="driver-name-cell">
                      {driver.driver_name}
                    </td>

                    <td>{driver.phone_no}</td>
                    <td>{driver.license_no}</td>

                    <td>
                      <span
                        className={`status-badge status-${driver.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {driver.status}
                      </span>
                    </td>

                    {/* NEW: EDIT AND DELETE BUTTONS */}
                    <td>
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEdit(driver)}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteDriver(driver.id)}
                      >
                        🗑️ Delete
                      </button>
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
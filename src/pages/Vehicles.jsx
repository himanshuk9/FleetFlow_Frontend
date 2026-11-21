
import { useState, useEffect } from "react";
import axios from "axios";
import "./Vehicles.css";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);

  // SEARCH: Store the text typed by the user
  const [searchitem, setseachitem] = useState("");

  const [form, setForm] = useState({
    registration_number: "",
    model: "",
    status: "Available",
  });

  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://127.0.0.1:8000/vehicles";

  // GET: Fetch all vehicles from the database
  const getVehicles = async () => {
    try {
      const response = await axios.get(API_URL);
      setVehicles(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Could not fetch vehicles");
    }
  };

  // Fetch vehicles when the page loads
  useEffect(() => {
    getVehicles();
  }, []);

  // SEARCH: Filter by model OR registration number
  // This creates a temporary list; original vehicles state stays unchanged
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.model
      .toLowerCase()
      .includes(searchitem.toLowerCase()) ||
    vehicle.registration_number
      .toLowerCase()
      .includes(searchitem.toLowerCase())
  );

  // Update form fields
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // EDIT: Fill form with selected vehicle details
  const handleEdit = (vehicle) => {
    setEditingId(vehicle.id);

    setForm({
      registration_number: vehicle.registration_number,
      model: vehicle.model,
      status: vehicle.status,
    });

    setError("");
  };

  // Reset form and return to Add mode
  const resetForm = () => {
    setEditingId(null);

    setForm({
      registration_number: "",
      model: "",
      status: "Available",
    });

    setError("");
  };

  // POST: Create OR PUT: Update vehicle
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId !== null) {
        // PUT: Update existing vehicle
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        // POST: Create new vehicle
        await axios.post(API_URL, form);
      }

      resetForm();
      await getVehicles();
    } catch (error) {
      setError(
        error.response?.data?.detail || "Error saving vehicle"
      );
    }
  };

  // DELETE: Remove a vehicle
  const deleteVehicle = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");

      await axios.delete(`${API_URL}/${id}`);

      // Reset form if the same vehicle is being edited
      if (editingId === id) {
        resetForm();
      }

      await getVehicles();
    } catch (error) {
      setError(
        error.response?.data?.detail || "Error deleting vehicle"
      );
    }
  };

  return (
    <div className="vehicles-container">
      <h1>FleetFlow Vehicles</h1>

      {/* Total count of all vehicles, not just search results */}
      <h2>Total Vehicles: {vehicles.length}</h2>

      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search by model or registration..."
        value={searchitem}
        onChange={(e) => setseachitem(e.target.value)}
      />

      <h2>
        {editingId !== null ? "Edit Vehicle" : "Add Vehicle"}
      </h2>

      {/* ADD / EDIT FORM */}
      <form onSubmit={handleSubmit}>
        <input
          name="registration_number"
          placeholder="Registration Number"
          value={form.registration_number}
          onChange={handleChange}
          required
        />

        <input
          name="model"
          placeholder="Vehicle Model"
          value={form.model}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Available">Available</option>
          <option value="In Use">In Use</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <button type="submit">
          {editingId !== null ? "Update Vehicle" : "Add Vehicle"}
        </button>

        {/* CANCEL EDIT */}
        {editingId !== null && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {/* ERROR MESSAGE */}
      {error && <p className="error-message">{error}</p>}

      {/* VEHICLE LIST */}
      <div className="vehicles-list">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <div className="vehicle-card" key={vehicle.id}>
              <p>ID: {vehicle.id}</p>

              <p>Registration: {vehicle.registration_number}</p>

              <p>Model: {vehicle.model}</p>

              <p>Status: {vehicle.status}</p>

              {/* EDIT BUTTON */}
              <button
                type="button"
                className="edit-button"
                onClick={() => handleEdit(vehicle)}
                title="Edit Vehicle"
              >
                ✏️ Edit
              </button>

              {/* DELETE BUTTON */}
              <button
                type="button"
                className="delete-button"
                onClick={() => deleteVehicle(vehicle.id)}
                title="Delete Vehicle"
              >
                🗑️ Delete
              </button>
            </div>
          ))
        ) : (
          <p>No vehicles found.</p>
        )}
      </div>

      {/* SEARCH RESULT COUNT */}
      <p>
        Showing {filteredVehicles.length} of {vehicles.length} vehicles
      </p>
    </div>
  );
}

export default Vehicles;
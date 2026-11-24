
import { useEffect, useState } from "react";
import axios from "axios";
import "./CreateRide.css";

function CreateRide() {
  const API_URL = "http://127.0.0.1:8000";
  const token = localStorage.getItem("access_token");

  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    source: "",
    destination: "",
    departure_time: "",
    price: "",
    available_seats: "",
    driver_id: "",
    vehicle_id: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Fetch drivers and vehicles
  useEffect(() => {
    async function fetchData() {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [usersResponse, vehiclesResponse] =
          await Promise.all([
            axios.get(`${API_URL}/drivers`, config),
            axios.get(`${API_URL}/vehicles`, config),
          ]);

        const driverUsers = usersResponse.data.filter(
          (user) => user.role === "driver"
        );

        setDrivers(driverUsers);
        setVehicles(vehiclesResponse.data);
      } catch (error) {
        setMessage(
          error.response?.data?.detail ||
            "Could not load drivers or vehicles."
        );
      }
    }

    if (token) {
      fetchData();
    } else {
      setMessage("Please log in first.");
    }
  }, [token]);

  // Step 2: Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // Step 3: Submit ride form
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!formData.driver_id || !formData.vehicle_id) {
      setMessage("Please select both a driver and a vehicle.");
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      available_seats: Number(formData.available_seats),
      driver_id: Number(formData.driver_id),
      vehicle_id: Number(formData.vehicle_id),
    };

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/rides`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Ride created successfully!");

      setFormData({
        title: "",
        source: "",
        destination: "",
        departure_time: "",
        price: "",
        available_seats: "",
        driver_id: "",
        vehicle_id: "",
      });

      console.log("Created ride:", response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Failed to create ride."
      );
    } finally {
      setLoading(false);
    }
  }

  // Step 4: UI
  return (
    <div className="create-ride-container">
      <h2>Create New Ride</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Ride Title</label>
        <input
          id="title"
          name="title"
          className="ride-input"
          value={formData.title}
          onChange={handleChange}
          placeholder="Delhi to Jaipur"
          required
        />

        <label htmlFor="source">Source</label>
        <input
          id="source"
          name="source"
          className="ride-input"
          value={formData.source}
          onChange={handleChange}
          placeholder="Delhi"
          required
        />

        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          name="destination"
          className="ride-input"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Jaipur"
          required
        />

        <label htmlFor="departure_time">Departure Time</label>
        <input
          id="departure_time"
          type="datetime-local"
          name="departure_time"
          className="ride-input"
          value={formData.departure_time}
          onChange={handleChange}
          required
        />

        <label htmlFor="price">Price (₹)</label>
        <input
          id="price"
          type="number"
          name="price"
          className="ride-input"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />

        <label htmlFor="available_seats">Available Seats</label>
        <input
          id="available_seats"
          type="number"
          name="available_seats"
          className="ride-input"
          value={formData.available_seats}
          onChange={handleChange}
          min="1"
          required
        />

        <label htmlFor="driver_id">Select Driver</label>
        <select
          id="driver_id"
          name="driver_id"
          className="ride-input"
          value={formData.driver_id}
          onChange={handleChange}
          required
        >
          <option value="">Choose a driver</option>

          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name} (ID: {driver.id})
            </option>
          ))}
        </select>

        <label htmlFor="vehicle_id">Select Vehicle</label>
        <select
          id="vehicle_id"
          name="vehicle_id"
          className="ride-input"
          value={formData.vehicle_id}
          onChange={handleChange}
          required
        >
          <option value="">Choose a vehicle</option>

          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.model} - {vehicle.registration_number}
              {" "}(ID: {vehicle.id})
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="create-ride-btn"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Ride"}
        </button>
      </form>

      {message && (
        <p className="ride-message">{message}</p>
      )}
    </div>
  );
}

export default CreateRide;

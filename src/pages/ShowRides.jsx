
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShowRides.css";

function ShowRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/rides");

        if (!response.ok) {
          throw new Error("Unable to load rides.");
        }

        const data = await response.json();
        setRides(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  return (
    <div className="show-rides-page">
      <div className="rides-header">
        <h1>Explore Available Rides</h1>
        <p>Find your next ride with FleetFlow.</p>
      </div>

      {loading && (
        <p className="rides-message">Loading rides...</p>
      )}

      {!loading && error && (
        <p className="rides-message error-message">{error}</p>
      )}

      {!loading && !error && rides.length === 0 && (
        <p className="rides-message">
          No rides available right now.
        </p>
      )}

      {!loading && !error && rides.length > 0 && (
        <div className="rides-grid">
          {rides.map((ride) => (
            <div className="ride-card" key={ride.id}>
              <div className="ride-card-header">
                <span className="ride-label">FleetFlow Ride</span>
                <span className="ride-status">
                  {ride.status || "Available"}
                </span>
              </div>

              <h2 className="ride-title">{ride.title}</h2>

              <div className="ride-route">
                <div className="route-point">
                  <span className="route-dot source-dot"></span>
                  <div>
                    <small>FROM</small>
                    <p>{ride.source}</p>
                  </div>
                </div>

                <div className="route-line"></div>

                <div className="route-point">
                  <span className="route-dot destination-dot"></span>
                  <div>
                    <small>TO</small>
                    <p>{ride.destination}</p>
                  </div>
                </div>
              </div>

              <div className="ride-details">
                <div className="ride-detail">
                  <span>Departure</span>
                  <strong>
                    {new Date(ride.departure_time).toLocaleString(
                      "en-IN",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
                  </strong>
                </div>

                <div className="ride-detail">
                  <span>Available Seats</span>
                  <strong>{ride.available_seats}</strong>
                </div>

                <div className="ride-detail">
                  <span>Driver Name</span>
                  <strong>
                    {ride.driver_name || "Not assigned"}
                  </strong>
                </div>

                <div className="ride-detail">
                  <span>Vehicle Model</span>
                  <strong>
                    {ride.vehicle_name || "Not assigned"}
                  </strong>
                </div>
              </div>

              <div className="ride-card-footer">
                <div className="ride-price">
                  <small>Price per seat</small>
                  <strong>
                    ₹{Number(ride.price).toLocaleString("en-IN")}
                  </strong>
                </div>

                <button
                  className="book-ride-btn"
                  disabled={
                    ride.available_seats <= 0 ||
                    ride.status?.toLowerCase() === "cancelled"
                  }
                  onClick={() =>
                    navigate("/book-ride", {
                      state: { rideId: ride.id },
                    })
                  }
                >
                  Book Ride
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowRides;


import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookRide.css";

function BookRide() {
  const location = useLocation();
  const navigate = useNavigate();

  const rideId = location.state?.rideId;

  const [ride, setRide] = useState(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRide = async () => {
      if (!rideId) {
        setError("Please select a ride first.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/rides");

        if (!response.ok) {
          throw new Error("Unable to load ride details.");
        }

        const data = await response.json();
        const selectedRide = data.find(
          (item) => item.id === Number(rideId)
        );

        if (!selectedRide) {
          throw new Error("Ride not found or no longer available.");
        }

        setRide(selectedRide);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [rideId]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Please log in before booking a ride.");
      return;
    }

    if (!ride || seats < 1 || seats > ride.available_seats) {
      setError("Please select a valid number of seats.");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ride_id: ride.id,
          seats_booked: Number(seats),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Booking failed. Please try again."
        );
      }

      setSuccess(
        `Booking successful! Booking ID: ${data.id}`
      );

      setRide((previousRide) => ({
        ...previousRide,
        available_seats:
          previousRide.available_seats - Number(seats),
      }));
    } catch (err) {
      setError(err.message || "Unable to complete booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <p className="booking-message">Loading ride details...</p>;
  }

  if (!ride) {
    return (
      <div className="booking-page">
        <p className="booking-error">{error}</p>
        <button onClick={() => navigate("/show-rides")}>
          Back to Rides
        </button>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-card">
        <h1>Book Your Ride</h1>
        <p className="booking-subtitle">
          Confirm your journey with FleetFlow.
        </p>

        <div className="booking-route">
          <h2>{ride.title}</h2>
          <p>
            <strong>From:</strong> {ride.source}
          </p>
          <p>
            <strong>To:</strong> {ride.destination}
          </p>
          <p>
            <strong>Departure:</strong>{" "}
            {new Date(ride.departure_time).toLocaleString("en-IN")}
          </p>
          <p>
            <strong>Available seats:</strong> {ride.available_seats}
          </p>
          <p>
            <strong>Price per seat:</strong> ₹
            {Number(ride.price).toLocaleString("en-IN")}
          </p>
        </div>

        <form onSubmit={handleBooking}>
          <label htmlFor="seats">Number of seats</label>

          <input
            id="seats"
            type="number"
            min="1"
            max={ride.available_seats}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            disabled={bookingLoading || ride.available_seats <= 0}
            required
          />

          <div className="booking-total">
            <span>Total Amount</span>
            <strong>
              ₹{(Number(ride.price) * seats).toLocaleString("en-IN")}
            </strong>
          </div>

          {error && <p className="booking-error">{error}</p>}
          {success && <p className="booking-success">{success}</p>}

          <button
            type="submit"
            disabled={
              bookingLoading ||
              ride.available_seats <= 0 ||
              seats < 1 ||
              seats > ride.available_seats
            }
          >
            {bookingLoading
              ? "Booking..."
              : ride.available_seats <= 0
              ? "Sold Out"
              : "Confirm Booking"}
          </button>
        </form>

        <button
          className="back-button"
          onClick={() => navigate("/show-rides")}
        >
          Back to Rides
        </button>
      </div>
    </div>
  );
}

export default BookRide;


import { useEffect, useState } from "react";
import "./MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyBookings = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please log in to view your bookings.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/my-bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            typeof data.detail === "string"
              ? data.detail
              : "Unable to load your bookings."
          );
        }

        setBookings(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return <p className="my-bookings-message">Loading your bookings...</p>;
  }

  if (error) {
    return <p className="my-bookings-error">{error}</p>;
  }

  return (
    <section className="my-bookings">
      <div className="my-bookings-header">
        <h2>My Bookings</h2>
        <p>View the rides you have booked with FleetFlow.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="my-bookings-empty">
          <h3>No bookings yet</h3>
          <p>Explore available rides and book your first journey.</p>
        </div>
      ) : (
        <div className="my-bookings-list">
          {bookings.map((booking) => (
            <article
              className="my-booking-card"
              key={booking.booking_id}
            >
              <div className="my-booking-top">
                <span>Booking #{booking.booking_id}</span>
                <span className="my-booking-status">
                  {booking.status}
                </span>
              </div>

              <h3>{booking.ride_title}</h3>

              <div className="my-booking-route">
                <div>
                  <small>FROM</small>
                  <strong>{booking.source}</strong>
                </div>

                <span aria-hidden="true">→</span>

                <div>
                  <small>TO</small>
                  <strong>{booking.destination}</strong>
                </div>
              </div>

              <div className="my-booking-details">
                <p>
                  <span>Departure</span>
                  <strong>{formatDate(booking.departure_time)}</strong>
                </p>

                <p>
                  <span>Seats booked</span>
                  <strong>{booking.seats_booked}</strong>
                </p>

                <p>
                  <span>Booking date</span>
                  <strong>{formatDate(booking.created_at)}</strong>
                </p>

                <p>
                  <span>Total amount</span>
                  <strong>
                    {Number(booking.total_price).toLocaleString(
                      "en-IN",
                      {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 2,
                      }
                    )}
                  </strong>
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyBookings;


import { useEffect, useState } from "react";
import "./ManageBookings.css";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please log in as admin to view bookings.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/admin/bookings",
          {
            method: "GET",
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
              : "Unable to fetch bookings."
          );
        }

        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatAmount = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  const getStatusClass = (status) => {
    const normalizedStatus = (status || "Pending").toLowerCase();

    if (normalizedStatus === "confirmed") return "confirmed";
    if (normalizedStatus === "cancelled") return "cancelled";
    if (normalizedStatus === "completed") return "completed";

    return "pending";
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Please log in as admin.");
      return;
    }

    if (
      newStatus === "Cancelled" &&
      !window.confirm(
        "Are you sure you want to cancel this booking?"
      )
    ) {
      return;
    }

    setUpdatingId(bookingId);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/admin/bookings/${bookingId}/status?new_status=${encodeURIComponent(newStatus)}`,
        {
          method: "PATCH",
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
            : "Unable to update booking status."
        );
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.booking_id === bookingId
            ? { ...booking, status: data.status }
            : booking
        )
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="manage-bookings">
      <div className="manage-bookings-header">
        <div>
          <h2>Booking Management</h2>
          <p>View passenger bookings and manage booking status.</p>
        </div>

        <div className="booking-count">
          Total Bookings: <strong>{bookings.length}</strong>
        </div>
      </div>

      {loading && (
        <p className="bookings-message">Loading bookings...</p>
      )}

      {!loading && error && (
        <p className="bookings-message bookings-error">{error}</p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="bookings-empty">
          <h3>No bookings yet</h3>
          <p>
            Passenger bookings will appear here once users book rides.
          </p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Passenger</th>
                <th>Ride</th>
                <th>Departure</th>
                <th>Seats</th>
                <th>Total Amount</th>
                <th>Booking Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => {
                const status = (
                  booking.status || "Pending"
                ).toLowerCase();

                return (
                  <tr key={booking.booking_id}>
                    <td>#{booking.booking_id}</td>

                    <td>
                      <div className="passenger-name">
                        {booking.user_name}
                      </div>
                      <small className="passenger-email">
                        {booking.user_email}
                      </small>
                    </td>

                    <td>
                      <strong>{booking.ride_title}</strong>
                      <div className="booking-route-text">
                        {booking.source} → {booking.destination}
                      </div>
                    </td>

                    <td>{formatDate(booking.departure_time)}</td>

                    <td>{booking.seats_booked}</td>

                    <td className="booking-amount">
                      {formatAmount(booking.total_price)}
                    </td>

                    <td>{formatDate(booking.created_at)}</td>

                    <td>
                      <span
                        className={`booking-status ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status || "Pending"}
                      </span>
                    </td>

                    <td className="booking-actions">
                      {status === "pending" && (
                        <>
                          <button
                            type="button"
                            className="booking-confirm-btn"
                            onClick={() =>
                              handleStatusChange(
                                booking.booking_id,
                                "Confirmed"
                              )
                            }
                            disabled={updatingId !== null}
                          >
                            {updatingId === booking.booking_id
                              ? "Updating..."
                              : "Confirm"}
                          </button>

                          <button
                            type="button"
                            className="booking-cancel-btn"
                            onClick={() =>
                              handleStatusChange(
                                booking.booking_id,
                                "Cancelled"
                              )
                            }
                            disabled={updatingId !== null}
                          >
                            {updatingId === booking.booking_id
                              ? "Updating..."
                              : "Cancel"}
                          </button>
                        </>
                      )}

                      {status === "confirmed" && (
                        <span className="booking-action-done">
                          Confirmed
                        </span>
                      )}

                      {status === "cancelled" && (
                        <span className="booking-action-done">
                          Cancelled
                        </span>
                      )}

                      {status === "completed" && (
                        <span className="booking-action-done">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageBookings;

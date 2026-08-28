import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function MyBookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get("/bookings/my");

      setBookings(response.data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load your bookings"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    loadBookings();
  }, []);


  const cancelBooking = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {

      await api.put(`/bookings/${id}/cancel`);

      loadBookings();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Unable to cancel booking"
      );

    }

  };


  return (

    <div className="my-bookings-page">

      {/* HEADER */}

      <div className="admin-page-header">

        <div>

          <p className="dashboard-label">
            CUSTOMER
          </p>

          <h1>
            My Bookings 📋
          </h1>

          <p>
            View your complete cab booking history.
          </p>

        </div>

        <Link
          to="/dashboard"
          className="back-dashboard"
        >
          ← Dashboard
        </Link>

      </div>


      {/* ERROR */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      {/* BOOKINGS */}

      <section className="my-bookings-card">

        <div className="bookings-list-header">

          <div>

            <h2>
              Booking History
            </h2>

            <p>
              {bookings.length} booking(s)
            </p>

          </div>

          <button
            className="refresh-btn"
            onClick={loadBookings}
          >
            ↻ Refresh
          </button>

        </div>


        {loading ? (

          <div className="admin-loading">
            Loading your bookings...
          </div>

        ) : bookings.length === 0 ? (

          <div className="admin-empty">

            <div>
              🚕
            </div>

            <h3>
              No bookings yet
            </h3>

            <p>
              Book your first cab to see it here.
            </p>

            <Link
              to="/book-ride"
              className="book-now-btn"
            >
              Book a Cab
            </Link>

          </div>

        ) : (

          <div className="my-booking-list">

            {bookings.map((booking) => (

              <div
                className="my-booking-card"
                key={booking._id}
              >

                {/* HEADER */}

                <div className="my-booking-header">

                  <div className="my-booking-id">

                    <span>
                      🚕
                    </span>

                    <div>

                      <strong>
                        #{booking._id.slice(-6)}
                      </strong>

                      <small>
                        Booking ID
                      </small>

                    </div>

                  </div>


                  <span
                    className={`booking-status ${booking.status}`}
                  >
                    {booking.status}
                  </span>

                </div>


                {/* ROUTE */}

                <div className="my-booking-route">

                  <div className="my-location">

                    <span className="my-pickup-dot">
                      ●
                    </span>

                    <div>

                      <small>
                        PICKUP
                      </small>

                      <strong>
                        {booking.pickup}
                      </strong>

                    </div>

                  </div>


                  <div className="my-route-arrow">
                    →
                  </div>


                  <div className="my-location">

                    <span className="my-destination-dot">
                      ●
                    </span>

                    <div>

                      <small>
                        DESTINATION
                      </small>

                      <strong>
                        {booking.destination}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* DETAILS */}

                <div className="my-booking-details">

                  <div>

                    <small>
                      DISTANCE
                    </small>

                    <strong>
                      {booking.distance || 0} km
                    </strong>

                  </div>


                  <div>

                    <small>
                      CAB
                    </small>

                    <strong>
                      {booking.cab?.vehicleModel ||
                        "Not assigned"}
                    </strong>

                    <span>
                      {booking.cab?.vehicleNumber || ""}
                    </span>

                  </div>


                  <div>

                    <small>
                      DRIVER
                    </small>

                    <strong>
                      {booking.driver?.name ||
                        "Not assigned"}
                    </strong>

                  </div>


                  <div>

                    <small>
                      TOTAL FARE
                    </small>

                    <strong className="booking-fare">
                      ₹{booking.fare || 0}
                    </strong>

                  </div>

                </div>


                {/* FOOTER */}

                <div className="my-booking-footer">

                  <small>

                    {booking.createdAt
                      ? new Date(
                          booking.createdAt
                        ).toLocaleString()
                      : ""
                    }

                  </small>


                  {[
                    "pending",
                    "accepted"
                  ].includes(
                    booking.status
                  ) && (

                    <button
                      className="cancel-booking-btn"
                      onClick={() =>
                        cancelBooking(
                          booking._id
                        )
                      }
                    >
                      Cancel Booking
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>

  );

}

export default MyBookings;
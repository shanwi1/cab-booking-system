import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function DriverDashboard({ user }) {

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);


  // =========================
  // LOAD DRIVER BOOKINGS
  // =========================

  const loadBookings = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await api.get("/bookings/driver");

      setBookings(response.data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load driver bookings"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

  loadBookings();

  const interval = setInterval(() => {
    loadBookings();
  }, 5000);

  return () => {
    clearInterval(interval);
  };

}, []);


  // =========================
  // UPDATE RIDE STATUS
  // =========================

  const updateRideStatus = async (
    bookingId,
    status
  ) => {

    try {

      setUpdatingId(bookingId);

      await api.put(
        `/bookings/${bookingId}/status`,
        { status }
      );

      await loadBookings();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Unable to update ride"
      );

    } finally {

      setUpdatingId(null);

    }

  };


  // =========================
  // COUNTS
  // =========================

  const pendingRides =
    bookings.filter(
      booking =>
        booking.status === "pending"
    ).length;


  const acceptedRides =
    bookings.filter(
      booking =>
        booking.status === "accepted"
    ).length;


  const ongoingRides =
    bookings.filter(
      booking =>
        booking.status === "ongoing"
    ).length;


  const completedRides =
    bookings.filter(
      booking =>
        booking.status === "completed"
    ).length;


  return (

    <div className="driver-dashboard">


      {/* =========================
          HEADER
      ========================== */}

      <section className="driver-welcome">

        <div>

          <p className="dashboard-label">
            DRIVER DASHBOARD
          </p>

          <h1>
            Welcome, {user?.name || "Driver"} 👋
          </h1>

          <p>
            Manage your rides and start your next journey.
          </p>

        </div>


        <div className="driver-online">

          <span></span>

          Online

        </div>

      </section>



      {/* =========================
          STATISTICS
      ========================== */}

      <section className="driver-stats">


        <div className="driver-stat-card">

          <div className="driver-stat-icon">
            🟡
          </div>

          <div>

            <small>
              Pending
            </small>

            <strong>
              {pendingRides}
            </strong>

          </div>

        </div>


        <div className="driver-stat-card">

          <div className="driver-stat-icon">
            🔵
          </div>

          <div>

            <small>
              Accepted
            </small>

            <strong>
              {acceptedRides}
            </strong>

          </div>

        </div>


        <div className="driver-stat-card">

          <div className="driver-stat-icon">
            🟣
          </div>

          <div>

            <small>
              Ongoing
            </small>

            <strong>
              {ongoingRides}
            </strong>

          </div>

        </div>


        <div className="driver-stat-card">

          <div className="driver-stat-icon">
            🟢
          </div>

          <div>

            <small>
              Completed
            </small>

            <strong>
              {completedRides}
            </strong>

          </div>

        </div>

      </section>



      {/* =========================
          ERROR
      ========================== */}

      {error && (

        <div className="driver-error">

          <p>
            {error}
          </p>

          <button
            onClick={loadBookings}
          >
            Try Again
          </button>

        </div>

      )}



      {/* =========================
          RIDES
      ========================== */}

      <section className="driver-rides-section">


        <div className="driver-section-header">

          <div>

            <p className="dashboard-label">
              RIDE REQUESTS
            </p>

            <h2>
              Available Rides
            </h2>

          </div>


          <button
            className="refresh-btn"
            onClick={loadBookings}
          >
            ↻ Refresh
          </button>

        </div>



        {loading ? (

          <div className="driver-loading">
            Loading rides...
          </div>

        ) : bookings.length === 0 ? (

          <div className="driver-empty">

            <div>
              🚕
            </div>

            <h3>
              No rides available
            </h3>

            <p>
              New customer bookings will appear here.
            </p>

          </div>

        ) : (

          <div className="driver-ride-list">

            {bookings.map((booking) => (

              <div
                className="driver-ride-card"
                key={booking._id}
              >


                {/* RIDE HEADER */}

                <div className="driver-ride-header">

                  <div className="driver-booking-id">

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

                <div className="driver-route">

                  <div className="driver-location">

                    <span className="driver-pickup-dot">
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


                  <div className="driver-route-line">
                    ↓
                  </div>


                  <div className="driver-location">

                    <span className="driver-destination-dot">
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

                <div className="driver-ride-details">


                  <div>

                    <small>
                      CUSTOMER
                    </small>

                    <strong>
                      {booking.user?.name ||
                        booking.customer?.name ||
                        "Customer"}
                    </strong>

                  </div>


                  <div>

                    <small>
                      DISTANCE
                    </small>

                    <strong>
                      {booking.distance} km
                    </strong>

                  </div>


                  <div>

                    <small>
                      FARE
                    </small>

                    <strong>
                      ₹{booking.fare}
                    </strong>

                  </div>


                  <div>

                    <small>
                      CAB
                    </small>

                    <strong>
                      {booking.cab?.vehicleModel ||
                        "Assigned Cab"}
                    </strong>

                  </div>


                </div>



                {/* ACTIONS */}

                <div className="driver-ride-actions">


                  {booking.status === "pending" && (

                    <button
                      className="accept-ride-btn"
                      disabled={
                        updatingId === booking._id
                      }
                      onClick={() =>
                        updateRideStatus(
                          booking._id,
                          "accepted"
                        )
                      }
                    >

                      {updatingId === booking._id
                        ? "Accepting..."
                        : "✓ Accept Ride"
                      }

                    </button>

                  )}


                  {booking.status === "accepted" && (

                    <button
                      className="start-ride-btn"
                      disabled={
                        updatingId === booking._id
                      }
                      onClick={() =>
                        updateRideStatus(
                          booking._id,
                          "ongoing"
                        )
                      }
                    >

                      {updatingId === booking._id
                        ? "Starting..."
                        : "▶ Start Ride"
                      }

                    </button>

                  )}


                  {booking.status === "ongoing" && (

                    <button
                      className="complete-ride-btn"
                      disabled={
                        updatingId === booking._id
                      }
                      onClick={() =>
                        updateRideStatus(
                          booking._id,
                          "completed"
                        )
                      }
                    >

                      {updatingId === booking._id
                        ? "Completing..."
                        : "✓ Complete Ride"
                      }

                    </button>

                  )}


                  {booking.status === "completed" && (

                    <span className="ride-completed">
                      ✓ Ride Completed
                    </span>

                  )}


                  {booking.status === "cancelled" && (

                    <span className="ride-cancelled">
                      ✕ Ride Cancelled
                    </span>

                  )}

                </div>


              </div>

            ))}

          </div>

        )}

      </section>



      {/* =========================
          DRIVER HELP
      ========================== */}

      <section className="driver-help">

        <div>

          <span>
            🛡️
          </span>

          <div>

            <h3>
              Drive safely
            </h3>

            <p>
              Always follow traffic rules and keep
              your passenger safe.
            </p>

          </div>

        </div>


        <Link to="/">
          Support →
        </Link>

      </section>


    </div>

  );

}

export default DriverDashboard;
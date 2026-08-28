import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [cabs, setCabs] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // LOAD ADMIN DATA
  // =========================

  const loadDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      const [
        usersResponse,
        cabsResponse,
        bookingsResponse
      ] = await Promise.all([

        api.get("/users"),

        api.get("/cabs"),

        api.get("/bookings")

      ]);


      setUsers(usersResponse.data);
      setCabs(cabsResponse.data);
      setBookings(bookingsResponse.data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load admin dashboard"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadDashboard();

  }, []);


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="admin-dashboard-loading">

        <div className="loading-spinner"></div>

        <p>
          Loading admin dashboard...
        </p>

      </div>

    );

  }


  // =========================
  // ERROR
  // =========================

  if (error) {

    return (

      <div className="admin-dashboard-error">

        <h2>
          Unable to load dashboard
        </h2>

        <p>
          {error}
        </p>

        <button
          className="primary-btn"
          onClick={loadDashboard}
        >
          Try Again
        </button>

      </div>

    );

  }


  const availableCabs =
    cabs.filter(
      cab => cab.isAvailable
    ).length;


  const completedBookings =
    bookings.filter(
      booking =>
        booking.status === "completed"
    ).length;


  const activeBookings =
    bookings.filter(
      booking =>
        [
          "pending",
          "accepted",
          "ongoing"
        ].includes(booking.status)
    ).length;


  return (

    <div className="admin-dashboard">


      {/* =========================
          HEADER
      ========================== */}

      <section className="admin-welcome">

        <div>

          <p className="dashboard-label">
            ADMIN DASHBOARD
          </p>

          <h1>
            Welcome Admin 👋
          </h1>

          <p>
            Manage your CabGo platform from one place.
          </p>

        </div>

      </section>



      {/* =========================
          STATISTICS
      ========================== */}

      <section className="admin-stats">


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            👥
          </div>

          <div>

            <span>
              Total Users
            </span>

            <strong>
              {users.length}
            </strong>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🚕
          </div>

          <div>

            <span>
              Total Cabs
            </span>

            <strong>
              {cabs.length}
            </strong>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ✅
          </div>

          <div>

            <span>
              Available Cabs
            </span>

            <strong>
              {availableCabs}
            </strong>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            📋
          </div>

          <div>

            <span>
              Total Bookings
            </span>

            <strong>
              {bookings.length}
            </strong>

          </div>

        </div>

      </section>



      {/* =========================
          QUICK ACTIONS
      ========================== */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <p className="dashboard-label">
              MANAGEMENT
            </p>

            <h2>
              Quick Actions
            </h2>

          </div>

        </div>


        <div className="admin-action-grid">


          <Link
            to="/admin/cabs"
            className="admin-action-card"
          >

            <div className="action-icon">
              🚕
            </div>

            <div>

              <h3>
                Manage Cabs
              </h3>

              <p>
                Add, edit, delete and manage cab availability.
              </p>

            </div>

            <span>
              →
            </span>

          </Link>


          <Link
            to="/admin/users"
            className="admin-action-card"
          >

            <div className="action-icon">
              👥
            </div>

            <div>

              <h3>
                Manage Users
              </h3>

              <p>
                View customers, drivers and user roles.
              </p>

            </div>

            <span>
              →
            </span>

          </Link>


          <Link
            to="/admin/bookings"
            className="admin-action-card"
          >

            <div className="action-icon">
              📋
            </div>

            <div>

              <h3>
                Manage Bookings
              </h3>

              <p>
                View and manage all customer bookings.
              </p>

            </div>

            <span>
              →
            </span>

          </Link>

        </div>

      </section>



      {/* =========================
          BOOKING OVERVIEW
      ========================== */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <p className="dashboard-label">
              BOOKING OVERVIEW
            </p>

            <h2>
              Ride Statistics
            </h2>

          </div>

        </div>


        <div className="ride-stat-grid">


          <div className="ride-stat">

            <span className="ride-icon">
              🟡
            </span>

            <div>

              <strong>
                {activeBookings}
              </strong>

              <p>
                Active Rides
              </p>

            </div>

          </div>


          <div className="ride-stat">

            <span className="ride-icon">
              ✅
            </span>

            <div>

              <strong>
                {completedBookings}
              </strong>

              <p>
                Completed Rides
              </p>

            </div>

          </div>


          <div className="ride-stat">

            <span className="ride-icon">
              ❌
            </span>

            <div>

              <strong>
                {
                  bookings.filter(
                    booking =>
                      booking.status === "cancelled"
                  ).length
                }
              </strong>

              <p>
                Cancelled Rides
              </p>

            </div>

          </div>


        </div>

      </section>



      {/* =========================
          RECENT BOOKINGS
      ========================== */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <p className="dashboard-label">
              RECENT ACTIVITY
            </p>

            <h2>
              Recent Bookings
            </h2>

          </div>


          <Link
            to="/admin/bookings"
            className="admin-view-all"
          >
            View All →
          </Link>

        </div>


        {bookings.length === 0 ? (

          <div className="admin-empty">

            <div>
              📋
            </div>

            <h3>
              No bookings yet
            </h3>

            <p>
              Customer bookings will appear here.
            </p>

          </div>

        ) : (

          <div className="admin-booking-list">

            {bookings
              .slice(0, 5)
              .map((booking) => (

                <div
                  className="admin-booking-row"
                  key={booking._id}
                >


                  <div className="admin-booking-id">

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


                  <div>

                    <small>
                      Pickup
                    </small>

                    <strong>
                      {booking.pickup}
                    </strong>

                  </div>


                  <div>

                    <small>
                      Destination
                    </small>

                    <strong>
                      {booking.destination}
                    </strong>

                  </div>


                  <div>

                    <small>
                      Fare
                    </small>

                    <strong>
                      ₹{booking.fare}
                    </strong>

                  </div>


                  <span
                    className={`booking-status ${booking.status}`}
                  >
                    {booking.status}
                  </span>

                </div>

              ))}

          </div>

        )}

      </section>


    </div>

  );

}

export default AdminDashboard;
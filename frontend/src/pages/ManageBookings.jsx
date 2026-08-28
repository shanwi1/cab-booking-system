import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function ManageBookings() {

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [drivers, setDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState({});   


  // =========================
  // LOAD BOOKINGS
  // =========================
  
  const loadBookings = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get("/bookings");

      setBookings(response.data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load bookings"
      );

    } finally {

      setLoading(false);

    }

  };

  const loadDrivers = async () => {
  try {
    const response = await api.get("/users");

    setDrivers(
      response.data.filter(
        user => user.role === "driver"
      )
    );

  } catch (error) {
    console.error(error);
  }
};
  useEffect(() => {

    loadBookings();
    loadDrivers();

  }, []);

  const assignDriver = async (bookingId) => {

  const driverId = selectedDrivers[bookingId];

  if (!driverId) {
    alert("Please select a driver");
    return;
  }

  try {

    await api.put(
      `/bookings/${bookingId}/driver`,
      {
        driverId
      }
    );

    alert("Driver assigned successfully");

    loadBookings();

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Unable to assign driver"
    );
  }
};
  // =========================
  // CANCEL BOOKING
  // =========================

  const cancelBooking = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmed) return;


    try {

      await api.put(
        `/bookings/${id}/cancel`
      );

      loadBookings();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Unable to cancel booking"
      );

    }

  };


  // =========================
  // FILTER
  // =========================

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter(
          booking =>
            booking.status === filter
        );


  // =========================
  // COUNTS
  // =========================

  const pendingCount =
    bookings.filter(
      booking =>
        booking.status === "pending"
    ).length;

  const acceptedCount =
    bookings.filter(
      booking =>
        booking.status === "accepted"
    ).length;

  const ongoingCount =
    bookings.filter(
      booking =>
        booking.status === "ongoing"
    ).length;

  const completedCount =
    bookings.filter(
      booking =>
        booking.status === "completed"
    ).length;

  const cancelledCount =
    bookings.filter(
      booking =>
        booking.status === "cancelled"
    ).length;


  return (

    <div className="manage-bookings-page">


      {/* =========================
          HEADER
      ========================== */}

      <div className="admin-page-header">

        <div>

          <p className="dashboard-label">
            ADMIN PANEL
          </p>

          <h1>
            Manage Bookings 📋
          </h1>

          <p>
            View and manage all cab bookings.
          </p>

        </div>


        <Link
          to="/dashboard"
          className="back-dashboard"
        >
          ← Dashboard
        </Link>

      </div>



      {/* =========================
          ERROR
      ========================== */}

      {error && (

        <div className="admin-error">
          {error}
        </div>

      )}



      {/* =========================
          STATISTICS
      ========================== */}

      <section className="booking-stats">


        <div
          className="booking-stat-card"
          onClick={() => setFilter("all")}
        >

          <span>
            📋
          </span>

          <div>

            <small>
              All Bookings
            </small>

            <strong>
              {bookings.length}
            </strong>

          </div>

        </div>


        <div
          className="booking-stat-card"
          onClick={() => setFilter("pending")}
        >

          <span>
            🟡
          </span>

          <div>

            <small>
              Pending
            </small>

            <strong>
              {pendingCount}
            </strong>

          </div>

        </div>


        <div
          className="booking-stat-card"
          onClick={() => setFilter("accepted")}
        >

          <span>
            🔵
          </span>

          <div>

            <small>
              Accepted
            </small>

            <strong>
              {acceptedCount}
            </strong>

          </div>

        </div>


        <div
          className="booking-stat-card"
          onClick={() => setFilter("ongoing")}
        >

          <span>
            🟣
          </span>

          <div>

            <small>
              Ongoing
            </small>

            <strong>
              {ongoingCount}
            </strong>

          </div>

        </div>


        <div
          className="booking-stat-card"
          onClick={() => setFilter("completed")}
        >

          <span>
            🟢
          </span>

          <div>

            <small>
              Completed
            </small>

            <strong>
              {completedCount}
            </strong>

          </div>

        </div>


        <div
          className="booking-stat-card"
          onClick={() => setFilter("cancelled")}
        >

          <span>
            🔴
          </span>

          <div>

            <small>
              Cancelled
            </small>

            <strong>
              {cancelledCount}
            </strong>

          </div>

        </div>


      </section>



      {/* =========================
          BOOKING LIST
      ========================== */}

      <section className="bookings-list-card">


        <div className="bookings-list-header">

          <div>

            <h2>
              {filter === "all"
                ? "All Bookings"
                : `${filter} bookings`
              }
            </h2>

            <p>
              Showing {filteredBookings.length} booking(s)
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
            Loading bookings...
          </div>

        ) : filteredBookings.length === 0 ? (

          <div className="admin-empty">

            <div>
              📋
            </div>

            <h3>
              No bookings found
            </h3>

            <p>
              There are no bookings in this category.
            </p>

          </div>

        ) : (

          <div className="booking-admin-list">

            {filteredBookings.map(
              (booking) => (

                <div
                  className="booking-admin-card"
                  key={booking._id}
                >


                  {/* TOP */}

                  <div className="booking-admin-top">

                    <div className="admin-booking-id">

                      <span>
                        🚕
                      </span>

                      <div>

                        <strong>
                          #
                          {booking._id.slice(-6)}
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

                  <div className="admin-route">


                    <div className="admin-location">

                      <span className="admin-pickup-dot">
                        ●
                      </span>

                      <div>

                        <small>
                          Pickup
                        </small>

                        <strong>
                          {booking.pickup}
                        </strong>

                      </div>

                    </div>


                    <div className="admin-route-arrow">
                      →
                    </div>


                    <div className="admin-location">

                      <span className="admin-destination-dot">
                        ●
                      </span>

                      <div>

                        <small>
                          Destination
                        </small>

                        <strong>
                          {booking.destination}
                        </strong>

                      </div>

                    </div>


                  </div>



                  {/* DETAILS */}

                  <div className="booking-admin-details">

                        {/* CUSTOMER */}

                        <div>

                          <small>
                            Customer
                          </small>

                          <strong>
                            {booking.user?.name ||
                              booking.customer?.name ||
                              "Customer"}
                          </strong>

                          <span>
                            {booking.user?.email ||
                              booking.customer?.email ||
                              ""}
                          </span>

                        </div>


                        {/* CAB */}

                        <div>

                          <small>
                            Cab
                          </small>

                          <strong>
                            {booking.cab?.vehicleModel ||
                              "Cab"}
                          </strong>

                          <span>
                            {booking.cab?.vehicleNumber || ""}
                          </span>

                        </div>


                        {/* DRIVER */}

                        <div className="booking-driver">

                          <small>
                            Driver
                          </small>

                          <select
                            value={
                              selectedDrivers[booking._id] ||
                              booking.cab?.driver?._id ||
                              ""
                            }
                            onChange={(e) =>
                              setSelectedDrivers({
                                ...selectedDrivers,
                                [booking._id]: e.target.value
                              })
                            }
                          >

                            <option value="">
                              Select Driver
                            </option>

                            {drivers.map((driver) => (

                              <option
                                key={driver._id}
                                value={driver._id}
                              >
                                {driver.name}
                              </option>

                            ))}

                          </select>

                          <button
                            type="button"
                            onClick={() =>
                              assignDriver(booking._id)
                            }
                          >
                            Assign
                          </button>

                        </div>


                        {/* DISTANCE */}

                        <div>

                          <small>
                            Distance
                          </small>

                          <strong>
                            {booking.distance} km
                          </strong>

                        </div>


                        {/* FARE */}

                        <div>

                          <small>
                            Fare
                          </small>

                          <strong>
                            ₹{booking.fare}
                          </strong>

                        </div>


                    <div className="booking-driver">

                        <small>
                          Driver
                        </small>

                        <select
                          value={
                            selectedDrivers[booking._id] ||
                            booking.cab?.driver?._id ||
                            ""
                          }
                          onChange={(e) =>
                            setSelectedDrivers({
                              ...selectedDrivers,
                              [booking._id]: e.target.value
                            })
                          }
                        >

                          <option value="">
                            Select Driver
                          </option>

                          {drivers.map((driver) => (

                            <option
                              key={driver._id}
                              value={driver._id}
                            >
                              {driver.name}
                            </option>

                          ))}

                        </select>

                        <button
                          type="button"
                          onClick={() =>
                            assignDriver(booking._id)
                          }
                        >
                          Assign
                        </button>

                      </div>


                  </div>



                  {/* ACTIONS */}

                  <div className="booking-admin-actions">


                    <small>

                      Created:

                      {" "}

                      {booking.createdAt
                        ? new Date(
                            booking.createdAt
                          ).toLocaleString()
                        : "—"
                      }

                    </small>


                    {![
                      "completed",
                      "cancelled"
                    ].includes(
                      booking.status
                    ) && (

                      <button
                        className="cancel-admin-booking"
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

              )
            )}

          </div>

        )}

      </section>


    </div>

  );

}

export default ManageBookings;
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function CustomerDashboard({ user }) {

  const navigate = useNavigate();

  const [cabs, setCabs] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);


  // =========================
  // LOAD DASHBOARD
  // =========================

  const loadDashboard = async () => {

    try {

      const [cabResponse, bookingResponse] =
        await Promise.all([
          api.get("/cabs?available=true"),
          api.get("/bookings/my")
        ]);

      setCabs(cabResponse.data);
      setBookings(bookingResponse.data);

    } catch (error) {

      console.error(error);

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
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );

  }


  return (

    <div className="customer-dashboard">


      {/* =========================
          WELCOME
      ========================== */}

      <section className="dashboard-welcome">

        <div>

          <p className="dashboard-label">
            CUSTOMER DASHBOARD
          </p>

          <h1>
            Welcome, {user.name} 👋
          </h1>

          <p>
            Ready for your next journey?
          </p>

        </div>


        <button
          className="dashboard-book-btn"
          onClick={() =>
            navigate("/book-ride")
          }
        >
          🚕 Book a Ride
        </button>

      </section>



      {/* =========================
          STATISTICS
      ========================== */}

      <section className="customer-stats">


        <div className="customer-stat">

          <div className="stat-icon">
            🚕
          </div>

          <div>

            <span>
              Available Cabs
            </span>

            <strong>
              {cabs.length}
            </strong>

          </div>

        </div>


        <div className="customer-stat">

          <div className="stat-icon">
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
          AVAILABLE CABS
      ========================== */}

      <section className="dashboard-section">


        <div className="section-heading">

          <div>

            <p className="dashboard-label">
              AVAILABLE NOW
            </p>

            <h2>
              Choose Your Cab
            </h2>

          </div>


          {/* MY BOOKINGS */}

          <Link
            to="/my-bookings"
            className="dashboard-action-card"
          >

            <span>
              📋
            </span>

            <div>

              <h3>
                My Bookings
              </h3>

              <p>
                View your booking history
              </p>

            </div>

            <span>
              →
            </span>

          </Link>


        </div>



        {/* =========================
            NO CABS
        ========================== */}

        {cabs.length === 0 ? (

          <div className="empty-box">

            <div>
              🚕
            </div>

            <h3>
              No cabs available
            </h3>

            <p>
              Please check again later.
            </p>

          </div>

        ) : (


          /* =========================
             CAB GRID
          ========================== */

          <div className="cab-grid">

            {cabs.map((cab) => (

              <div
                className="customer-cab-card"
                key={cab._id}
              >


                {/* CAB TOP */}

                <div className="cab-top">

                  <div className="cab-image">
                    🚕
                  </div>

                  <span className="available-badge">
                    ● Available
                  </span>

                </div>



                {/* MODEL */}

                <h3>
                  {cab.vehicleModel}
                </h3>



                {/* VEHICLE NUMBER */}

                <p className="cab-number">
                  {cab.vehicleNumber}
                </p>



                {/* CAB INFO */}

                <div className="cab-info">

                  <span>
                    🚗 {cab.cabType}
                  </span>

                  <span>
                    👥 {cab.seats} seats
                  </span>

                </div>



                {/* PRICE */}

                <div className="cab-bottom">

                  <div>

                    <small>
                      Starting from
                    </small>

                    <strong>
                      ₹{cab.pricePerKm}
                      <span>/km</span>
                    </strong>

                  </div>


                  <button
                    onClick={() =>
                      navigate(
                        `/book-ride?cab=${cab._id}`
                      )
                    }
                  >
                    Book
                  </button>

                </div>


              </div>

            ))}

          </div>

        )}


      </section>


    </div>

  );

}

export default CustomerDashboard;
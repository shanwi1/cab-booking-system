import { useNavigate } from "react-router-dom";

function Profile({ user, setUser }) {

  const navigate = useNavigate();


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (setUser) {
      setUser(null);
    }

    navigate("/login");

  };


  // =========================
  // ROLE
  // =========================

  const getRoleName = () => {

    if (user?.role === "admin") {
      return "Administrator";
    }

    if (user?.role === "driver") {
      return "Driver";
    }

    return "Customer";

  };


  return (

    <div className="profile-page">


      {/* HEADER */}

      <div className="profile-header">

        <div>

          <p className="dashboard-label">
            ACCOUNT
          </p>

          <h1>
            My Profile 👤
          </h1>

          <p>
            Manage your account information.
          </p>

        </div>


        <button
          className="back-dashboard"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>

      </div>



      {/* PROFILE CARD */}

      <section className="profile-card">


        {/* AVATAR */}

        <div className="profile-top">

          <div className="profile-avatar">

            {user?.name
              ?.charAt(0)
              .toUpperCase() || "U"}

          </div>


          <div>

            <h2>
              {user?.name || "User"}
            </h2>

            <span
              className={`profile-role ${user?.role}`}
            >
              {getRoleName()}
            </span>

          </div>

        </div>



        {/* DETAILS */}

        <div className="profile-details">


          <div className="profile-detail">

            <small>
              FULL NAME
            </small>

            <strong>
              {user?.name || "Not available"}
            </strong>

          </div>


          <div className="profile-detail">

            <small>
              EMAIL
            </small>

            <strong>
              {user?.email || "Not available"}
            </strong>

          </div>


          <div className="profile-detail">

            <small>
              PHONE
            </small>

            <strong>
              {user?.phone || "Not available"}
            </strong>

          </div>


          <div className="profile-detail">

            <small>
              ACCOUNT TYPE
            </small>

            <strong>
              {getRoleName()}
            </strong>

          </div>


        </div>


      </section>



      {/* QUICK ACTIONS */}

      <section className="profile-actions-section">

        <p className="dashboard-label">
          QUICK ACTIONS
        </p>


        <div className="profile-action-grid">


          {user?.role !== "admin" && (

            <button
              className="profile-action"
              onClick={() =>
                navigate("/book-ride")
              }
            >

              <span>
                🚕
              </span>

              <div>

                <h3>
                  Book a Ride
                </h3>

                <p>
                  Find and book an available cab.
                </p>

              </div>

              <strong>
                →
              </strong>

            </button>

          )}



          {user?.role !== "driver" &&
           user?.role !== "admin" && (

            <button
              className="profile-action"
              onClick={() =>
                navigate("/my-bookings")
              }
            >

              <span>
                📋
              </span>

              <div>

                <h3>
                  My Bookings
                </h3>

                <p>
                  View your booking history.
                </p>

              </div>

              <strong>
                →
              </strong>

            </button>

          )}



          {user?.role === "driver" && (

            <button
              className="profile-action"
              onClick={() =>
                navigate("/dashboard")
              }
            >

              <span>
                🚕
              </span>

              <div>

                <h3>
                  Driver Dashboard
                </h3>

                <p>
                  Manage your assigned rides.
                </p>

              </div>

              <strong>
                →
              </strong>

            </button>

          )}



          {user?.role === "admin" && (

            <button
              className="profile-action"
              onClick={() =>
                navigate("/dashboard")
              }
            >

              <span>
                🛡️
              </span>

              <div>

                <h3>
                  Admin Dashboard
                </h3>

                <p>
                  Manage the CabGo platform.
                </p>

              </div>

              <strong>
                →
              </strong>

            </button>

          )}


        </div>

      </section>



      {/* LOGOUT */}

      <section className="logout-section">

        <div>

          <h3>
            Sign out
          </h3>

          <p>
            You will need to log in again to access your account.
          </p>

        </div>


        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </section>


    </div>

  );

}

export default Profile;
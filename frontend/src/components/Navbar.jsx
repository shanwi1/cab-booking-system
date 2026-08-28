import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");

  };


  return (

    <nav className="navbar">

      {/* LOGO */}

      <Link
        to="/"
        className="navbar-logo"
      >
        🚕 CabGo
      </Link>


      {/* NAVIGATION */}

      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>


        {user && (

          <Link to="/dashboard">
            Dashboard
          </Link>

        )}


        {user && (

          <Link to="/profile">
            Profile
          </Link>

        )}


        {user && user.role === "user" && (

          <Link to="/my-bookings">
            My Bookings
          </Link>

        )}


        {user && (

          <span className="navbar-role">
            {user.role === "user"
              ? "Customer"
              : user.role}
          </span>

        )}


        {!user && (

          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>

        )}


        {user && (

          <button
            className="navbar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        )}

      </div>

    </nav>

  );

}

export default Navbar;
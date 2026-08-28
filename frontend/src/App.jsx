import { useEffect, useState } from "react";

import {
  Link,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import api from "./api";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import BookRide from "./pages/BookRide";
import ManageCabs from "./pages/ManageCabs";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageBookings from "./pages/ManageBookings";
import DriverDashboard from "./pages/DriverDashboard";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";



function App() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  // =========================
  // CHECK LOGIN
  // =========================

  useEffect(() => {

    const token =
      localStorage.getItem("token");


    if (!token) {

      setLoading(false);

      return;

    }


    api.get("/auth/me")

      .then((response) => {

        setUser(response.data.user);

      })

      .catch(() => {

        localStorage.removeItem("token");

        setUser(null);

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="loading">
        Loading...
      </div>
    );

  }


  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    localStorage.removeItem("token");

    setUser(null);

  };


  return (

    <>


    <Navbar
      user={user}
      setUser={setUser}
    />

      {/* ROUTES */}

      <main className="container">

        <Routes>


          {/* HOME */}

          <Route
            path="/"
            element={
              <Home user={user} />
            }
          />


          {/* LOGIN */}

          <Route
            path="/login"
            element={
              <Login
                setUser={setUser}
              />
            }
          />


          {/* REGISTER */}

          <Route
            path="/register"
            element={
              <Register
                setUser={setUser}
              />
            }
          />
          <Route
              path="/profile"
              element={
                user ? (
                  <Profile
                    user={user}
                    setUser={setUser}
                  />
                ) : (
                  <Navigate
                    to="/login"
                    replace
                  />
                )
              }
            />

          {/* CUSTOMER DASHBOARD */}

     <Route
            path="/dashboard"
            element={
              user ? (

                user.role === "admin" ? (

                  <AdminDashboard />

                ) : user.role === "driver" ? (

                  <DriverDashboard
                    user={user}
                  />

                ) : (

                  <CustomerDashboard
                    user={user}
                  />

                )

              ) : (

                <Navigate
                  to="/login"
                  replace
                />

              )
            }
          />
          <Route
              path="/my-bookings"
              element={
                user ? (
                  user.role === "admin" ? (
                    <Navigate to="/dashboard" replace />
                  ) : user.role === "driver" ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <MyBookings />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          <Route
              path="/book-ride"
              element={
                user ? (
                  <BookRide />
                ) : (
                  <Navigate
                    to="/login"
                    replace
                  />
                )
              }
            />
          <Route
              path="/admin/cabs"
              element={
                user && user.role === "admin" ? (
                  <ManageCabs />
                ) : (
                  <Navigate
                    to="/login"
                    replace
                  />
                )
              }
            />
            <Route
              path="/admin/users"
              element={
                user && user.role === "admin" ? (
                  <ManageUsers />
                ) : (
                  <Navigate
                    to="/login"
                    replace
                  />
                )
              }
            />
            <Route
              path="/admin/bookings"
              element={
                user && user.role === "admin" ? (
                  <ManageBookings />
                ) : (
                  <Navigate
                    to="/login"
                    replace
                  />
                )
              }
            />
          

          {/* UNKNOWN PAGE */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </main>

    </>

  );

}


export default App;
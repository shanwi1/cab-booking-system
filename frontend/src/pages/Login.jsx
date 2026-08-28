import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login({ setUser }) {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await api.post(
        "/auth/login",
        form
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      setUser(response.data.user);

      navigate("/dashboard");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Invalid email or password"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="login-page">

      <div className="login-left">

        <div className="login-brand">
          🚕
        </div>

        <h1>
          Welcome Back!
        </h1>

        <p>
          Login to CabGo and book your next
          ride quickly and safely.
        </p>

        <div className="login-feature">
          <span>✓</span>
          <p>Quick and easy cab booking</p>
        </div>

        <div className="login-feature">
          <span>✓</span>
          <p>Track your ride status</p>
        </div>

        <div className="login-feature">
          <span>✓</span>
          <p>Safe and reliable drivers</p>
        </div>

      </div>


      <div className="login-card">

        <h2>
          Login
        </h2>

        <p className="login-subtitle">
          Enter your account details
        </p>


        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />

          </div>


          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>


        <p className="register-text">

          Don't have an account?

          <Link to="/register">
            {" "}Create Account
          </Link>

        </p>


        <Link
          to="/"
          className="back-home"
        >
          ← Back to Home
        </Link>

      </div>

    </div>

  );
}

export default Login;
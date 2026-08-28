import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Register({ setUser }) {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
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


    if (
      form.password !==
      form.confirmPassword
    ) {

      setError("Passwords do not match");

      return;

    }


    if (form.password.length < 6) {

      setError(
        "Password must contain at least 6 characters"
      );

      return;

    }


    setLoading(true);


    try {

      const response = await api.post(
        "/auth/register",
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password
        }
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
        "Registration failed"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="register-page">

      <div className="register-card">

        <div className="register-icon">
          🚕
        </div>

        <h1>
          Create Account
        </h1>

        <p className="register-subtitle">
          Join CabGo and start booking rides.
        </p>


        {error && (
          <div className="register-error">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />

          </div>


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
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
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
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
              minLength="6"
            />

          </div>


          <div className="form-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

          </div>


          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Create Account"
            }

          </button>

        </form>


        <p className="login-text">

          Already have an account?

          <Link to="/login">
            {" "}Login
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

export default Register;
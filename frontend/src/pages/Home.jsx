import { Link } from "react-router-dom";

function Home({ user }) {
  return (
    <>
      {/* HERO */}

      <section className="hero-section">

        <div className="hero-left">

          <p className="tag">
            🚕 FAST • SAFE • RELIABLE
          </p>

          <h1>
            Your Ride,
            <br />
            Your Way.
          </h1>

          <p>
            Book affordable and comfortable rides
            anywhere, anytime with CabGo.
          </p>

          <div className="hero-buttons">

            <Link
              className="btn-primary"
              to={user ? "/dashboard" : "/login"}
            >
              Book a Ride
            </Link>

            <Link
              className="btn-secondary"
              to="/register"
            >
              Get Started
            </Link>

          </div>

        </div>


        <div className="hero-right">

          <div className="cab-card">

            <div className="cab-icon">
              🚕
            </div>

            <h2>
              CabGo
            </h2>

            <p>
              Comfortable rides at transparent fares.
            </p>

            <div className="price-box">

              <span>
                Starting From
              </span>

              <h3>
                ₹12/km
              </h3>

            </div>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="features">

        <h2>
          Why Choose CabGo?
        </h2>

        <div className="feature-grid">

          <div className="feature-card">

            <div className="icon">
              🚖
            </div>

            <h3>
              Easy Booking
            </h3>

            <p>
              Book your cab quickly with our
              simple interface.
            </p>

          </div>


          <div className="feature-card">

            <div className="icon">
              💰
            </div>

            <h3>
              Affordable
            </h3>

            <p>
              Transparent pricing with no hidden charges.
            </p>

          </div>


          <div className="feature-card">

            <div className="icon">
              🛡️
            </div>

            <h3>
              Safe Rides
            </h3>

            <p>
              Reliable drivers and secure journeys.
            </p>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section className="steps">

        <h2>
          How It Works
        </h2>

        <div className="step-grid">

          <div className="step">

            <div className="number">
              1
            </div>

            <h3>
              Choose Ride
            </h3>

            <p>
              Select the cab that suits your journey.
            </p>

          </div>


          <div className="step">

            <div className="number">
              2
            </div>

            <h3>
              Enter Location
            </h3>

            <p>
              Enter your pickup and destination.
            </p>

          </div>


          <div className="step">

            <div className="number">
              3
            </div>

            <h3>
              Enjoy Journey
            </h3>

            <p>
              Sit back and enjoy your comfortable ride.
            </p>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="footer">

        <h2>
          🚕 CabGo
        </h2>

        <p>
          Making every journey comfortable,
          affordable and safe.
        </p>

        <small>
          © 2026 CabGo. All rights reserved.
        </small>

      </footer>

    </>
  );
}

export default Home;
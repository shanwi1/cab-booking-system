import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";

function BookRide() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedCabId = searchParams.get("cab");

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const [distance, setDistance] = useState("");

  const [cabs, setCabs] = useState([]);
  const [selectedCab, setSelectedCab] = useState(
    selectedCabId || ""
  );

  const [fare, setFare] = useState(0);

  const [loadingCabs, setLoadingCabs] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =========================
  // LOAD AVAILABLE CABS
  // =========================

  const loadCabs = async () => {

    try {

      setLoadingCabs(true);
      setError("");

      const response =
        await api.get("/cabs?available=true");

      setCabs(response.data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load available cabs"
      );

    } finally {

      setLoadingCabs(false);

    }

  };


  useEffect(() => {

    loadCabs();

  }, []);


  // =========================
  // CALCULATE FARE
  // =========================

  useEffect(() => {

    if (!distance || !selectedCab) {

      setFare(0);
      return;

    }

    const cab = cabs.find(
      cab => cab._id === selectedCab
    );

    if (!cab) {

      setFare(0);
      return;

    }

    const calculatedFare =
      Number(distance) *
      Number(cab.pricePerKm);

    setFare(
      Math.round(calculatedFare)
    );

  }, [
    distance,
    selectedCab,
    cabs
  ]);


  // =========================
  // SELECT CAB
  // =========================

  const handleCabSelect = (cabId) => {

    setSelectedCab(cabId);

  };


  // =========================
  // BOOK RIDE
  // =========================

  const handleBooking = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    if (!pickup.trim()) {

      setError(
        "Please enter pickup location."
      );

      return;

    }


    if (!destination.trim()) {

      setError(
        "Please enter destination."
      );

      return;

    }


    if (pickup.trim().toLowerCase() ===
        destination.trim().toLowerCase()) {

      setError(
        "Pickup and destination cannot be the same."
      );

      return;

    }


    if (!distance || Number(distance) <= 0) {

      setError(
        "Please enter a valid distance."
      );

      return;

    }


    if (!selectedCab) {

      setError(
        "Please select a cab."
      );

      return;

    }


    try {

      setBooking(true);


      const response = await api.post(
        "/bookings",
        {
            cabId: selectedCab,
            pickup: pickup.trim(),
            destination: destination.trim(),
            distance: Number(distance)
        }
        );

      setSuccess(
        "Your cab has been booked successfully!"
      );


      setTimeout(() => {

        navigate("/my-bookings");

      }, 1200);


    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to create booking"
      );

    } finally {

      setBooking(false);

    }

  };


  return (

    <div className="book-ride-page">


      {/* =========================
          HEADER
      ========================== */}

      <div className="book-ride-header">

        <div>

          <p className="dashboard-label">
            CAB BOOKING
          </p>

          <h1>
            Book Your Ride 🚕
          </h1>

          <p>
            Enter your journey details and choose your cab.
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



      {/* =========================
          ERROR
      ========================== */}

      {error && (

        <div className="booking-error">
          {error}
        </div>

      )}


      {/* =========================
          SUCCESS
      ========================== */}

      {success && (

        <div className="booking-success">
          ✓ {success}
        </div>

      )}



      <div className="booking-layout">


        {/* =========================
            LEFT SIDE
        ========================== */}

        <div className="booking-form-section">


          {/* JOURNEY DETAILS */}

          <section className="booking-card">

            <div className="booking-card-heading">

              <span>
                1
              </span>

              <div>

                <h2>
                  Journey Details
                </h2>

                <p>
                  Where would you like to go?
                </p>

              </div>

            </div>


            <div className="location-inputs">


              {/* PICKUP */}

              <div className="location-input-group">

                <label>
                  Pickup Location
                </label>

                <div className="location-input">

                  <span className="pickup-marker">
                    ●
                  </span>

                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    value={pickup}
                    onChange={(e) =>
                      setPickup(e.target.value)
                    }
                  />

                </div>

              </div>


              <div className="location-connector"></div>


              {/* DESTINATION */}

              <div className="location-input-group">

                <label>
                  Destination
                </label>

                <div className="location-input">

                  <span className="destination-marker">
                    ●
                  </span>

                  <input
                    type="text"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) =>
                      setDestination(e.target.value)
                    }
                  />

                </div>

              </div>


            </div>


            {/* DISTANCE */}

            <div className="distance-section">

              <label>
                Distance
              </label>

              <div className="distance-input">

                <input
                  type="number"
                  min="1"
                  step="0.1"
                  placeholder="Enter distance"
                  value={distance}
                  onChange={(e) =>
                    setDistance(e.target.value)
                  }
                />

                <span>
                  km
                </span>

              </div>

              <small>
                Enter the estimated distance between pickup
                and destination.
              </small>

            </div>


          </section>



          {/* CAB SELECTION */}

          <section className="booking-card">

            <div className="booking-card-heading">

              <span>
                2
              </span>

              <div>

                <h2>
                  Choose Your Cab
                </h2>

                <p>
                  Select an available vehicle.
                </p>

              </div>

            </div>


            {loadingCabs ? (

              <div className="booking-loading">
                Loading available cabs...
              </div>

            ) : cabs.length === 0 ? (

              <div className="booking-empty">

                <div>
                  🚕
                </div>

                <h3>
                  No cabs available
                </h3>

                <p>
                  Please try again later.
                </p>

                <button
                  onClick={loadCabs}
                >
                  Refresh
                </button>

              </div>

            ) : (

              <div className="booking-cab-list">

                {cabs.map((cab) => (

                  <div
                    key={cab._id}
                    className={
                      selectedCab === cab._id
                        ? "booking-cab selected"
                        : "booking-cab"
                    }
                    onClick={() =>
                      handleCabSelect(
                        cab._id
                      )
                    }
                  >


                    <div className="booking-cab-icon">
                      🚕
                    </div>


                    <div className="booking-cab-info">

                      <h3>
                        {cab.vehicleModel}
                      </h3>

                      <p>
                        {cab.vehicleNumber}
                      </p>

                      <div>

                        <span>
                          {cab.cabType}
                        </span>

                        <span>
                          {cab.seats} seats
                        </span>

                      </div>

                    </div>


                    <div className="booking-cab-price">

                      <small>
                        Rate
                      </small>

                      <strong>
                        ₹{cab.pricePerKm}
                        <span>/km</span>
                      </strong>

                    </div>


                    <div className="cab-radio">

                      {selectedCab ===
                        cab._id && (
                        <span>
                          ✓
                        </span>
                      )}

                    </div>


                  </div>

                ))}

              </div>

            )}

          </section>

        </div>



        {/* =========================
            RIGHT SIDE
        ========================== */}

        <aside className="booking-summary">


          <div className="summary-card">

            <h2>
              Booking Summary
            </h2>


            <div className="summary-route">

              <div className="summary-location">

                <span className="pickup-marker">
                  ●
                </span>

                <div>

                  <small>
                    PICKUP
                  </small>

                  <strong>
                    {pickup || "Not selected"}
                  </strong>

                </div>

              </div>


              <div className="summary-line"></div>


              <div className="summary-location">

                <span className="destination-marker">
                  ●
                </span>

                <div>

                  <small>
                    DESTINATION
                  </small>

                  <strong>
                    {destination || "Not selected"}
                  </strong>

                </div>

              </div>

            </div>


            <div className="summary-divider"></div>


            <div className="summary-row">

              <span>
                Distance
              </span>

              <strong>
                {distance
                  ? `${distance} km`
                  : "—"
                }
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Selected Cab
              </span>

              <strong>

                {cabs.find(
                  cab =>
                    cab._id === selectedCab
                )?.vehicleModel ||
                  "—"
                }

              </strong>

            </div>


            <div className="summary-row">

              <span>
                Rate
              </span>

              <strong>

                {cabs.find(
                  cab =>
                    cab._id === selectedCab
                )?.pricePerKm
                  ? `₹${
                      cabs.find(
                        cab =>
                          cab._id === selectedCab
                      ).pricePerKm
                    }/km`
                  : "—"
                }

              </strong>

            </div>


            <div className="summary-divider"></div>


            <div className="summary-total">

              <span>
                Estimated Fare
              </span>

              <strong>
                ₹{fare}
              </strong>

            </div>


            <button
              className="confirm-booking-btn"
              onClick={handleBooking}
              disabled={booking}
            >

              {booking
                ? "Booking..."
                : "🚕 Confirm Booking"
              }

            </button>


            <p className="fare-note">
              Final fare may vary based on the actual
              journey.
            </p>

          </div>


        </aside>


      </div>


    </div>

  );

}

export default BookRide;
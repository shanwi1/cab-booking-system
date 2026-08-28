import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function ManageCabs() {

  const [cabs, setCabs] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState({});

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleModel: "",
    cabType: "Sedan",
    seats: 4,
    pricePerKm: ""
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  // =========================
  // GET CABS
  // =========================

  const loadCabs = async () => {

    try {

      const response = await api.get("/cabs");

      setCabs(response.data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load cabs"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadCabs();
    loadDrivers();

  }, []);

  // =========================
// GET DRIVERS
// =========================

const loadDrivers = async () => {

  try {

    const response = await api.get("/users");

    const driverUsers = response.data.filter(
      (user) => user.role === "driver"
    );

    setDrivers(driverUsers);

  } catch (error) {

    console.error("Unable to load drivers", error);

  }

};
  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  // =========================
  // ADD / UPDATE CAB
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setSaving(true);


    try {

      if (editingId) {

        await api.put(
          `/cabs/${editingId}`,
          form
        );

      } else {

        await api.post(
          "/cabs",
          form
        );

      }


      resetForm();

      loadCabs();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to save cab"
      );

    } finally {

      setSaving(false);

    }

  };


  // =========================
  // EDIT
  // =========================

  const editCab = (cab) => {

    setEditingId(cab._id);

    setForm({
      vehicleNumber: cab.vehicleNumber || "",
      vehicleModel: cab.vehicleModel || "",
      cabType: cab.cabType || "Sedan",
      seats: cab.seats || 4,
      pricePerKm: cab.pricePerKm || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // =========================
  // DELETE
  // =========================

  const deleteCab = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this cab?"
      );

    if (!confirmed) return;


    try {

      await api.delete(
        `/cabs/${id}`
      );

      loadCabs();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Unable to delete cab"
      );

    }

  };


  // =========================
  // TOGGLE AVAILABILITY
  // =========================

  const toggleAvailability = async (cab) => {

    try {

      await api.put(
        `/cabs/${cab._id}`,
        {
          isAvailable: !cab.isAvailable
        }
      );

      loadCabs();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Unable to update availability"
      );

    }

  };

  // =========================
// ASSIGN DRIVER
// =========================

const assignDriver = async (cabId) => {

  const driverId = selectedDrivers[cabId];

  if (!driverId) {
    alert("Please select a driver");
    return;
  }

  try {

    await api.put(
      `/cabs/${cabId}/driver`,
      {
        driverId
      }
    );

    alert("Driver assigned successfully");

    loadCabs();

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Unable to assign driver"
    );

  }

};
  // =========================
  // RESET
  // =========================

  const resetForm = () => {

    setEditingId(null);

    setForm({
      vehicleNumber: "",
      vehicleModel: "",
      cabType: "Sedan",
      seats: 4,
      pricePerKm: ""
    });

  };


  return (

    <div className="manage-cabs-page">


      {/* HEADER */}

      <div className="admin-page-header">

        <div>

          <p className="dashboard-label">
            ADMIN PANEL
          </p>

          <h1>
            Cab Management 🚕
          </h1>

          <p>
            Add and manage all vehicles in CabGo.
          </p>

        </div>


        <Link
          to="/dashboard"
          className="back-dashboard"
        >
          ← Dashboard
        </Link>

      </div>



      {/* ERROR */}

      {error && (

        <div className="admin-error">
          {error}
        </div>

      )}



      {/* ADD / EDIT FORM */}

      <section className="admin-form-card">

        <div className="admin-card-header">

          <div>

            <h2>
              {editingId
                ? "Edit Cab"
                : "Add New Cab"
              }
            </h2>

            <p>
              Enter vehicle information below.
            </p>

          </div>


          {editingId && (

            <button
              className="cancel-edit-btn"
              onClick={resetForm}
            >
              Cancel Edit
            </button>

          )}

        </div>


        <form
          className="cab-form"
          onSubmit={handleSubmit}
        >


          <div className="form-group">

            <label>
              Vehicle Number
            </label>

            <input
              type="text"
              name="vehicleNumber"
              placeholder="KA01AB1234"
              value={form.vehicleNumber}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              Vehicle Model
            </label>

            <input
              type="text"
              name="vehicleModel"
              placeholder="Swift Dzire"
              value={form.vehicleModel}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              Cab Type
            </label>

            <select
              name="cabType"
              value={form.cabType}
              onChange={handleChange}
            >

              <option value="Mini">
                Mini
              </option>

              <option value="Sedan">
                Sedan
              </option>

              <option value="SUV">
                SUV
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>
              Seats
            </label>

            <input
              type="number"
              name="seats"
              min="1"
              max="10"
              value={form.seats}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              Price per KM
            </label>

            <input
              type="number"
              name="pricePerKm"
              min="1"
              step="0.01"
              placeholder="15"
              value={form.pricePerKm}
              onChange={handleChange}
              required
            />

          </div>


          <button
            type="submit"
            className="add-cab-btn"
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : editingId
                ? "Update Cab"
                : "Add Cab"
            }

          </button>


        </form>

      </section>



      {/* CAB LIST */}

      <section className="admin-list-card">

        <div className="admin-card-header">

          <div>

            <h2>
              All Cabs
            </h2>

            <p>
              {cabs.length} vehicle(s) registered
            </p>

          </div>

        </div>


        {loading ? (

          <div className="admin-loading">
            Loading cabs...
          </div>

        ) : cabs.length === 0 ? (

          <div className="admin-empty">

            <div>
              🚕
            </div>

            <h3>
              No cabs registered
            </h3>

            <p>
              Add your first cab using the form above.
            </p>

          </div>

        ) : (

          <div className="cab-table-wrapper">

            <table className="cab-table">

              <thead>

                <tr>

                  <th>Vehicle</th>

                  <th>Type</th>

                  <th>Seats</th>

                  <th>Price</th>

                  <th>Status</th>

                  <th>Driver</th>

                  <th>Actions</th>

                </tr>

              </thead>


              <tbody>

                {cabs.map((cab) => (

                  <tr key={cab._id}>

                    <td>

                      <div className="vehicle-cell">

                        <span>
                          🚕
                        </span>

                        <div>

                          <strong>
                            {cab.vehicleModel}
                          </strong>

                          <small>
                            {cab.vehicleNumber}
                          </small>

                        </div>

                      </div>

                    </td>


                    <td>
                      {cab.cabType}
                    </td>


                    <td>
                      {cab.seats}
                    </td>


                    <td>
                      ₹{cab.pricePerKm}/km
                    </td>


                    <td>

                    <div className="driver-assignment">

                      <select
                        value={
                          selectedDrivers[cab._id] ||
                          cab.driver?._id ||
                          ""
                        }
                        onChange={(e) =>
                          setSelectedDrivers({
                            ...selectedDrivers,
                            [cab._id]: e.target.value
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
                        className="assign-driver-btn"
                        onClick={() =>
                          assignDriver(cab._id)
                        }
                      >
                        Assign
                      </button>

                    </div>

                  </td>


                    <td>

                      <div className="cab-actions">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            editCab(cab)
                          }
                        >
                          Edit
                        </button>


                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteCab(cab._id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>


    </div>

  );

}

export default ManageCabs;
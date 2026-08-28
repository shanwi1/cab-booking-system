import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function ManageUsers() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // LOAD USERS
  // =========================

  const loadUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get("/users");

      setUsers(response.data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load users"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadUsers();

  }, []);


  // =========================
  // CHANGE ROLE
  // =========================

  const changeRole = async (id, role) => {

    try {

      await api.put(
        `/users/${id}/role`,
        { role }
      );

      loadUsers();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Unable to update user role"
      );

    }

  };


  // =========================
  // DELETE USER
  // =========================

  const deleteUser = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmed) return;


    try {

      await api.delete(
        `/users/${id}`
      );

      loadUsers();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Unable to delete user"
      );

    }

  };


  // =========================
  // ROLE CLASS
  // =========================

  const getRoleClass = (role) => {

    if (role === "admin") {
      return "role-admin";
    }

    if (role === "driver") {
      return "role-driver";
    }

    return "role-user";

  };


  return (

    <div className="manage-users-page">


      {/* HEADER */}

      <div className="admin-page-header">

        <div>

          <p className="dashboard-label">
            ADMIN PANEL
          </p>

          <h1>
            Manage Users 👥
          </h1>

          <p>
            View and manage all CabGo users.
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



      {/* USER STATISTICS */}

      <div className="user-stats">


        <div className="user-stat-card">

          <span>
            👥
          </span>

          <div>

            <small>
              Total Users
            </small>

            <strong>
              {users.length}
            </strong>

          </div>

        </div>


        <div className="user-stat-card">

          <span>
            👤
          </span>

          <div>

            <small>
              Customers
            </small>

            <strong>
              {
                users.filter(
                  user =>
                    user.role === "user" ||
                    user.role === "customer"
                ).length
              }
            </strong>

          </div>

        </div>


        <div className="user-stat-card">

          <span>
            🚕
          </span>

          <div>

            <small>
              Drivers
            </small>

            <strong>
              {
                users.filter(
                  user =>
                    user.role === "driver"
                ).length
              }
            </strong>

          </div>

        </div>


        <div className="user-stat-card">

          <span>
            🛡️
          </span>

          <div>

            <small>
              Admins
            </small>

            <strong>
              {
                users.filter(
                  user =>
                    user.role === "admin"
                ).length
              }
            </strong>

          </div>

        </div>


      </div>



      {/* USERS LIST */}

      <section className="users-list-card">

        <div className="admin-card-header">

          <div>

            <h2>
              All Users
            </h2>

            <p>
              Manage registered users and their roles.
            </p>

          </div>


          <button
            className="refresh-btn"
            onClick={loadUsers}
          >
            ↻ Refresh
          </button>

        </div>



        {loading ? (

          <div className="admin-loading">
            Loading users...
          </div>

        ) : users.length === 0 ? (

          <div className="admin-empty">

            <div>
              👥
            </div>

            <h3>
              No users found
            </h3>

            <p>
              Registered users will appear here.
            </p>

          </div>

        ) : (

          <div className="users-table-wrapper">

            <table className="users-table">

              <thead>

                <tr>

                  <th>
                    User
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Change Role
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {users.map((user) => (

                  <tr key={user._id}>


                    {/* USER */}

                    <td>

                      <div className="user-cell">

                        <div className="user-avatar">
                          {user.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {user.name}
                          </strong>

                          <small>
                            {user.email}
                          </small>

                        </div>

                      </div>

                    </td>


                    {/* PHONE */}

                    <td>
                      {user.phone || "—"}
                    </td>


                    {/* ROLE */}

                    <td>

                      <span
                        className={`user-role ${getRoleClass(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>

                    </td>


                    {/* CHANGE ROLE */}

                    <td>

                      <select
                        className="role-select"
                        value={user.role}
                        onChange={(e) =>
                          changeRole(
                            user._id,
                            e.target.value
                          )
                        }
                      >

                        <option value="user">
                          User
                        </option>

                        <option value="customer">
                          Customer
                        </option>

                        <option value="driver">
                          Driver
                        </option>

                        <option value="admin">
                          Admin
                        </option>

                      </select>

                    </td>


                    {/* DELETE */}

                    <td>

                      <button
                        className="delete-user-btn"
                        onClick={() =>
                          deleteUser(
                            user._id
                          )
                        }
                      >
                        Delete
                      </button>

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

export default ManageUsers;
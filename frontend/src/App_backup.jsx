import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    address: "",
    service: "",
    date: "",
    time: "",
  });

  const [bookings, setBookings] = useState([]);

  const [adminLogin, setAdminLogin] = useState({
    username: "",
    password: "",
  });

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // =========================
  // LOAD BOOKINGS
  // =========================

  const loadBookings = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/bookings"
      );

      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }

      const data = await response.json();

      setBookings(data);
    } catch (error) {
      console.error("Loading Error:", error);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn && showAdmin) {
      loadBookings();
    }
  }, [isAdminLoggedIn, showAdmin]);

  // =========================
  // CREATE BOOKING
  // =========================

  const handleBooking = async () => {
    if (
      !booking.name ||
      !booking.phone ||
      !booking.address ||
      !booking.service ||
      !booking.date ||
      !booking.time
    ) {
      alert("Please fill all booking details.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(booking),
        }
      );

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      alert("Booking confirmed successfully!");

      setBooking({
        name: "",
        phone: "",
        address: "",
        service: "",
        date: "",
        time: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Booking Error:", error);

      alert("Booking failed. Please try again.");
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================

  const updateBookingStatus = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      await loadBookings();
    } catch (error) {
      console.error("Status Error:", error);

      alert("Could not update booking status.");
    }
  };

  // =========================
  // DELETE BOOKING
  // =========================

  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      await loadBookings();

      alert("Booking deleted successfully.");
    } catch (error) {
      console.error("Delete Error:", error);

      alert("Could not delete booking.");
    }
  };

  // =========================
  // ADMIN LOGIN
  // =========================

  const handleAdminLogin = () => {
    if (
      adminLogin.username === "rajdhanicare" &&
      adminLogin.password === "subhambharat1209"
    ) {
      setIsAdminLoggedIn(true);
      setShowLogin(false);
      setShowAdmin(true);

      setAdminLogin({
        username: "",
        password: "",
      });

      loadBookings();
    } else {
      alert("Invalid username or password!");
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setShowAdmin(false);
  };

  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {
    if (status === "CONFIRMED") {
      return "status-confirmed";
    }

    if (status === "CANCELLED") {
      return "status-cancelled";
    }

    if (status === "COMPLETED") {
      return "status-completed";
    }

    return "status-pending";
  };

  // =========================
  // STATISTICS
  // =========================

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (item) => !item.status || item.status === "PENDING"
  ).length;

  const confirmedBookings = bookings.filter(
    (item) => item.status === "CONFIRMED"
  ).length;

  const completedBookings = bookings.filter(
    (item) => item.status === "COMPLETED"
  ).length;

  const cancelledBookings = bookings.filter(
    (item) => item.status === "CANCELLED"
  ).length;

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredBookings = bookings.filter((item) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      item.name?.toLowerCase().includes(search) ||
      item.phone?.toLowerCase().includes(search) ||
      item.service?.toLowerCase().includes(search);

    const currentStatus = item.status || "PENDING";

    const matchesStatus =
      statusFilter === "ALL" ||
      currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>

      {/* =========================
          NAVBAR
      ========================= */}

      <nav>
        <h2>🏠 Rajdhani Care</h2>

        <div>
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>

          {!isAdminLoggedIn ? (
            <button onClick={() => setShowLogin(true)}>
              🔐 Admin
            </button>
          ) : (
            <button onClick={() => setShowAdmin(true)}>
              📋 Dashboard
            </button>
          )}
        </div>
      </nav>

      {/* =========================
          HERO
      ========================= */}

      <section id="home">
        <h1>Care at Your Doorstep ❤️</h1>

        <p>
          आपकी रोज़मर्रा की जरूरतों के लिए
          भरोसेमंद घरेलू सेवाएं।
        </p>

        <button onClick={() => setShowForm(true)}>
          Book a Service
        </button>
      </section>

      {/* =========================
          SERVICES
      ========================= */}

      <section id="services">
        <h2>Our Services</h2>

        <div>
          <div>
            <h3>💄 Beauty & Makeup</h3>
            <p>
              Professional beauty services
              at your doorstep.
            </p>
          </div>

          <div>
            <h3>🧹 Home Cleaning</h3>
            <p>
              Keep your home clean
              and comfortable.
            </p>
          </div>

          <div>
            <h3>🍱 Cooking & Tiffin</h3>
            <p>
              Fresh and convenient food
              services.
            </p>
          </div>

          <div>
            <h3>👶 Baby Care</h3>
            <p>
              Trusted care and support
              for your little ones.
            </p>
          </div>

          <div>
            <h3>👵 Elderly Care</h3>
            <p>
              Friendly assistance for
              elderly family members.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          ABOUT
      ========================= */}

      <section id="about">
        <h2>About Rajdhani Care</h2>

        <p>
          Rajdhani Care provides convenient
          home services for families in
          Bhubaneswar, Odisha.
        </p>
      </section>

      {/* =========================
          CONTACT
      ========================= */}

      <section id="contact">
        <h2>Book Your Service</h2>

        <p>📍 Bhubaneswar, Odisha</p>

        <p>
          📲 Contact us to book a service.
        </p>

        <button onClick={() => setShowForm(true)}>
          Book Now
        </button>
      </section>

      {/* =========================
          BOOKING FORM
      ========================= */}

      {showForm && (
        <div className="booking-overlay">
          <div className="booking-form">

            <button
              className="close-btn"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>

            <h2>Book a Service</h2>

            <input
              type="text"
              placeholder="Your Name"
              value={booking.name}
              onChange={(e) =>
                setBooking({
                  ...booking,
                  name: e.target.value,
                })
              }
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={booking.phone}
              onChange={(e) =>
                setBooking({
                  ...booking,
                  phone: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Your Address"
              value={booking.address}
              onChange={(e) =>
                setBooking({
                  ...booking,
                  address: e.target.value,
                })
              }
            />

            <select
              value={booking.service}
              onChange={(e) =>
                setBooking({
                  ...booking,
                  service: e.target.value,
                })
              }
            >
              <option value="">
                Select a Service
              </option>

              <option value="Beauty & Makeup">
                Beauty & Makeup
              </option>

              <option value="Home Cleaning">
                Home Cleaning
              </option>

              <option value="Cooking & Tiffin">
                Cooking & Tiffin
              </option>

              <option value="Baby Care">
                Baby Care
              </option>

              <option value="Elderly Care">
                Elderly Care
              </option>
            </select>

            <input
              type="date"
              value={booking.date}
              onChange={(e) =>
                setBooking({
                  ...booking,
                  date: e.target.value,
                })
              }
            />

            <input
              type="time"
              value={booking.time}
              onChange={(e) =>
                setBooking({
                  ...booking,
                  time: e.target.value,
                })
              }
            />

            <button onClick={handleBooking}>
              Confirm Booking
            </button>

          </div>
        </div>
      )}

      {/* =========================
          ADMIN LOGIN
      ========================= */}

      {showLogin && (
        <div className="booking-overlay">

          <div className="booking-form">

            <button
              className="close-btn"
              onClick={() => setShowLogin(false)}
            >
              ✕
            </button>

            <h2>🔐 Admin Login</h2>

            <input
              type="text"
              placeholder="Username"
              value={adminLogin.username}
              onChange={(e) =>
                setAdminLogin({
                  ...adminLogin,
                  username: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={adminLogin.password}
              onChange={(e) =>
                setAdminLogin({
                  ...adminLogin,
                  password: e.target.value,
                })
              }
            />

            <button onClick={handleAdminLogin}>
              Login
            </button>

          </div>
        </div>
      )}

      {/* =========================
          ADMIN DASHBOARD
      ========================= */}

      {showAdmin && isAdminLoggedIn && (
        <div className="booking-overlay">

          <div className="admin-dashboard">

            <button
              className="close-btn"
              onClick={() => setShowAdmin(false)}
            >
              ✕
            </button>

            <h2>🔐 Admin Dashboard</h2>

            <p className="admin-subtitle">
              Rajdhani Care Booking Management
            </p>

            {/* STATISTICS */}

            <div className="dashboard-stats">

              <div className="stat-card">
                <h3>{totalBookings}</h3>
                <p>📋 Total</p>
              </div>

              <div className="stat-card pending-stat">
                <h3>{pendingBookings}</h3>
                <p>🟡 Pending</p>
              </div>

              <div className="stat-card confirmed-stat">
                <h3>{confirmedBookings}</h3>
                <p>🟢 Confirmed</p>
              </div>

              <div className="stat-card completed-stat">
                <h3>{completedBookings}</h3>
                <p>🔵 Completed</p>
              </div>

              <div className="stat-card cancelled-stat">
                <h3>{cancelledBookings}</h3>
                <p>🔴 Cancelled</p>
              </div>

            </div>

            {/* SEARCH + FILTER */}

            <div className="admin-tools">

              <input
                type="text"
                placeholder="🔍 Search name, phone or service..."
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="ALL">
                  All Status
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="CONFIRMED">
                  Confirmed
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>

            </div>

            {/* ACTIONS */}

            <div className="admin-top-actions">

              <button
                className="refresh-btn"
                onClick={loadBookings}
              >
                🔄 Refresh
              </button>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>

            </div>

            {/* BOOKINGS */}

            {filteredBookings.length === 0 ? (

              <p className="no-bookings">
                No bookings found.
              </p>

            ) : (

              <div className="admin-bookings">

                {filteredBookings.map((item) => {

                  const currentStatus =
                    item.status || "PENDING";

                  return (
                    <div
                      className="admin-booking-card"
                      key={item.id}
                    >

                      <div className="booking-header">

                        <h3>
                          Booking #{item.id}
                        </h3>

                        <span>
                          {item.service}
                        </span>

                      </div>

                      <div className="status-row">

                        <strong>
                          Status:
                        </strong>

                        <span
                          className={`booking-status ${getStatusClass(
                            currentStatus
                          )}`}
                        >
                          {currentStatus}
                        </span>

                      </div>

                      <p>
                        👤 <strong>Name:</strong>{" "}
                        {item.name}
                      </p>

                      <p>
                        📞 <strong>Phone:</strong>{" "}
                        {item.phone}
                      </p>

                      <p>
                        📍 <strong>Address:</strong>{" "}
                        {item.address}
                      </p>

                      <p>
                        📅 <strong>Date:</strong>{" "}
                        {item.date}
                      </p>

                      <p>
                        ⏰ <strong>Time:</strong>{" "}
                        {item.time}
                      </p>

                      {/* BUTTONS */}

                      <div className="booking-actions">

                        <button
                          className="confirm-btn"
                          onClick={() =>
                            updateBookingStatus(
                              item.id,
                              "CONFIRMED"
                            )
                          }
                        >
                          ✅ Confirm
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={() =>
                            updateBookingStatus(
                              item.id,
                              "CANCELLED"
                            )
                          }
                        >
                          ❌ Cancel
                        </button>

                        <button
                          className="complete-btn"
                          onClick={() =>
                            updateBookingStatus(
                              item.id,
                              "COMPLETED"
                            )
                          }
                        >
                          🔵 Complete
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteBooking(item.id)
                          }
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>

            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
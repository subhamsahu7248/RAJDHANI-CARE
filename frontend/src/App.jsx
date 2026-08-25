import "./App.css";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api/bookings";

function App() {
  // =========================================
  // UI STATES
  // =========================================

  const [showForm, setShowForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // =========================================
  // BOOKING DATA
  // =========================================

  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    address: "",
    service: "",
    date: "",
    time: "",
  });

  const [bookings, setBookings] = useState([]);

  // =========================================
  // ADMIN LOGIN
  // =========================================

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // =========================================
  // CUSTOMER STATUS CHECK
  // =========================================

  const [statusData, setStatusData] = useState({
    id: "",
    phone: "",
  });

  const [searchedBooking, setSearchedBooking] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // =========================================
  // ADMIN SEARCH / FILTER
  // =========================================

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [refreshing, setRefreshing] = useState(false);

  // =========================================
  // LOAD BOOKINGS
  // =========================================

  const loadBookings = async () => {
    try {
      setRefreshing(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();

      setBookings(data);
    } catch (error) {
      console.error("Booking fetch error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // =========================================
  // OPEN BOOKING
  // =========================================

  const openBooking = () => {
    setShowForm(true);
    setShowLogin(false);
    setShowAdmin(false);
    setShowStatus(false);
    setMenuOpen(false);
  };

  // =========================================
  // OPEN STATUS
  // =========================================

  const openStatus = () => {
    setShowStatus(true);
    setShowForm(false);
    setShowLogin(false);
    setShowAdmin(false);
    setMenuOpen(false);
    setSearchedBooking(null);
  };

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setBooking((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // CREATE BOOKING
  // =========================================

  const handleBooking = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...booking,
          status: "PENDING",
        }),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      const savedBooking = await response.json();

      setBookings((previous) => [
        ...previous,
        savedBooking,
      ]);

      alert(
        `Booking successful!\n\nYour Booking ID is: ${savedBooking.id}\n\nPlease save this ID to check your booking status.`
      );

      setBooking({
        name: "",
        phone: "",
        address: "",
        service: "",
        date: "",
        time: "",
      });

      setShowForm(false);

      setStatusData({
        id: savedBooking.id,
        phone: savedBooking.phone,
      });
    } catch (error) {
      console.error("Booking error:", error);

      alert(
        "Booking failed. Please make sure the backend server is running."
      );
    }
  };

  // =========================================
  // CUSTOMER CHECK STATUS
  // =========================================

  const handleStatusCheck = async (event) => {
    event.preventDefault();

    if (!statusData.id || !statusData.phone) {
      alert("Please enter Booking ID and Phone Number.");
      return;
    }

    setStatusLoading(true);
    setSearchedBooking(null);

    try {
      const response = await fetch(
        `${API_URL}/${statusData.id}/phone/${encodeURIComponent(
          statusData.phone
        )}`
      );

      if (!response.ok) {
        throw new Error("Booking not found");
      }

      const data = await response.json();

      setSearchedBooking(data);
    } catch (error) {
      console.error("Status error:", error);

      alert(
        "Booking not found. Please check your Booking ID and Phone Number."
      );
    } finally {
      setStatusLoading(false);
    }
  };

  // =========================================
  // ADMIN LOGIN
  // =========================================

  const handleAdminLogin = (event) => {
    event.preventDefault();

    if (
      loginData.username === "admin" &&
      loginData.password === "admin123"
    ) {
      setIsAdminLoggedIn(true);
      setShowLogin(false);
      setShowAdmin(true);

      setLoginData({
        username: "",
        password: "",
      });

      loadBookings();
    } else {
      alert("Invalid admin username or password.");
    }
  };

  // =========================================
  // UPDATE STATUS
  // =========================================

  const updateBookingStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}/status`,
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

      const updatedBooking = await response.json();

      setBookings((previous) =>
        previous.map((item) =>
          item.id === id ? updatedBooking : item
        )
      );

      if (
        searchedBooking &&
        searchedBooking.id === id
      ) {
        setSearchedBooking(updatedBooking);
      }

    } catch (error) {
      console.error("Status update error:", error);

      alert("Unable to update booking status.");
    }
  };

  // =========================================
  // DELETE BOOKING
  // =========================================

  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setBookings((previous) =>
        previous.filter((item) => item.id !== id)
      );

      alert("Booking deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);

      alert("Unable to delete booking.");
    }
  };

  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "status-confirmed";

      case "CANCELLED":
        return "status-cancelled";

      case "COMPLETED":
        return "status-completed";

      default:
        return "status-pending";
    }
  };

  // =========================================
  // NORMALIZE STATUS
  // =========================================

  const getBookingStatus = (item) => {
    return item.status || "PENDING";
  };

  // =========================================
  // DASHBOARD STATISTICS
  // =========================================

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (item) =>
      getBookingStatus(item) === "PENDING"
  ).length;

  const confirmedBookings = bookings.filter(
    (item) =>
      getBookingStatus(item) === "CONFIRMED"
  ).length;

  const completedBookings = bookings.filter(
    (item) =>
      getBookingStatus(item) === "COMPLETED"
  ).length;

  const cancelledBookings = bookings.filter(
    (item) =>
      getBookingStatus(item) === "CANCELLED"
  ).length;

  // =========================================
  // SEARCH + FILTER
  // =========================================

  const filteredBookings = bookings.filter(
    (item) => {
      const search = searchText
        .toLowerCase()
        .trim();

      const matchesSearch =
        search === "" ||
        String(item.id)
          .toLowerCase()
          .includes(search) ||
        (item.name || "")
          .toLowerCase()
          .includes(search) ||
        (item.phone || "")
          .toLowerCase()
          .includes(search) ||
        (item.service || "")
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "ALL" ||
        getBookingStatus(item) === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  return (
    <div className="app">

      {/* =========================================
          NAVBAR
      ========================================= */}

      <header className="navbar">

        <div className="nav-container">

          {/* BRAND */}

          <div className="brand">

            <img
              src="/images/rajdhani-care-logo.jpeg"
              alt="Rajdhani Care"
              className="nav-logo"
            />

            <div className="brand-text">
              <span>RAJDHANI</span>
              <small>CARE</small>
            </div>

          </div>

          {/* NAV LINKS */}

          <nav
            className={`nav-links ${
              menuOpen ? "mobile-open" : ""
            }`}
          >

            <a
              href="#home"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </a>

            <a
              href="#services"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </a>

            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>

            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>

          </nav>

          {/* NAV ACTIONS */}

          <div className="nav-actions">

            <button
              className="nav-status-button"
              onClick={openStatus}
            >
              Check Status
            </button>

            <button
              className="nav-button"
              onClick={openBooking}
            >
              Book Service
              <span>→</span>
            </button>

          </div>

          {/* MOBILE MENU */}

          <button
            className={`mobile-menu-button ${
              menuOpen ? "active" : ""
            }`}
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Toggle menu"
          >

            <span></span>
            <span></span>
            <span></span>

          </button>

        </div>

      </header>


      {/* =========================================
          HERO
      ========================================= */}

      <section
        id="home"
        className="hero-section"
      >

        <div className="hero-content">

          <div className="hero-text">

            <div className="hero-badge">
              Trusted Home Care Services
            </div>

            <h1>
              Your Home Care,
              <br />
              <span>
                Now At Your Doorstep.
              </span>
            </h1>

            <p>
              Reliable and compassionate home
              care services designed to make
              everyday life easier, safer and
              more comfortable.
            </p>

            <div className="hero-actions">

              <button
                className="primary-button"
                onClick={openBooking}
              >
                Book a Service
                <span>→</span>
              </button>

              <button
                className="secondary-button"
                onClick={openStatus}
              >
                Check Booking Status
              </button>

            </div>

          </div>

          <div className="hero-visual">

            <div className="hero-card">

              <div className="hero-card-icon">
                ❤️
              </div>

              <h3>
                Care You Can Trust
              </h3>

              <p>
                Professional service with
                genuine care.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          SERVICES
      ========================================= */}

      <section
        id="services"
        className="services-section"
      >

        <div className="section-heading">

          <span className="section-label">
            OUR SERVICES
          </span>

          <h2>
            Everything You Need,
            <br />
            <span>
              Under One Roof.
            </span>
          </h2>

          <p>
            Simple, dependable and professional
            services for your everyday needs.
          </p>

        </div>

        <div className="services-grid">

          <div className="service-card">

            <div className="service-icon">
              🏠
            </div>

            <h3>
              Home Cleaning
            </h3>

            <p>
              Professional home cleaning
              services for a fresh and
              healthy living space.
            </p>

            <button onClick={openBooking}>
              Book Now →
            </button>

          </div>


          <div className="service-card">

            <div className="service-icon">
              👵
            </div>

            <h3>
              Elder Care
            </h3>

            <p>
              Caring and dependable assistance
              for elderly family members at home.
            </p>

            <button onClick={openBooking}>
              Book Now →
            </button>

          </div>


          <div className="service-card">

            <div className="service-icon">
              🔧
            </div>

            <h3>
              Home Maintenance
            </h3>

            <p>
              Reliable maintenance and support
              services whenever you need them.
            </p>

            <button onClick={openBooking}>
              Book Now →
            </button>

          </div>


          <div className="service-card">

            <div className="service-icon">
              🧹
            </div>

            <h3>
              Daily Assistance
            </h3>

            <p>
              Convenient everyday assistance
              designed around your needs.
            </p>

            <button onClick={openBooking}>
              Book Now →
            </button>

          </div>

        </div>

      </section>


      {/* =========================================
          ABOUT
      ========================================= */}

      <section
        id="about"
        className="about-section"
      >

        <div className="about-content">

          <div className="about-image">

            <div className="about-image-card">
              Rajdhani
              <br />
              Care
            </div>

          </div>

          <div className="about-text">

            <span className="section-label">
              ABOUT RAJDHANI CARE
            </span>

            <h2>
              We Believe
              <br />
              <span>
                Care Comes First.
              </span>
            </h2>

            <p>
              Rajdhani Care is built around
              a simple idea — providing
              dependable services that
              people can trust.
            </p>

            <p>
              Our goal is to make professional
              home services accessible,
              convenient and stress-free
              for every family.
            </p>

            <div className="about-points">

              <div>
                <strong>✓</strong>
                Trusted Professionals
              </div>

              <div>
                <strong>✓</strong>
                Reliable Service
              </div>

              <div>
                <strong>✓</strong>
                Customer First
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          CONTACT / CTA
      ========================================= */}

      <section
        id="contact"
        className="cta-section"
      >

        <div className="cta-content">

          <div>

            <span className="section-label">
              NEED HELP?
            </span>

            <h2>
              Let Us Take Care
              <br />
              <span>
                Of The Rest.
              </span>
            </h2>

            <p>
              Book a service today and
              experience simple, reliable
              home care.
            </p>

          </div>

          <button
            className="cta-button"
            onClick={openBooking}
          >
            Book a Service
            <span>→</span>
          </button>

        </div>

      </section>


      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="premium-footer">

        <div className="footer-container">

          <div className="footer-brand">

            <div className="footer-brand-top">

              <img
                src="/images/rajdhani-care-logo.jpeg"
                alt="Rajdhani Care"
                className="footer-logo"
              />

              <div className="footer-brand-text">

                <span>
                  RAJDHANI
                </span>

                <small>
                  CARE
                </small>

              </div>

            </div>

            <p>
              Professional and reliable home
              care services designed around you.
            </p>

          </div>


          <div className="footer-column">

            <h3>
              Quick Links
            </h3>

            <a href="#home">
              Home
            </a>

            <a href="#services">
              Services
            </a>

            <a href="#about">
              About Us
            </a>

            <a href="#contact">
              Contact
            </a>

          </div>


          <div className="footer-column">

            <h3>
              Services
            </h3>

            <a href="#services">
              Home Cleaning
            </a>

            <a href="#services">
              Elder Care
            </a>

            <a href="#services">
              Home Maintenance
            </a>

            <a href="#services">
              Daily Assistance
            </a>

          </div>


          <div className="footer-column footer-contact">

            <h3>
              Contact Us
            </h3>

            <p>
              📍 Bhubaneswar, Odisha
            </p>

            <p>
              ☎ +91 XXXXX XXXXX
            </p>

            <p>
              ✉ hello@rajdhanicare.com
            </p>

            <button
              onClick={openStatus}
              className="footer-book-button"
            >
              Check Booking Status →
            </button>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            © 2026 Rajdhani Care.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">

            <button
              onClick={() => setShowLogin(true)}
              className="admin-footer-button"
            >
              Admin Login
            </button>

          </div>

        </div>

      </footer>


      {/* =========================================
          BOOKING MODAL
      ========================================= */}

      {showForm && (

        <div className="modal-overlay">

          <div className="booking-modal">

            <button
              className="modal-close"
              onClick={() =>
                setShowForm(false)
              }
            >
              ×
            </button>

            <h2>
              Book a Service
            </h2>

            <p>
              Fill in your details and we
              will get back to you.
            </p>

            <form onSubmit={handleBooking}>

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={booking.name}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={booking.phone}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={booking.address}
                onChange={handleChange}
                required
              />

              <select
                name="service"
                value={booking.service}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Service
                </option>

                <option value="Home Cleaning">
                  Home Cleaning
                </option>

                <option value="Elder Care">
                  Elder Care
                </option>

                <option value="Home Maintenance">
                  Home Maintenance
                </option>

                <option value="Daily Assistance">
                  Daily Assistance
                </option>

              </select>

              <input
                type="date"
                name="date"
                value={booking.date}
                onChange={handleChange}
                required
              />

              <input
                type="time"
                name="time"
                value={booking.time}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="modal-submit"
              >
                Confirm Booking →
              </button>

            </form>

          </div>

        </div>

      )}


      {/* =========================================
          STATUS MODAL
      ========================================= */}

      {showStatus && (

        <div className="modal-overlay">

          <div className="booking-modal status-modal">

            <button
              className="modal-close"
              onClick={() => {
                setShowStatus(false);
                setSearchedBooking(null);
              }}
            >
              ×
            </button>

            <h2>
              Check Booking Status
            </h2>

            <p>
              Enter your Booking ID and
              phone number.
            </p>

            <form
              onSubmit={handleStatusCheck}
            >

              <input
                type="number"
                placeholder="Booking ID"
                value={statusData.id}
                onChange={(event) =>
                  setStatusData({
                    ...statusData,
                    id: event.target.value,
                  })
                }
                required
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={statusData.phone}
                onChange={(event) =>
                  setStatusData({
                    ...statusData,
                    phone: event.target.value,
                  })
                }
                required
              />

              <button
                type="submit"
                className="modal-submit"
                disabled={statusLoading}
              >
                {statusLoading
                  ? "Checking..."
                  : "Check Status →"}
              </button>

            </form>


            {searchedBooking && (

              <div className="booking-status-result">

                <div className="status-result-header">

                  <span>
                    Booking #
                    {searchedBooking.id}
                  </span>

                  <span
                    className={`status-badge ${getStatusClass(
                      searchedBooking.status
                    )}`}
                  >
                    {getBookingStatus(
                      searchedBooking
                    )}
                  </span>

                </div>

                <div className="status-details">

                  <p>
                    <strong>Name:</strong>{" "}
                    {searchedBooking.name}
                  </p>

                  <p>
                    <strong>Service:</strong>{" "}
                    {searchedBooking.service}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {searchedBooking.date}
                  </p>

                  <p>
                    <strong>Time:</strong>{" "}
                    {searchedBooking.time}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {searchedBooking.address}
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

      )}


      {/* =========================================
          ADMIN LOGIN
      ========================================= */}

      {showLogin && (

        <div className="modal-overlay">

          <div className="booking-modal">

            <button
              className="modal-close"
              onClick={() =>
                setShowLogin(false)
              }
            >
              ×
            </button>

            <h2>
              Admin Login
            </h2>

            <p>
              Authorized personnel only.
            </p>

            <form
              onSubmit={handleAdminLogin}
            >

              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(event) =>
                  setLoginData({
                    ...loginData,
                    username:
                      event.target.value,
                  })
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(event) =>
                  setLoginData({
                    ...loginData,
                    password:
                      event.target.value,
                  })
                }
                required
              />

              <button
                type="submit"
                className="modal-submit"
              >
                Login →
              </button>

            </form>

          </div>

        </div>

      )}


      {/* =========================================
          ADMIN DASHBOARD
      ========================================= */}

      {showAdmin && isAdminLoggedIn && (

        <div className="modal-overlay">

          <div className="admin-modal">

            <button
              className="modal-close"
              onClick={() =>
                setShowAdmin(false)
              }
            >
              ×
            </button>


            {/* ADMIN HEADER */}

            <div className="admin-header">

              <div>

                <span className="section-label">
                  RAJDHANI CARE
                </span>

                <h2>
                  Admin Dashboard
                </h2>

              </div>

              <button
                className="refresh-button"
                onClick={loadBookings}
                disabled={refreshing}
              >
                {refreshing
                  ? "Refreshing..."
                  : "↻ Refresh"}
              </button>

            </div>


            {/* =====================================
                STATISTICS
            ===================================== */}

            <div className="dashboard-stats">

              <div
                className="stat-card stat-total"
                onClick={() =>
                  setStatusFilter("ALL")
                }
              >

                <span>
                  TOTAL BOOKINGS
                </span>

                <strong>
                  {totalBookings}
                </strong>

              </div>


              <div
                className="stat-card stat-pending"
                onClick={() =>
                  setStatusFilter("PENDING")
                }
              >

                <span>
                  PENDING
                </span>

                <strong>
                  {pendingBookings}
                </strong>

              </div>


              <div
                className="stat-card stat-confirmed"
                onClick={() =>
                  setStatusFilter("CONFIRMED")
                }
              >

                <span>
                  CONFIRMED
                </span>

                <strong>
                  {confirmedBookings}
                </strong>

              </div>


              <div
                className="stat-card stat-completed"
                onClick={() =>
                  setStatusFilter("COMPLETED")
                }
              >

                <span>
                  COMPLETED
                </span>

                <strong>
                  {completedBookings}
                </strong>

              </div>


              <div
                className="stat-card stat-cancelled"
                onClick={() =>
                  setStatusFilter("CANCELLED")
                }
              >

                <span>
                  CANCELLED
                </span>

                <strong>
                  {cancelledBookings}
                </strong>

              </div>

            </div>


            {/* =====================================
                SEARCH / FILTER
            ===================================== */}

            <div className="admin-tools">

              <input
                type="text"
                placeholder="Search by name, phone, service or ID..."
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value
                  )
                }
                className="admin-search"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="admin-filter"
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


            {/* RESULT COUNT */}

            <div className="admin-result-count">

              Showing{" "}
              <strong>
                {filteredBookings.length}
              </strong>{" "}
              of{" "}
              <strong>
                {totalBookings}
              </strong>{" "}
              bookings

            </div>


            {/* =====================================
                BOOKINGS
            ===================================== */}

            <div className="admin-bookings">

              {filteredBookings.length === 0 ? (

                <div className="empty-bookings">

                  <h3>
                    No bookings found
                  </h3>

                  <p>
                    Try changing your search
                    or status filter.
                  </p>

                </div>

              ) : (

                filteredBookings.map(
                  (item) => (

                    <div
                      className="admin-booking-card"
                      key={item.id}
                    >

                      {/* TOP */}

                      <div className="admin-booking-top">

                        <div>

                          <span className="booking-id">
                            Booking #{item.id}
                          </span>

                          <h3>
                            {item.name}
                          </h3>

                        </div>

                        <span
                          className={`status-badge ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {getBookingStatus(
                            item
                          )}
                        </span>

                      </div>


                      {/* DETAILS */}

                      <div className="admin-booking-details">

                        <p>
                          <strong>
                            Phone:
                          </strong>{" "}
                          {item.phone}
                        </p>

                        <p>
                          <strong>
                            Service:
                          </strong>{" "}
                          {item.service}
                        </p>

                        <p>
                          <strong>
                            Date:
                          </strong>{" "}
                          {item.date}
                        </p>

                        <p>
                          <strong>
                            Time:
                          </strong>{" "}
                          {item.time}
                        </p>

                        <p>
                          <strong>
                            Address:
                          </strong>{" "}
                          {item.address}
                        </p>

                      </div>


                      {/* STATUS ACTIONS */}

                      <div className="status-actions">

                        <button
                          className="confirm-button"
                          onClick={() =>
                            updateBookingStatus(
                              item.id,
                              "CONFIRMED"
                            )
                          }
                        >
                          ✓ Confirm
                        </button>

                        <button
                          className="pending-button"
                          onClick={() =>
                            updateBookingStatus(
                              item.id,
                              "PENDING"
                            )
                          }
                        >
                          ◷ Pending
                        </button>

                        <button
                          className="complete-button"
                          onClick={() =>
                            updateBookingStatus(
                              item.id,
                              "COMPLETED"
                            )
                          }
                        >
                          ✓ Complete
                        </button>

                        <button
                          className="cancel-button"
                          onClick={() =>
                            updateBookingStatus(
                              item.id,
                              "CANCELLED"
                            )
                          }
                        >
                          × Cancel
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteBooking(
                              item.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  )
                )

              )}

            </div>


            {/* LOGOUT */}

            <button
              className="admin-logout"
              onClick={() => {
                setIsAdminLoggedIn(false);
                setShowAdmin(false);
              }}
            >
              Logout
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;
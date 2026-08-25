import "./App.css";
import { useEffect, useState } from "react";

const API_BASE_URL = "https://rajdhani-care.onrender.com";

const ADMIN_USERNAME = "rajdhanicare";
const ADMIN_PASSWORD = "YOUR_CURRENT_ADMIN_PASSWORD";

const services = [
  {
    icon: "💄",
    title: "Beauty & Makeup",
    description: "Professional beauty services at your doorstep.",
  },
  {
    icon: "🧹",
    title: "Home Cleaning",
    description: "Keep your home clean, fresh and comfortable.",
  },
  {
    icon: "🍱",
    title: "Cooking & Tiffin",
    description: "Fresh, convenient food support for your family.",
  },
  {
    icon: "👶",
    title: "Baby Care",
    description: "Trusted care and support for your little ones.",
  },
  {
    icon: "👵",
    title: "Elderly Assistance",
    description: "Friendly assistance for elderly family members.",
  },
];

function ModalHeader({ eyebrow, title, description, onClose }) {
  return (
    <div className="modal-header">
      <button
        type="button"
        className="close-btn modal-close"
        aria-label="Close"
        onClick={onClose}
      >
        ✕
      </button>

      <p className="modal-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="modal-description">{description}</p>
    </div>
  );
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const [statusCheck, setStatusCheck] = useState({
    id: "",
    phone: "",
  });

  const [checkedBooking, setCheckedBooking] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const minimumBookingDate = new Date().toISOString().split("T")[0];

  const loadBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`);

      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Loading Error:", error);
      alert("Could not load bookings.");
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn && showAdmin) {
      loadBookings();
    }
  }, [isAdminLoggedIn, showAdmin]);

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
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      const savedBooking = await response.json();

      alert(
        `Booking created successfully!\n\nYour Booking ID is: ${savedBooking.id}`
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
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Booking failed. Please try again.");
    }
  };

  const checkBookingStatus = async () => {
    if (!statusCheck.id || !statusCheck.phone) {
      alert("Please enter Booking ID and Phone Number.");
      return;
    }

    try {
      const bookingId = statusCheck.id.trim();
      const phoneNumber = statusCheck.phone.trim();

      const response = await fetch(
        `${API_BASE_URL}/api/bookings/${bookingId}/phone/${phoneNumber}`
      );

      if (!response.ok) {
        throw new Error("Booking not found");
      }

      const data = await response.json();
      setCheckedBooking(data);
    } catch (error) {
      console.error("Status Check Error:", error);
      setCheckedBooking(null);
      alert("Booking not found. Please check your Booking ID and Phone Number.");
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/bookings/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      await loadBookings();
      alert(`Booking status changed to ${status}`);
    } catch (error) {
      console.error("Status Error:", error);
      alert("Could not update booking status.");
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: "DELETE",
      });

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

  const handleAdminLogin = () => {
    if (
      adminLogin.username === ADMIN_USERNAME &&
      adminLogin.password === ADMIN_PASSWORD
    ) {
      setIsAdminLoggedIn(true);
      setShowLogin(false);
      setShowAdmin(true);
      setAdminLogin({ username: "", password: "" });
      loadBookings();
    } else {
      alert("Invalid username or password!");
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setShowAdmin(false);
  };

  const getStatusClass = (status) => {
    if (status === "CONFIRMED") return "status-confirmed";
    if (status === "CANCELLED") return "status-cancelled";
    if (status === "COMPLETED") return "status-completed";
    return "status-pending";
  };

  const openSelectedService = (serviceName) => {
    setBooking({
      ...booking,
      service: serviceName,
    });

    setShowForm(true);
  };

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

  const filteredBookings = bookings.filter((item) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      item.name?.toLowerCase().includes(search) ||
      item.phone?.toLowerCase().includes(search) ||
      item.service?.toLowerCase().includes(search);

    const currentStatus = item.status || "PENDING";

    return (
      matchesSearch &&
      (statusFilter === "ALL" || currentStatus === statusFilter)
    );
  });

  return (
    <div>
      <nav className="site-navbar">
        <div className="nav-container">
          <a
            className="brand"
            href="#home"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src="/images/rajdhani-care-logo.jpeg"
              alt="Rajdhani Care logo"
              className="brand-logo"
            />

            <span className="brand-text">
              <strong>Rajdhani</strong>
              <small>CARE AT YOUR DOORSTEP</small>
            </span>
          </a>

          <button
            type="button"
            className="nav-menu-button"
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`nav-links ${isMenuOpen ? "is-open" : ""}`}>
            <a href="#home" onClick={() => setIsMenuOpen(false)}>
              Home
            </a>

            <a href="#services" onClick={() => setIsMenuOpen(false)}>
              Services
            </a>

            <a href="#about" onClick={() => setIsMenuOpen(false)}>
              Why Choose Us
            </a>

            <a href="#contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a>

            <button
              type="button"
              className="nav-check-button"
              onClick={() => {
                setShowStatus(true);
                setIsMenuOpen(false);
              }}
            >
              Check Booking
            </button>

            <button
              type="button"
              className="nav-book-button"
              onClick={() => {
                setShowForm(true);
                setIsMenuOpen(false);
              }}
            >
              Book a Service
            </button>

            {!isAdminLoggedIn ? (
              <button
                type="button"
                className="nav-admin-button"
                onClick={() => {
                  setShowLogin(true);
                  setIsMenuOpen(false);
                }}
              >
                Admin
              </button>
            ) : (
              <button
                type="button"
                className="nav-admin-button"
                onClick={() => {
                  setShowAdmin(true);
                  setIsMenuOpen(false);
                }}
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>

      <section id="home" className="hero-section">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span>✦</span> Trusted home services in Bhubaneswar
            </p>

            <h1 className="hero-title">
              Your Home Care,
              <span>Now At Your Doorstep.</span>
            </h1>

            <p className="hero-description">
              From everyday home support to specialised care, Rajdhani Care
              connects your family with trusted professionals—right where you
              need them most.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="hero-primary-button"
                onClick={() => setShowForm(true)}
              >
                Book a Service <span>→</span>
              </button>

              <button
                type="button"
                className="hero-secondary-button"
                onClick={() => setShowStatus(true)}
              >
                Check Booking Status
              </button>
            </div>

            <div className="hero-trust-list">
              <div>
                <span>✓</span>
                Trusted professionals
              </div>

              <div>
                <span>✓</span>
                Easy service booking
              </div>

              <div>
                <span>✓</span>
                Care for every family
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-panel">
              <img
                src="/images/caregiver.jpeg"
                alt="Rajdhani Care professional at your doorstep"
              />

              <div className="hero-service-card">
                <span className="service-card-icon">♥</span>

                <div>
                  <strong>Care at your doorstep</strong>
                  <small>Comfort, support and trust</small>
                </div>
              </div>

              <div className="hero-location-card">
                <span>📍</span>

                <div>
                  <strong>Bhubaneswar, Odisha</strong>
                  <small>Serving your daily needs</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="services-section">
        <div className="services-heading">
          <p className="section-eyebrow">OUR SERVICES</p>

          <h2>Everyday Care for Your Home & Family</h2>

          <p>
            Choose the support you need and book a trusted Rajdhani Care
            professional at your convenience.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <article
              className={`service-card service-card-${index + 1}`}
              key={service.title}
            >
              <span className="service-number">0{index + 1}</span>

              <div className="service-icon">{service.icon}</div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              <button
                type="button"
                className="service-book-button"
                onClick={() => openSelectedService(service.title)}
              >
                Book this service <span>→</span>
              </button>
            </article>
          ))}
        </div>

        <div className="services-bottom">
          <div>
            <span>✦</span>
            Need help choosing the right service?
          </div>

          <button type="button" onClick={() => setShowForm(true)}>
            Book a Service
          </button>
        </div>
      </section>

      <section id="about" className="why-section">
        <div className="why-container">
          <div className="why-visual">
            <div className="why-main-card">
              <span className="why-heart">♥</span>

              <p>Rajdhani Care</p>

              <h3>Care Beyond a Service</h3>

              <div>
                <span>✓</span>
                Trusted support for every home
              </div>
            </div>

            <div className="why-small-card services-count-card">
              <strong>5</strong>
              <span>Essential home services</span>
            </div>

            <div className="why-small-card location-count-card">
              <span>📍</span>

              <div>
                <strong>Bhubaneswar</strong>
                <small>Odisha</small>
              </div>
            </div>
          </div>

          <div className="why-content">
            <p className="section-eyebrow">WHY CHOOSE US</p>

            <h2>
              More Than a Service,
              <span>A New Trust of Care.</span>
            </h2>

            <p className="why-description">
              Rajdhani Care makes everyday life easier by bringing reliable,
              family-focused services directly to your home.
            </p>

            <div className="why-points">
              <div className="why-point">
                <span>01</span>

                <div>
                  <h3>Professional & Trusted</h3>
                  <p>
                    We focus on dependable support and respectful service for
                    every family.
                  </p>
                </div>
              </div>

              <div className="why-point">
                <span>02</span>

                <div>
                  <h3>Easy Booking Process</h3>
                  <p>
                    Select a service, choose a convenient time and track your
                    booking status.
                  </p>
                </div>
              </div>

              <div className="why-point">
                <span>03</span>

                <div>
                  <h3>Care Made for Home</h3>
                  <p>
                    From baby care to elderly assistance, support is available
                    where it matters most.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="why-book-button"
              onClick={() => setShowForm(true)}
            >
              Book a Service <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className="booking-cta">
        <div className="cta-inner">
          <div className="cta-content">
            <p className="cta-eyebrow">READY WHEN YOU ARE</p>

            <h2>
              A Little Help Can Make
              <span>A Big Difference.</span>
            </h2>

            <p>
              Book a service in a few simple steps and let Rajdhani Care bring
              dependable support to your home.
            </p>

            <div className="cta-location">
              <span>📍</span>
              Currently serving families in Bhubaneswar, Odisha
            </div>
          </div>

          <div className="cta-card">
            <div className="cta-card-icon">♥</div>

            <h3>Book your care today</h3>

            <p>
              Select your service, preferred date and time. We will take care
              of the rest.
            </p>

            <button
              type="button"
              className="cta-primary-button"
              onClick={() => setShowForm(true)}
            >
              Book a Service <span>→</span>
            </button>

            <button
              type="button"
              className="cta-status-button"
              onClick={() => setShowStatus(true)}
            >
              Check Booking Status
            </button>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo-row">
              <img
                src="/images/rajdhani-care-logo.jpeg"
                alt="Rajdhani Care logo"
              />

              <div>
                <h3>Rajdhani Care</h3>
                <span>CARE AT YOUR DOORSTEP</span>
              </div>
            </div>

            <p>
              Trusted, family-focused home services designed to make everyday
              life easier.
            </p>

            <div className="footer-location">
              <span>📍</span>
              Bhubaneswar, Odisha
            </div>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>

            <a href="#home">Home</a>
            <a href="#services">Our Services</a>
            <a href="#about">Why Choose Us</a>
            <a href="#contact">Book a Service</a>
          </div>

          <div className="footer-column">
            <h4>Our Services</h4>

            {services.map((service) => (
              <button
                type="button"
                className="footer-service-link"
                key={service.title}
                onClick={() => openSelectedService(service.title)}
              >
                {service.title}
              </button>
            ))}
          </div>

          <div className="footer-column footer-help-column">
            <h4>Need Assistance?</h4>

            <p>
              Book a service online or use your Booking ID to check its
              current status.
            </p>

            <button
              type="button"
              className="footer-check-button"
              onClick={() => setShowStatus(true)}
            >
              Check Booking
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Rajdhani Care. All Rights Reserved.</p>

          <a href="#home">Back to top ↑</a>
        </div>
      </footer>

      {showForm && (
        <div className="booking-overlay" role="dialog" aria-modal="true">
          <div className="booking-form modern-booking-form">
            <ModalHeader
              eyebrow="SERVICE BOOKING"
              title="Book a Service"
              description="Fill in your details and choose a convenient time."
              onClose={() => setShowForm(false)}
            />

            <div className="booking-service-preview">
              <span>Selected service</span>
              <strong>{booking.service || "Choose your service below"}</strong>
            </div>

            <div className="booking-fields">
              <label className="form-field">
                <span>Your full name</span>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={booking.name}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      name: e.target.value,
                    })
                  }
                />
              </label>

              <label className="form-field">
                <span>Phone number</span>

                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter your phone number"
                  value={booking.phone}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      phone: e.target.value,
                    })
                  }
                />
              </label>

              <label className="form-field form-field-full">
                <span>Service address</span>

                <input
                  type="text"
                  placeholder="House number, area and landmark"
                  value={booking.address}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      address: e.target.value,
                    })
                  }
                />
              </label>

              <label className="form-field form-field-full">
                <span>Select service</span>

                <select
                  value={booking.service}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      service: e.target.value,
                    })
                  }
                >
                  <option value="">Choose a service</option>

                  {services.map((service) => (
                    <option key={service.title} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Preferred date</span>

                <input
                  type="date"
                  min={minimumBookingDate}
                  value={booking.date}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      date: e.target.value,
                    })
                  }
                />
              </label>

              <label className="form-field">
                <span>Preferred time</span>

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
              </label>
            </div>

            <p className="booking-form-note">
              ✦ Your booking details are used only to arrange your selected
              service.
            </p>

            <button
              type="button"
              className="booking-submit-button"
              onClick={handleBooking}
            >
              Confirm Booking <span>→</span>
            </button>
          </div>
        </div>
      )}

      {showStatus && (
        <div className="booking-overlay" role="dialog" aria-modal="true">
          <div className="booking-form modern-status-form">
            <ModalHeader
              eyebrow="BOOKING STATUS"
              title="Track Your Service"
              description="Enter your Booking ID and registered phone number."
              onClose={() => {
                setShowStatus(false);
                setCheckedBooking(null);
              }}
            />

            <div className="status-fields">
              <label className="form-field">
                <span>Booking ID</span>

                <input
                  type="number"
                  placeholder="Example: 101"
                  value={statusCheck.id}
                  onChange={(e) =>
                    setStatusCheck({
                      ...statusCheck,
                      id: e.target.value,
                    })
                  }
                />
              </label>

              <label className="form-field">
                <span>Phone number</span>

                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Registered phone number"
                  value={statusCheck.phone}
                  onChange={(e) =>
                    setStatusCheck({
                      ...statusCheck,
                      phone: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <button
              type="button"
              className="status-submit-button"
              onClick={checkBookingStatus}
            >
              Check Booking Status
            </button>

            {checkedBooking && (
              <div className="status-result-card">
                <div className="status-result-top">
                  <div>
                    <span>Booking reference</span>
                    <strong>#{checkedBooking.id}</strong>
                  </div>

                  <span
                    className={`booking-status ${getStatusClass(
                      checkedBooking.status || "PENDING"
                    )}`}
                  >
                    {checkedBooking.status || "PENDING"}
                  </span>
                </div>

                <div className="status-result-grid">
                  <div>
                    <span>Name</span>
                    <strong>{checkedBooking.name}</strong>
                  </div>

                  <div>
                    <span>Service</span>
                    <strong>{checkedBooking.service}</strong>
                  </div>

                  <div>
                    <span>Date</span>
                    <strong>{checkedBooking.date}</strong>
                  </div>

                  <div>
                    <span>Time</span>
                    <strong>{checkedBooking.time}</strong>
                  </div>

                  <div className="status-address">
                    <span>Service address</span>
                    <strong>{checkedBooking.address}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showLogin && (
        <div className="booking-overlay" role="dialog" aria-modal="true">
          <div className="booking-form admin-login-form">
            <ModalHeader
              eyebrow="ADMIN ACCESS"
              title="Welcome Back"
              description="Log in to manage Rajdhani Care bookings."
              onClose={() => setShowLogin(false)}
            />

            <div className="admin-login-fields">
              <label className="form-field">
                <span>Username</span>

                <input
                  type="text"
                  placeholder="Enter username"
                  value={adminLogin.username}
                  onChange={(e) =>
                    setAdminLogin({
                      ...adminLogin,
                      username: e.target.value,
                    })
                  }
                />
              </label>

              <label className="form-field">
                <span>Password</span>

                <input
                  type="password"
                  placeholder="Enter password"
                  value={adminLogin.password}
                  onChange={(e) =>
                    setAdminLogin({
                      ...adminLogin,
                      password: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <button
              type="button"
              className="booking-submit-button"
              onClick={handleAdminLogin}
            >
              Login to Dashboard
            </button>
          </div>
        </div>
      )}

      {showAdmin && isAdminLoggedIn && (
        <div className="booking-overlay" role="dialog" aria-modal="true">
          <div className="admin-dashboard">
            <button
              type="button"
              className="close-btn"
              aria-label="Close dashboard"
              onClick={() => setShowAdmin(false)}
            >
              ✕
            </button>

            <h2>🔐 Admin Dashboard</h2>

            <p className="admin-subtitle">
              Rajdhani Care Booking Management
            </p>

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

            <div className="admin-tools">
              <input
                type="text"
                placeholder="🔍 Search name, phone or service..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="admin-top-actions">
              <button
                type="button"
                className="refresh-btn"
                onClick={loadBookings}
              >
                🔄 Refresh
              </button>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>

            {filteredBookings.length === 0 ? (
              <p className="no-bookings">No bookings found.</p>
            ) : (
              <div className="admin-bookings">
                {filteredBookings.map((item) => {
                  const currentStatus = item.status || "PENDING";

                  return (
                    <div className="admin-booking-card" key={item.id}>
                      <div className="booking-header">
                        <h3>Booking #{item.id}</h3>
                        <span>{item.service}</span>
                      </div>

                      <div className="status-row">
                        <strong>Status:</strong>

                        <span
                          className={`booking-status ${getStatusClass(
                            currentStatus
                          )}`}
                        >
                          {currentStatus}
                        </span>
                      </div>

                      <p>
                        👤 <strong>Name:</strong> {item.name}
                      </p>

                      <p>
                        📞 <strong>Phone:</strong> {item.phone}
                      </p>

                      <p>
                        📍 <strong>Address:</strong> {item.address}
                      </p>

                      <p>
                        📅 <strong>Date:</strong> {item.date}
                      </p>

                      <p>
                        ⏰ <strong>Time:</strong> {item.time}
                      </p>

                      <div className="booking-actions">
                        <button
                          type="button"
                          className="confirm-btn"
                          onClick={() =>
                            updateBookingStatus(item.id, "CONFIRMED")
                          }
                        >
                          ✅ Confirm
                        </button>

                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() =>
                            updateBookingStatus(item.id, "CANCELLED")
                          }
                        >
                          ❌ Cancel
                        </button>

                        <button
                          type="button"
                          className="complete-btn"
                          onClick={() =>
                            updateBookingStatus(item.id, "COMPLETED")
                          }
                        >
                          🔵 Complete
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => deleteBooking(item.id)}
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
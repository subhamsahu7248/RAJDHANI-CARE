# 🏥 Rajdhani Care

A full-stack healthcare appointment booking web application that allows patients to book and verify appointments while providing an admin interface to manage bookings.

## 🚀 Features

### 👤 Patient Features
- Book healthcare appointments
- Enter patient name, phone number and address
- Select required healthcare service
- Select appointment date and time
- Verify existing bookings
- View booking status
- User-friendly responsive interface

### 🛠️ Admin Features
- Admin login
- View all bookings
- Update booking status
- Edit booking details
- Delete bookings
- Manage appointments from a centralized dashboard
- Changes are reflected in the patient interface

## 💻 Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven

### Database
- H2 Database

### Development Tools
- Visual Studio Code
- Git
- GitHub

## 📁 Project Structure

```text
RAJDHANI-CARE/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── rajdhani_care_backend/
│   │   │   │       ├── BackendApplication.java
│   │   │   │       ├── Booking.java
│   │   │   │       ├── BookingController.java
│   │   │   │       └── BookingRepository.java
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
# 🏥 Rajdhani Care

A full-stack healthcare appointment booking and management system built using React and Spring Boot.

## 📌 Overview

Rajdhani Care is a modern healthcare appointment management application that allows patients to book appointments and administrators to manage bookings through an admin dashboard.

The project is designed as a full-stack application with a React frontend, Spring Boot backend, and H2 database.

## ✨ Features

### 👤 Patient Features

- Book healthcare appointments
- Enter patient information
- Select service
- Select appointment date and time
- Track booking status
- Verify booking using booking ID and phone number
- View booking details
- Responsive user interface

### 🔐 Admin Features

- Admin login
- Admin dashboard
- View all bookings
- View booking details
- Update booking status
- Confirm bookings
- Cancel/update booking status
- Delete bookings
- Changes are reflected in the frontend

## 🛠️ Technology Stack

### Frontend

- React
- JavaScript
- HTML5
- CSS3
- Vite

### Backend

- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- REST API

### Database

- H2 Database

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Maven
- npm

## 📂 Project Structure

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
│   └── pom.xml
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
│   └── vite.config.js
│
├── .gitignore
└── README.md
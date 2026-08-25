package rajdhani_care_backend;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179",
        "http://localhost:5180",
        "http://localhost:5181",
        "http://localhost:5182",
        "http://localhost:5183",
        "http://localhost:5184",
        "http://localhost:5185",
        "http://localhost:5186",
        "http://localhost:5187",
        "http://localhost:5188",
        "http://localhost:5189",
        "http://localhost:5190",
        "https://rajdhani-care-2.onrender.com"
    },
    methods = {
        org.springframework.web.bind.annotation.RequestMethod.GET,
        org.springframework.web.bind.annotation.RequestMethod.POST,
        org.springframework.web.bind.annotation.RequestMethod.PUT,
        org.springframework.web.bind.annotation.RequestMethod.DELETE,
        org.springframework.web.bind.annotation.RequestMethod.OPTIONS
    },
    allowedHeaders = "*"
)
public class BookingController {

    private final BookingRepository bookingRepository;

    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // =========================================================
    // CREATE BOOKING
    // POST /api/bookings
    // =========================================================

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody Booking booking) {

        // New bookings are always PENDING
        booking.setStatus("PENDING");

        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }

    // =========================================================
    // GET ALL BOOKINGS
    // GET /api/bookings
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {

        List<Booking> bookings = bookingRepository.findAll();

        return ResponseEntity.ok(bookings);
    }

    // =========================================================
    // GET BOOKING BY ID
    // GET /api/bookings/{id}
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long id) {

        return bookingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================================================
    // CHECK BOOKING USING ID + PHONE
    // GET /api/bookings/{id}/phone/{phone}
    // =========================================================

    @GetMapping("/{id}/phone/{phone}")
    public ResponseEntity<Booking> getBookingByIdAndPhone(
            @PathVariable Long id,
            @PathVariable String phone) {

        return bookingRepository.findByIdAndPhone(id, phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================================================
    // UPDATE BOOKING STATUS
    // PUT /api/bookings/{id}/status
    // =========================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest request) {

        if (request == null ||
                request.getStatus() == null ||
                request.getStatus().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Status is required.");
        }

        String newStatus =
                request.getStatus().trim().toUpperCase();

        // Only these statuses are allowed
        if (!newStatus.equals("PENDING")
                && !newStatus.equals("CONFIRMED")
                && !newStatus.equals("CANCELLED")
                && !newStatus.equals("COMPLETED")) {

            return ResponseEntity.badRequest()
                    .body(
                        "Invalid status. Allowed values: "
                        + "PENDING, CONFIRMED, CANCELLED, COMPLETED"
                    );
        }

        return bookingRepository.findById(id)
                .map(booking -> {

                    booking.setStatus(newStatus);

                    Booking updatedBooking =
                            bookingRepository.save(booking);

                    return ResponseEntity.ok(updatedBooking);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================================================
    // DELETE BOOKING
    // DELETE /api/bookings/{id}
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable Long id) {

        if (!bookingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        bookingRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // STATUS REQUEST CLASS
    // =========================================================

    public static class StatusRequest {

        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}
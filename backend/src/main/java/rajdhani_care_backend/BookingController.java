package rajdhani_care_backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
                "http://localhost:5179"
        },
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        },
        allowedHeaders = "*"
)
public class BookingController {

    private final BookingRepository bookingRepository;

    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // =========================
    // CREATE NEW BOOKING
    // =========================

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {

        if (booking.getStatus() == null ||
                booking.getStatus().isEmpty()) {

            booking.setStatus("PENDING");
        }

        return bookingRepository.save(booking);
    }

    // =========================
    // GET ALL BOOKINGS
    // =========================

    @GetMapping
    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    // =========================
    // GET BOOKINGS BY PHONE
    // =========================

    @GetMapping("/phone/{phone}")
    public List<Booking> getBookingsByPhone(
            @PathVariable String phone) {

        return bookingRepository.findByPhone(phone);
    }

    // =========================
    // GET BOOKING BY ID + PHONE
    // =========================

    @GetMapping("/{id}/phone/{phone}")
    public Booking getBookingByIdAndPhone(
            @PathVariable Long id,
            @PathVariable String phone) {

        return bookingRepository
                .findByIdAndPhone(id, phone)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"
                        ));
    }

    // =========================
    // UPDATE BOOKING STATUS
    // =========================

    @PutMapping("/{id}/status")
    public Booking updateStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest request) {

        Booking booking = bookingRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"
                        ));

        booking.setStatus(request.getStatus());

        return bookingRepository.save(booking);
    }

    // =========================
    // DELETE BOOKING
    // =========================

    @DeleteMapping("/{id}")
    public String deleteBooking(
            @PathVariable Long id) {

        if (!bookingRepository.existsById(id)) {

            throw new RuntimeException(
                    "Booking not found"
            );
        }

        bookingRepository.deleteById(id);

        return "Booking deleted successfully";
    }

    // =========================
    // STATUS REQUEST
    // =========================

    public static class StatusRequest {

        private String status;

        public StatusRequest() {
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}
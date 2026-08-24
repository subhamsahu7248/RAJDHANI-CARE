package rajdhani_care_backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find all bookings using phone number
    List<Booking> findByPhone(String phone);

    // Find one specific booking using ID + phone number
    Optional<Booking> findByIdAndPhone(Long id, String phone);
}
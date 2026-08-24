package rajdhani_care_backend;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByPhone(String phone);

    Optional<Booking> findByIdAndPhone(Long id, String phone);
}
package com.nitc.bookmyroom.repository;

import com.nitc.bookmyroom.entity.Booking;
import com.nitc.bookmyroom.entity.User;
import com.nitc.bookmyroom.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByRoom(Room room);
    List<Booking> findByStatus(Booking.BookingStatus status);
    List<Booking> findByUserAndStatus(User user, Booking.BookingStatus status);
    List<Booking> findByRoomAndDate(Room room, LocalDate date);
    List<Booking> findByUserOrderByCreatedAtDesc(User user);
    List<Booking> findByStatusAndDate(Booking.BookingStatus status, LocalDate date);

}

package com.nitc.bookmyroom.service;

import com.nitc.bookmyroom.entity.Booking;
import com.nitc.bookmyroom.entity.Room;
import com.nitc.bookmyroom.entity.RoomLock;
import com.nitc.bookmyroom.entity.User;
import com.nitc.bookmyroom.repository.BookingRepository;
import com.nitc.bookmyroom.repository.RoomLockRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomLockRepository roomLockRepository;

    public BookingService(BookingRepository bookingRepository,
                          RoomLockRepository roomLockRepository) {
        this.bookingRepository = bookingRepository;
        this.roomLockRepository = roomLockRepository;
    }

    public Booking createBooking(User user, Room room, LocalDate date,
                                  LocalTime start, LocalTime end, String purpose) {
        List<Booking> existing = bookingRepository.findByRoomAndDate(room, date);
        for (Booking b : existing) {
            if (b.getStatus() != Booking.BookingStatus.REJECTED &&
                b.getStatus() != Booking.BookingStatus.CANCELLED) {
                if (start.isBefore(b.getEndTime()) && end.isAfter(b.getStartTime())) {
                    throw new RuntimeException("Room already booked for this time slot");
                }
            }
        }

        List<RoomLock> locks = roomLockRepository.findByRoomAndDate(room, date);
        for (RoomLock lock : locks) {
            if (lock.getStartTime() == null || lock.getEndTime() == null) {
                throw new RuntimeException("Room is locked for this day");
            }
            if (start.isBefore(lock.getEndTime()) && end.isAfter(lock.getStartTime())) {
                throw new RuntimeException("Room is locked during this time: " + lock.getReason());
            }
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setDate(date);
        booking.setStartTime(start);
        booking.setEndTime(end);
        booking.setPurpose(purpose);
        booking.setStatus(Booking.BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    public Booking updateStatus(Long bookingId, Booking.BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByUser(User user) {
        return bookingRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getPendingBookings() {
        return bookingRepository.findByStatus(Booking.BookingStatus.PENDING);
    }

    public void cancelBooking(Long bookingId, User requestingUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getId().equals(requestingUser.getId())) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    // ✅ NEW — confirm HOLD
    public Booking confirmHold(Long bookingId, User user) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (booking.getStatus() != Booking.BookingStatus.HOLD) {
            throw new RuntimeException("Booking is not in HOLD state");
        }

        booking.setStatus(Booking.BookingStatus.APPROVED);
        booking.setHoldDeadline(null);
        return bookingRepository.save(booking);
    }
}

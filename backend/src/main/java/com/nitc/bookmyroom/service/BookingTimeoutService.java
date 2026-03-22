package com.nitc.bookmyroom.service;

import com.nitc.bookmyroom.entity.Booking;
import com.nitc.bookmyroom.repository.BookingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingTimeoutService {

    private final BookingRepository bookingRepository;

    public BookingTimeoutService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // Runs every minute
    @Scheduled(fixedRate = 60000)
    public void checkBookingTimeouts() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // Find all APPROVED bookings whose start time has passed today
        List<Booking> approvedBookings = bookingRepository
                .findByStatusAndDate(Booking.BookingStatus.APPROVED, today);

        for (Booking booking : approvedBookings) {
            if (now.isAfter(booking.getStartTime())) {
                // Start 30-min cooldown — set to HOLD
                booking.setStatus(Booking.BookingStatus.HOLD);
                booking.setHoldDeadline(LocalDateTime.now().plusMinutes(30));
                bookingRepository.save(booking);
            }
        }

        // Cancel HOLD bookings where 30 min has expired
        List<Booking> holdBookings = bookingRepository
                .findByStatus(Booking.BookingStatus.HOLD);

        for (Booking booking : holdBookings) {
            if (booking.getHoldDeadline() != null &&
                LocalDateTime.now().isAfter(booking.getHoldDeadline())) {
                booking.setStatus(Booking.BookingStatus.TIMED_OUT);
                bookingRepository.save(booking);
            }
        }
    }
}

package com.nitc.bookmyroom.controller;

import com.nitc.bookmyroom.entity.Booking;
import com.nitc.bookmyroom.entity.Room;
import com.nitc.bookmyroom.entity.User;
import com.nitc.bookmyroom.repository.RoomRepository;
import com.nitc.bookmyroom.repository.UserRepository;
import com.nitc.bookmyroom.security.JwtUtil;
import com.nitc.bookmyroom.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public BookingController(BookingService bookingService,
                              RoomRepository roomRepository,
                              UserRepository userRepository,
                              JwtUtil jwtUtil) {
        this.bookingService = bookingService;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    private User getUserFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Map<String, String> body,
                                            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);
            Room room = roomRepository.findById(Long.parseLong(body.get("roomId")))
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            Booking booking = bookingService.createBooking(
                    user, room,
                    LocalDate.parse(body.get("date")),
                    LocalTime.parse(body.get("startTime")),
                    LocalTime.parse(body.get("endTime")),
                    body.get("purpose")
            );
            return ResponseEntity.ok(toMap(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> myBookings(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        List<Map<String, Object>> result = bookingService.getBookingsByUser(user)
                .stream().map(this::toMap).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public ResponseEntity<?> allBookings() {
        List<Map<String, Object>> result = bookingService.getAllBookings()
                .stream().map(this::toMap).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/pending")
    public ResponseEntity<?> pendingBookings() {
        List<Map<String, Object>> result = bookingService.getPendingBookings()
                .stream().map(this::toMap).toList();
        return ResponseEntity.ok(result);
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                           @RequestBody Map<String, String> body) {
        try {
            Booking.BookingStatus status = Booking.BookingStatus.valueOf(body.get("status").toUpperCase());
            Booking booking = bookingService.updateStatus(id, status);
            return ResponseEntity.ok(toMap(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id,
                                            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);
            bookingService.cancelBooking(id, user);
            return ResponseEntity.ok(Map.of("message", "Booking cancelled"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> toMap(Booking b) {
        return Map.of(
            "id", b.getId(),
            "roomId", b.getRoom().getId(),
            "roomName", b.getRoom().getName(),
            "roomType", b.getRoom().getType(),
            "date", b.getDate().toString(),
            "startTime", b.getStartTime().toString(),
            "endTime", b.getEndTime().toString(),
            "purpose", b.getPurpose() != null ? b.getPurpose() : "",
            "status", b.getStatus().name(),
            "userName", b.getUser().getName()
        );
    }
}

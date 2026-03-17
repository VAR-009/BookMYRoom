package com.nitc.bookmyroom.service;

import com.nitc.bookmyroom.entity.Room;
import com.nitc.bookmyroom.entity.RoomLock;
import com.nitc.bookmyroom.entity.User;
import com.nitc.bookmyroom.repository.RoomLockRepository;
import com.nitc.bookmyroom.repository.RoomRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomLockRepository roomLockRepository;

    public RoomService(RoomRepository roomRepository,
                       RoomLockRepository roomLockRepository) {
        this.roomRepository = roomRepository;
        this.roomLockRepository = roomLockRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room updatedRoom) {
        Room room = getRoomById(id);
        room.setName(updatedRoom.getName());
        room.setType(updatedRoom.getType());
        room.setCapacity(updatedRoom.getCapacity());
        room.setLocation(updatedRoom.getLocation());
        room.setImageUrl(updatedRoom.getImageUrl());
        room.setAmenities(updatedRoom.getAmenities());
        room.setStatus(updatedRoom.getStatus());
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    public RoomLock lockRoom(Room room, LocalDate date,
                              LocalTime start, LocalTime end,
                              String reason, User lockedBy) {
        RoomLock lock = new RoomLock();
        lock.setRoom(room);
        lock.setDate(date);
        lock.setStartTime(start);
        lock.setEndTime(end);
        lock.setReason(reason);
        lock.setLockedBy(lockedBy);
        return roomLockRepository.save(lock);
    }

    public List<RoomLock> getLocksForRoom(Long roomId, LocalDate date) {
        Room room = getRoomById(roomId);
        return roomLockRepository.findByRoomAndDate(room, date);
    }
}

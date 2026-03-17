package com.nitc.bookmyroom.repository;

import com.nitc.bookmyroom.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByType(String type);
    List<Room> findByStatus(Room.RoomStatus status);
    List<Room> findByLocationContainingIgnoreCase(String location);
}

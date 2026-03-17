package com.nitc.bookmyroom.repository;

import com.nitc.bookmyroom.entity.RoomLock;
import com.nitc.bookmyroom.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomLockRepository extends JpaRepository<RoomLock, Long> {
    List<RoomLock> findByRoom(Room room);
    List<RoomLock> findByRoomAndDate(Room room, LocalDate date);
    List<RoomLock> findByDate(LocalDate date);
}

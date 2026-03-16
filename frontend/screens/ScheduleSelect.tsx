import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Room, UserRole } from '../types';
import { useBooking } from '../contexts/BookingContext';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface ScheduleSelectProps {
  onBack: () => void;
  onNext: () => void;
  selectedRoom: Room | null;
  userRole: UserRole;
}

export const ScheduleSelect: React.FC<ScheduleSelectProps> = ({
  onBack,
  onNext,
  selectedRoom,
  userRole
}) => {

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  const { addBooking } = useBooking();


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    console.log("Selected room:", selectedRoom);
    const currentUser = auth.currentUser;

    if (!selectedRoom || !date || !startTime || !endTime || !purpose || !currentUser) {
      return;
    }

    const bookingTime = `${startTime} - ${endTime}`;

    try {

      // 🔴 CHECK FOR DOUBLE BOOKING
      const bookingQuery = query(
        collection(db, 'bookings'),
        where('roomId', '==', selectedRoom.id),
        where('date', '==', date),
        where('time', '==', bookingTime)
      );

      const snapshot = await getDocs(bookingQuery);

      const alreadyBooked = snapshot.docs.some(
        doc => doc.data().status !== 'Cancelled'
      );

      if (alreadyBooked) {
        alert("This room is already booked for the selected time.");
        return;
      }


      // CREATE BOOKING
      await addBooking({
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        roomType: selectedRoom.type,
        date: date,
        time: `${startTime} - ${endTime}`,
        status: 'Pending',
        purpose: purpose,
        userRole: userRole,
        userName: currentUser.displayName || 'User',
        userUid: currentUser.uid,
        roomAdminUid: selectedRoom.roomAdminUid,  // ADD THIS
        createdAt: new Date().toISOString()
      });
      onNext();

    } catch (error) {

      console.error("Booking error:", error);
      alert("Failed to create booking.");

    }

  };


  if (!selectedRoom) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">No room selected</h2>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-brand text-white rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  const timeSlots = [
    "08:00","08:30","09:00","09:30","10:00","10:30",
    "11:00","11:30","12:00","12:30","13:00","13:30",
    "14:00","14:30","15:00","15:30","16:00","16:30",
    "17:00","17:30","18:00","18:30","19:00","19:30",
    "20:00","20:30","21:00","21:30","22:00"
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

      {/* UI remains unchanged below */}

      {/* Stepper */}
      {/* ...existing UI code continues unchanged... */}

      {/* FORM */}
      <form className="space-y-6" onSubmit={handleSubmit}>

        {/* DATE */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {/* START TIME */}
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        >
          <option value="">Start Time</option>
          {timeSlots.map(t => <option key={t}>{t}</option>)}
        </select>

        {/* END TIME */}
        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        >
          <option value="">End Time</option>
          {timeSlots.map(t => <option key={t}>{t}</option>)}
        </select>

        {/* PURPOSE */}
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
        />

        <button type="submit">
          Submit Request
        </button>

      </form>

    </div>
  );
};
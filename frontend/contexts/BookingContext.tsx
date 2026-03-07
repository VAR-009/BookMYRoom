import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking } from '../types';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      roomName: 'ELHC 401',
      roomType: 'Classroom',
      purpose: 'Group Study Session',
      date: 'Today',
      time: '14:00 - 16:00',
      status: 'Approved',
      userRole: 'student',
      userName: 'Alex'
    },
    {
      id: '2',
      roomName: 'Aryabhatta',
      roomType: 'Institute Hall',
      purpose: 'CS-101 Introduction',
      date: 'Tomorrow',
      time: '09:00 - 10:30',
      status: 'Approved',
      userRole: 'faculty',
      userName: 'Prof. Grant'
    },
    {
      id: '3',
      roomName: 'SSL',
      roomType: 'Computer Lab',
      purpose: 'Fossil Cleaning', // Maybe change purpose to match Computer Lab? Keeping it for now as user didn't ask to change purpose.
      date: 'Today',
      time: '18:00 - 20:00',
      status: 'Pending',
      userRole: 'student',
      userName: 'Sarah Jenkins'
    },
    {
      id: '4',
      roomName: 'CSED Seminar Hall',
      roomType: 'Department Hall',
      purpose: 'Research Team Meeting',
      date: 'Tomorrow',
      time: '10:00 - 11:00',
      status: 'Pending',
      userRole: 'faculty',
      userName: 'Dr. Michael Chen'
    },
    {
       id: '5',
       roomName: 'NSL',
       roomType: 'Computer Lab',
       purpose: 'Chemistry Experiment', // Maybe change purpose? Keeping it.
       date: 'Next Monday',
       time: '14:00 - 16:00',
       status: 'Pending',
       userRole: 'student',
       userName: 'Emily Davis'
    }
  ]);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking, updateBookingStatus }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

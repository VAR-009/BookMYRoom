import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ApiBooking {
  id: number;
  roomId: number;
  roomName: string;
  roomType: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  userName: string;
}

interface BookingContextType {
  bookings: ApiBooking[];
  allBookings: ApiBooking[];
  loading: boolean;
  createBooking: (data: { roomId: number; date: string; startTime: string; endTime: string; purpose: string }) => Promise<void>;
  cancelBooking: (id: number) => Promise<void>;
  updateBookingStatus: (id: number, status: string) => Promise<void>;
  refreshBookings: () => void;
  refreshAllBookings: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const API = 'http://localhost:8080/api/bookings';
const getToken = () => localStorage.getItem('token');
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [allBookings, setAllBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyBookings = async () => {
    if (!getToken()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/my`, { headers: authHeaders() });
      if (res.ok) setBookings(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    if (!getToken()) return;
    try {
      const res = await fetch(`${API}/all`, { headers: authHeaders() });
      if (res.ok) setAllBookings(await res.json());
    } catch {}
  };

  useEffect(() => {
    fetchMyBookings();
    fetchAllBookings();
  }, []);

  const createBooking = async (data: { roomId: number; date: string; startTime: string; endTime: string; purpose: string }) => {
    const res = await fetch(`${API}/create`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ ...data, roomId: String(data.roomId) })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Booking failed');
    }
    await fetchMyBookings();
  };

  const cancelBooking = async (id: number) => {
    await fetch(`${API}/cancel/${id}`, { method: 'PUT', headers: authHeaders() });
    await fetchMyBookings();
  };

  const updateBookingStatus = async (id: number, status: string) => {
    await fetch(`${API}/status/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status })
    });
    await fetchAllBookings();
  };

  return (
    <BookingContext.Provider value={{
      bookings, allBookings, loading,
      createBooking, cancelBooking, updateBookingStatus,
      refreshBookings: fetchMyBookings,
      refreshAllBookings: fetchAllBookings
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};

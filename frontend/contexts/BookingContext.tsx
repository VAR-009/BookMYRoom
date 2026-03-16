import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Booking } from '../types';
import { db } from '../firebase';

import {
collection,
onSnapshot,
addDoc,
updateDoc,
doc,
query,
orderBy,
serverTimestamp
} from 'firebase/firestore';

interface BookingContextType {
bookings: Booking[];
addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
cancelBooking: (id: string) => Promise<void>;
updateBookingStatus: (
id: string,
status: Booking['status'],
approvedBy?: string
) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

const [bookings, setBookings] = useState<Booking[]>([]);

useEffect(() => {

const bookingsRef = collection(db, 'bookings');

const q = query(bookingsRef, orderBy('createdAt', 'desc'));

const unsubscribe = onSnapshot(q, (snapshot) => {

  const bookingsData: Booking[] = snapshot.docs.map((docSnap) => {

    const data = docSnap.data();

    return {
      id: docSnap.id,
      ...data
    } as Booking;

  });

  setBookings(bookingsData);

});

return () => unsubscribe();

}, []);

const addBooking = async (booking: Omit<Booking, 'id'>) => {

try {

  await addDoc(collection(db, 'bookings'), {
    ...booking,
    status: 'Pending',
    createdAt: serverTimestamp()
  });

} catch (error) {
  console.error("Error adding booking:", error);
}

};

const cancelBooking = async (id: string) => {


try {

  const bookingRef = doc(db, 'bookings', id);

  await updateDoc(bookingRef, {
    status: 'Cancelled'
  });

} catch (error) {
  console.error("Error cancelling booking:", error);
}

};

const updateBookingStatus = async (
id: string,
status: Booking['status'],
approvedBy?: string
) => {


try {

  const bookingRef = doc(db, 'bookings', id);

  await updateDoc(bookingRef, {
    status,
    approvedBy: approvedBy || null
  });

} catch (error) {
  console.error("Error updating booking status:", error);
}


};

return (
<BookingContext.Provider
value={{
bookings,
addBooking,
cancelBooking,
updateBookingStatus
}}
>
{children}
</BookingContext.Provider>
);

};

export const useBooking = () => {

const context = useContext(BookingContext);

if (!context) {
throw new Error('useBooking must be used within a BookingProvider');
}

return context;

};

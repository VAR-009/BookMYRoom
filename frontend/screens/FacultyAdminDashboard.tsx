import React, { useState, useEffect } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { useHistory } from '../contexts/HistoryContext';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface FacultyAdminDashboardProps {
onNavigate: (view: string) => void;
}

export const FacultyAdminDashboard: React.FC<FacultyAdminDashboardProps> = ({ onNavigate }) => {

const { bookings, cancelBooking, updateBookingStatus } = useBooking();
const { addToHistory } = useHistory();

const [user, setUser] = useState<User | null>(null);
const [processingId, setProcessingId] = useState<string | null>(null);

useEffect(() => {
const unsub = onAuthStateChanged(auth, (u) => {
setUser(u);
});

return () => unsub();

}, []);

if (!user) {
return <div className="p-6">Loading dashboard...</div>;
}

// bookings for this faculty admin
const myBookings = bookings.filter(
(b) => b.roomAdminUid === user.uid
);

const pendingRequestsToApprove = myBookings.filter(
(b) => b.status === "Pending"
);

const upcomingBookings = myBookings.filter(
(b) => b.status === "Approved"
);

const handleAction = async (id: string, action: 'Approve' | 'Reject') => {


try {

  setProcessingId(id);

  // find booking directly from bookings array (avoids stale state)
  const request = bookings.find(b => b.id === id);

  if (!request) {
    console.error("Booking not found:", id);
    return;
  }

  const newStatus = action === 'Approve' ? 'Approved' : 'Rejected';

  await updateBookingStatus(id, newStatus, user.uid);

  await addToHistory({
    roomName: request.roomName,
    location: request.location || 'Main Building',
    date: request.date,
    time: request.time,
    purpose: request.purpose,
    status: newStatus,
    iconType: action === 'Approve' ? 'DoorOpen' : 'Monitor'
  });

} catch (error) {
  console.error("Error updating booking:", error);
} finally {
  setProcessingId(null);
}


};

return (


<div className="max-w-7xl mx-auto px-4 py-8">

  <div className="mb-8">

    <h2 className="text-3xl font-bold">
      Welcome back, {user.displayName || "Professor"}
    </h2>

    <p className="text-gray-600 mt-2">
      You have <b>{upcomingBookings.length}</b> upcoming bookings and
      <b className="text-amber-600"> {pendingRequestsToApprove.length}</b> pending requests.
    </p>

  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

    {/* Upcoming bookings */}

    <div className="lg:col-span-2 bg-white shadow rounded-xl border">

      <div className="p-4 border-b font-semibold">
        Upcoming Bookings
      </div>

      <ul>

        {upcomingBookings.length > 0 ? (

          upcomingBookings.map((booking) => (

            <li key={booking.id} className="p-4 border-b">

              <div className="flex justify-between">

                <div>
                  <div className="font-semibold">{booking.roomName}</div>
                  <div className="text-sm text-gray-500">{booking.purpose}</div>
                  <div className="text-xs text-gray-400">
                    {booking.date} • {booking.time}
                  </div>
                </div>

                <button
                  onClick={() => cancelBooking(booking.id)}
                  className="text-red-500 text-sm"
                >
                  Cancel
                </button>

              </div>

            </li>

          ))

        ) : (

          <li className="p-4 text-gray-500">
            No upcoming bookings
          </li>

        )}

      </ul>

    </div>


    {/* Pending requests */}

    <div className="bg-white shadow rounded-xl border">

      <div className="p-4 border-b flex justify-between">

        <span className="font-semibold">Pending Requests</span>

        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
          {pendingRequestsToApprove.length}
        </span>

      </div>

      <ul>

        {pendingRequestsToApprove.length > 0 ? (

          pendingRequestsToApprove.map((request) => (

            <li key={request.id} className="p-4 border-b">

              <div className="text-sm font-semibold">{request.roomName}</div>
              <div className="text-xs text-gray-500">{request.purpose}</div>
              <div className="text-xs text-gray-400 mb-2">
                by {request.userName}
              </div>

              <div className="flex gap-2">

                <button
                  disabled={processingId === request.id}
                  onClick={() => handleAction(request.id, 'Approve')}
                  className="flex-1 bg-green-600 text-white text-xs py-1 rounded"
                >
                  {processingId === request.id ? "Processing..." : "Approve"}
                </button>

                <button
                  disabled={processingId === request.id}
                  onClick={() => handleAction(request.id, 'Reject')}
                  className="flex-1 border border-red-400 text-red-600 text-xs py-1 rounded"
                >
                  Reject
                </button>

              </div>

            </li>

          ))

        ) : (

          <li className="p-4 text-gray-500 text-center">
            No pending requests
          </li>

        )}

      </ul>

    </div>

  </div>

</div>


);

};

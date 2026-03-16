import React from 'react';
import { Icons } from '../components/Icons';
import { useHistory } from '../contexts/HistoryContext';
import { useBooking } from '../contexts/BookingContext';
import { useRooms } from '../contexts/RoomContext';
import { auth } from '../firebase';

export const RoomAdminDashboard: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {

  const { addToHistory } = useHistory();
  const { bookings, updateBookingStatus } = useBooking();
  const { rooms } = useRooms();

  const currentUser = auth.currentUser;

  // rooms managed by this admin
  const myRooms = rooms.filter(r => r.adminUid === currentUser?.uid);

  const myRoomIds = myRooms.map(r => r.id);

  // bookings only for those rooms
  const myRoomBookings = bookings.filter(b => myRoomIds.includes(b.roomId));

  const pendingRequests = myRoomBookings.filter(b => b.status === 'Pending');


  const handleAction = async (id: string, action: 'Approve' | 'Reject') => {

    const request = pendingRequests.find(r => r.id === id);

    if (!request) return;

    const newStatus = action === 'Approve' ? 'Approved' : 'Rejected';

    await updateBookingStatus(id, newStatus, currentUser?.uid);

    await addToHistory({
      roomName: request.roomName,
      location: 'Science Block B',
      date: request.date,
      time: request.time,
      purpose: request.purpose,
      status: newStatus,
      iconType: action === 'Approve' ? 'DoorOpen' : 'Monitor'
    });

  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Room Administration
        </h2>

        <p className="text-gray-600">
          You manage <span className="font-semibold">{myRooms.length}</span> rooms.
        </p>
      </div>


      <div className="bg-white shadow rounded-xl border border-gray-200 overflow-hidden">

        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            Booking Requests
          </h3>
        </div>

        <ul className="divide-y divide-gray-200">

          {pendingRequests.length > 0 ? (

            pendingRequests.map((req) => (

              <li key={req.id} className="p-6 hover:bg-gray-50">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-sm font-semibold text-gray-900">
                      {req.userName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {req.roomName}
                    </p>

                    <p className="text-xs text-gray-400">
                      {req.date} • {req.time}
                    </p>

                    <p className="text-sm text-gray-600 italic">
                      "{req.purpose}"
                    </p>

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() => handleAction(req.id, 'Approve')}
                      className="px-3 py-2 bg-green-600 text-white text-xs font-bold rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleAction(req.id, 'Reject')}
                      className="px-3 py-2 border border-red-200 text-red-600 text-xs font-bold rounded"
                    >
                      Reject
                    </button>

                  </div>

                </div>

              </li>

            ))

          ) : (

            <li className="p-6 text-center text-gray-500">
              No pending requests
            </li>

          )}

        </ul>

      </div>

    </div>
  );
};
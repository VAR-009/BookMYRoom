import React, { useEffect } from 'react';
import { Icons } from '../components/Icons';
import { useBooking } from '../contexts/BookingContext';

interface FacultyAdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const FacultyAdminDashboard: React.FC<FacultyAdminDashboardProps> = ({ onNavigate }) => {
  const { bookings, allBookings, loading, cancelBooking, updateBookingStatus, refreshBookings, refreshAllBookings } = useBooking();

  useEffect(() => {
    refreshBookings();
    refreshAllBookings();
  }, []);

  const myUpcoming = bookings.filter(b => b.status === 'APPROVED');
  const pendingToApprove = allBookings.filter(b => b.status === 'PENDING');

  const displayName = localStorage.getItem('userName') || 'Professor';

  const handleAction = async (id: number, action: 'APPROVED' | 'REJECTED') => {
    await updateBookingStatus(id, action);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, {displayName} 👋</h2>
        <p className="text-gray-600">
          You have <span className="font-semibold text-brand">{myUpcoming.length} upcoming bookings</span> and{' '}
          <span className="font-semibold text-amber-600">{pendingToApprove.length} pending requests</span> to review.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* My Upcoming Bookings */}
          <div className="bg-white shadow rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">My Upcoming Bookings</h3>
              <button onClick={() => onNavigate('search')} className="text-sm text-brand font-medium hover:underline">+ New Booking</button>
            </div>
            <ul className="divide-y divide-gray-200">
              {loading ? (
                <li className="p-6 text-center text-gray-500">Loading...</li>
              ) : myUpcoming.length > 0 ? (
                myUpcoming.map((booking) => (
                  <li key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 p-3 rounded-lg bg-teal-100 text-teal-700">
                          <Icons.Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{booking.roomName}</p>
                          <p className="text-sm text-gray-500 mt-1">{booking.purpose}</p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <Icons.Clock className="h-3 w-3 mr-1" /> {booking.date}, {booking.startTime} - {booking.endTime}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>
                        <button onClick={() => cancelBooking(booking.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Cancel</button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-10 text-center">
                  <Icons.Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming bookings</p>
                  <button onClick={() => onNavigate('search')} className="mt-3 text-sm text-brand hover:underline font-medium">Browse available rooms →</button>
                </li>
              )}
            </ul>
          </div>

          {/* Requests to Approve */}
          <div className="bg-white shadow rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Pending Approval Requests</h3>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">{pendingToApprove.length}</span>
            </div>
            <ul className="divide-y divide-gray-200">
              {pendingToApprove.length > 0 ? (
                pendingToApprove.map((request) => (
                  <li key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">{request.roomName}</p>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{request.roomType}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{request.purpose}</p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Icons.Calendar className="h-3 w-3" /> {request.date}</span>
                          <span className="flex items-center gap-1"><Icons.Clock className="h-3 w-3" /> {request.startTime} - {request.endTime}</span>
                          <span className="flex items-center gap-1"><Icons.Users className="h-3 w-3" /> {request.userName}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleAction(request.id, 'APPROVED')}
                          className="py-1.5 px-3 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 flex items-center gap-1"
                        >
                          <Icons.Check className="h-3 w-3" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(request.id, 'REJECTED')}
                          className="py-1.5 px-3 border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-50 flex items-center gap-1"
                        >
                          <Icons.X className="h-3 w-3" /> Reject
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-6 text-center text-gray-500 text-sm">No pending requests to review. ✅</li>
              )}
            </ul>
          </div>
        </div>

        {/* Stats Side */}
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow border border-gray-200 text-center">
              <p className="text-sm font-medium text-gray-500">My Bookings</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{bookings.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border border-gray-200 text-center">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="mt-1 text-3xl font-bold text-amber-500">{pendingToApprove.length}</p>
            </div>
          </div>

          <div className="bg-brand rounded-xl p-5 text-white">
            <h3 className="font-semibold text-lg">Book a Room</h3>
            <p className="text-blue-100 text-sm mt-1">Find and book available labs, halls, and seminar rooms.</p>
            <button onClick={() => onNavigate('search')} className="mt-4 w-full bg-white text-brand font-medium text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Browse Rooms →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

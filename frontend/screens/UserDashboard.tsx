import React, { useEffect } from 'react';
import { Icons } from '../components/Icons';
import { useBooking } from '../contexts/BookingContext';

interface DashboardProps {
  role: 'student' | 'faculty';
  onNavigate: (view: string) => void;
}

export const UserDashboard: React.FC<DashboardProps> = ({ role, onNavigate }) => {
  const { bookings, cancelBooking, refreshBookings } = useBooking();

  useEffect(() => {
    refreshBookings();
  }, []);

  const upcomingBookings = bookings.filter(b => b.status === 'APPROVED');
  const pendingRequests = bookings.filter(b => b.status === 'PENDING');

  const getDisplayName = () => {
    const saved = localStorage.getItem('userName');
    if (saved && saved.trim()) {
      return saved.split(' ')[0];
    }
    return role === 'student' ? 'Student' : 'Professor';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, {getDisplayName()} 👋</h2>
        <p className="text-gray-600">You have <span className="font-semibold text-brand">{upcomingBookings.length} upcoming bookings</span> this week.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Bookings</h3>
              <button className="text-sm text-brand font-medium hover:underline">View Calendar</button>
            </div>
            <ul className="divide-y divide-gray-200">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <li key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 p-3 rounded-lg ${booking.roomType === 'Institute Hall' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
                          {booking.roomType === 'Institute Hall' ? <Icons.Users className="h-6 w-6" /> : <Icons.Calendar className="h-6 w-6" />}
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
                  <p className="text-gray-500 font-medium">No upcoming bookings</p>
                  <button onClick={() => onNavigate('search')} className="mt-3 text-sm text-brand hover:underline font-medium">Browse available rooms →</button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow border border-gray-200 text-center">
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{bookings.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border border-gray-200 text-center">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="mt-1 text-3xl font-bold text-yellow-500">{pendingRequests.length}</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Pending Requests</h3>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">{pendingRequests.length}</span>
            </div>
            <ul className="divide-y divide-gray-200">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <li key={request.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{request.roomName}</p>
                        <p className="text-xs text-gray-500">{request.purpose}</p>
                        <p className="text-xs text-gray-400 mt-1">{request.date}, {request.startTime} - {request.endTime}</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full shrink-0">Pending</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-4 text-center text-gray-500 text-sm">No pending requests.</li>
              )}
            </ul>
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

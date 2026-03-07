import React from 'react';
import { Icons } from '../components/Icons';
import { useBooking } from '../contexts/BookingContext';
import { useHistory } from '../contexts/HistoryContext';

interface FacultyAdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const FacultyAdminDashboard: React.FC<FacultyAdminDashboardProps> = ({ onNavigate }) => {
  const { bookings, cancelBooking, updateBookingStatus } = useBooking();
  const { addToHistory } = useHistory();

  // "My Bookings" - simulating the Faculty part of the user
  // We'll assume the user's own bookings are those marked as 'faculty' or 'faculty_admin'
  // For this demo, let's show 'faculty' bookings as "My Bookings"
  const myBookings = bookings.filter(b => b.userRole === 'faculty' || b.userRole === 'faculty_admin');
  const upcomingBookings = myBookings.filter(b => b.status === 'Approved');
  
  // "Requests to Approve" - simulating the Admin part of the user
  // Showing all pending requests that need approval
  const pendingRequestsToApprove = bookings.filter(b => b.status === 'Pending');

  const handleAction = (id: string, action: 'Approve' | 'Reject') => {
    const request = pendingRequestsToApprove.find(r => r.id === id);
    if (request) {
      updateBookingStatus(id, action === 'Approve' ? 'Approved' : 'Rejected');
      
      addToHistory({
        id: Math.random().toString(36).substring(2, 9),
        roomName: request.roomName,
        location: 'Science Block B',
        date: request.date,
        time: request.time,
        purpose: request.purpose,
        status: action === 'Approve' ? 'Approved' : 'Rejected',
        iconType: action === 'Approve' ? 'DoorOpen' : 'Monitor'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, Prof. Grant</h2>
        <p className="text-gray-600">You have <span className="font-semibold text-brand">{upcomingBookings.length} upcoming bookings</span> and <span className="font-semibold text-amber-600">{pendingRequestsToApprove.length} pending requests</span> to review.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions / Upcoming */}
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
                               <div className={`flex-shrink-0 p-3 rounded-lg ${booking.roomType === 'Lecture Hall' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
                                  {booking.roomType === 'Lecture Hall' ? <Icons.Users className="h-6 w-6"/> : <Icons.Calendar className="h-6 w-6"/>}
                               </div>
                               <div>
                                  <p className="text-sm font-medium text-gray-900">{booking.roomName}</p>
                                  <p className="text-sm text-gray-500 mt-1">{booking.purpose}</p>
                                  <div className="mt-2 flex items-center text-xs text-gray-500">
                                     <Icons.Clock className="h-3 w-3 mr-1"/> {booking.date}, {booking.time}
                                  </div>
                               </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{booking.status}</span>
                               <button 
                                 onClick={() => cancelBooking(booking.id)}
                                 className="text-xs text-red-500 hover:text-red-700 font-medium"
                               >
                                 Cancel
                               </button>
                            </div>
                         </div>
                      </li>
                    ))
                  ) : (
                    <li className="p-6 text-center text-gray-500">No upcoming bookings.</li>
                  )}
               </ul>
            </div>
         </div>

         {/* Stats Side */}
         <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-4 rounded-xl shadow border border-gray-200 text-center">
                  <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{bookings.length}</p>
               </div>
               <div className="bg-white p-4 rounded-xl shadow border border-gray-200 text-center">
                  <p className="text-sm font-medium text-gray-500">Hours Booked</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">24h</p>
               </div>
            </div>

            <div className="bg-white shadow rounded-xl border border-gray-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Pending Requests</h3>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">{pendingRequestsToApprove.length}</span>
               </div>
               <ul className="divide-y divide-gray-200">
                  {pendingRequestsToApprove.length > 0 ? (
                    pendingRequestsToApprove.map((request) => (
                      <li key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                         <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                               <div>
                                  <p className="text-sm font-semibold text-gray-900">{request.roomName}</p>
                                  <p className="text-xs text-gray-500">{request.purpose}</p>
                                  <p className="text-xs text-gray-400 mt-1">by {request.userName || 'Unknown'}</p>
                               </div>
                               <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">Pending</span>
                            </div>
                            <div className="flex gap-2 mt-1">
                                <button 
                                  onClick={() => handleAction(request.id, 'Approve')}
                                  className="flex-1 py-1.5 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 flex items-center justify-center gap-1"
                                >
                                  <Icons.Check className="h-3 w-3" /> Approve
                                </button>
                                <button 
                                  onClick={() => handleAction(request.id, 'Reject')}
                                  className="flex-1 py-1.5 border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-50 flex items-center justify-center gap-1"
                                >
                                  <Icons.X className="h-3 w-3" /> Reject
                                </button>
                            </div>
                         </div>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-500 text-sm">No pending requests to review.</li>
                  )}
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
};
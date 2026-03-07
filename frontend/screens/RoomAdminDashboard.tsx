import React from 'react';
import { Icons } from '../components/Icons';
import { useHistory } from '../contexts/HistoryContext';
import { useBooking } from '../contexts/BookingContext';

export const RoomAdminDashboard: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const { addToHistory } = useHistory();
  const { bookings, updateBookingStatus } = useBooking();

  const pendingRequests = bookings.filter(b => b.status === 'Pending');

  const handleAction = (id: string, action: 'Approve' | 'Reject') => {
    const request = pendingRequests.find(r => r.id === id);
    if (request) {
      updateBookingStatus(id, action === 'Approve' ? 'Approved' : 'Rejected');
      
      addToHistory({
        id: Math.random().toString(36).substring(2, 9),
        roomName: request.roomName,
        location: 'Science Block B', // Assuming location based on context
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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold text-gray-900">Room Administration</h2>
           <p className="text-gray-600">Manage bookings and availability for <span className="font-semibold">Science Block B</span>.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
              <Icons.FileText className="h-4 w-4"/> Reports
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
              <Icons.Settings className="h-4 w-4"/> Settings
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-900">{pendingRequests.length}</h3>
               </div>
               <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                  <Icons.Clock className="h-6 w-6" />
               </div>
            </div>
            <div className="mt-4 text-xs font-medium text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded">3 High Priority</div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-sm font-medium text-gray-500">Rooms Managed</p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-900">14</h3>
               </div>
               <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <Icons.DoorOpen className="h-6 w-6" />
               </div>
            </div>
            <div className="mt-4 text-xs font-medium text-gray-500">All rooms operational</div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-sm font-medium text-gray-500">Utilization Today</p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-900">76%</h3>
               </div>
               <div className="p-3 rounded-lg bg-green-50 text-green-600">
                  <Icons.Users className="h-6 w-6" />
               </div>
            </div>
            <div className="mt-4 text-xs font-medium text-green-600 bg-green-50 inline-block px-2 py-1 rounded">+5% from last week</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content: Pending Approvals */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-xl border border-gray-200 overflow-hidden">
               <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                     <Icons.Check className="h-5 w-5 text-brand"/> Booking Requests
                  </h3>
                  <div className="flex gap-2">
                     <span className="text-xs font-medium px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 cursor-pointer hover:bg-gray-50">Newest</span>
                     <span className="text-xs font-medium px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 cursor-pointer hover:bg-gray-50">Filter</span>
                  </div>
               </div>
               <ul className="divide-y divide-gray-200">
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((req) => (
                       <li key={req.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                             <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 shrink-0">
                                   {req.userName ? req.userName.split(' ').map(n => n[0]).join('') : '?'}
                                </div>
                                <div>
                                   <h4 className="text-sm font-bold text-gray-900">{req.userName || 'Unknown User'} <span className="font-normal text-gray-500 text-xs ml-1">• {req.userRole}</span></h4>
                                   <p className="text-sm text-gray-900 mt-0.5">Requesting <span className="font-semibold text-brand">{req.roomName}</span></p>
                                   <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                      <span className="flex items-center gap-1"><Icons.Calendar className="h-3 w-3"/> {req.date}</span>
                                      <span className="flex items-center gap-1"><Icons.Clock className="h-3 w-3"/> {req.time}</span>
                                      <span className="flex items-center gap-1"><Icons.Users className="h-3 w-3"/> 15 ppl</span>
                                   </div>
                                   <p className="mt-2 text-sm text-gray-600 italic">"{req.purpose}"</p>
                                </div>
                             </div>
                             <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                                <button 
                                  onClick={() => handleAction(req.id, 'Approve')}
                                  className="flex items-center justify-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors"
                                >
                                   <Icons.Check className="h-3 w-3"/> Approve
                                </button>
                                <button 
                                  onClick={() => handleAction(req.id, 'Reject')}
                                  className="flex items-center justify-center gap-1 px-3 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-lg transition-colors"
                                >
                                   <Icons.X className="h-3 w-3"/> Reject
                                </button>
                             </div>
                          </div>
                       </li>
                    ))
                  ) : (
                    <li className="p-6 text-center text-gray-500">No pending requests.</li>
                  )}
               </ul>
               <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
                  <button className="text-sm font-medium text-brand hover:text-blue-700">View all pending requests</button>
               </div>
            </div>
         </div>

         {/* Sidebar: Status & Schedule */}
         <div className="space-y-6">
            <div className="bg-white shadow rounded-xl border border-gray-200 p-6">
               <h3 className="text-lg font-bold text-gray-900 mb-4">Room Status</h3>
               <div className="space-y-4">
                  {[
                     { name: 'ELHC 401', status: 'Occupied', until: '11:00 AM' },
                     { name: 'NSL', status: 'Available', until: '02:00 PM' },
                     { name: 'CSED Seminar Hall', status: 'Maintenance', until: 'Tomorrow' },
                  ].map((room, i) => (
                     <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                        <div>
                           <p className="text-sm font-semibold text-gray-900">{room.name}</p>
                           <p className="text-xs text-gray-500">
                              {room.status === 'Available' ? `Free until ${room.until}` : room.status === 'Occupied' ? `Occupied until ${room.until}` : 'Closed'}
                           </p>
                        </div>
                        <span className={`w-2.5 h-2.5 rounded-full ${room.status === 'Available' ? 'bg-green-500' : room.status === 'Occupied' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
                     </div>
                  ))}
               </div>
               <button className="mt-4 w-full py-2 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">View All Rooms</button>
            </div>

            <div className="bg-brand text-white shadow-lg shadow-blue-500/30 rounded-xl p-6 relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">Quick Lock</h3>
                  <p className="text-blue-100 text-sm mb-4">Need to close a room urgently for maintenance?</p>
                  <button 
                    onClick={() => onNavigate && onNavigate('manage_locks')}
                    className="w-full py-2 bg-white text-brand font-bold text-sm rounded-lg hover:bg-blue-50"
                  >
                    Manage Locks
                  </button>
               </div>
               <div className="absolute -right-4 -bottom-4 opacity-10">
                   <Icons.ShieldCheck className="w-32 h-32" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
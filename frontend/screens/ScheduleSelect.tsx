import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Room, UserRole } from '../types';
import { useBooking } from '../contexts/BookingContext';

interface ScheduleSelectProps {
  onBack: () => void;
  onNext: () => void;
  selectedRoom: Room | null;
  userRole: UserRole;
}

export const ScheduleSelect: React.FC<ScheduleSelectProps> = ({ onBack, onNext, selectedRoom, userRole }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const { addBooking } = useBooking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoom && date && startTime && endTime && purpose) {
      addBooking({
        id: Math.random().toString(36).substring(2, 9),
        roomName: selectedRoom.name,
        roomType: selectedRoom.type,
        date: date,
        time: `${startTime} - ${endTime}`,
        status: 'Pending',
        purpose: purpose,
        userRole: userRole,
        userName: userRole === 'student' ? 'Alex' : 'Prof. Grant'
      });
      onNext();
    }
  };

  if (!selectedRoom) {
      return (
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 text-center">
              <h2 className="text-xl font-bold text-gray-900">No room selected</h2>
              <button onClick={onBack} className="mt-4 px-4 py-2 bg-brand text-white rounded-lg">Go Back</button>
          </div>
      )
  }

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30", "22:00"
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Stepper */}
      <div className="mb-10">
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2/3 h-1 bg-brand rounded-full"></div>
          <div className="relative flex justify-between max-w-2xl mx-auto">
             <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm ring-4 ring-white z-10 cursor-pointer" onClick={onBack}><Icons.Check className="h-5 w-5"/></div>
                <span className="text-xs font-medium mt-2 text-brand">Select Room</span>
             </div>
             <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-base shadow-lg ring-4 ring-blue-100 z-10">2</div>
                <span className="text-xs font-bold mt-2 text-gray-900">Schedule & Details</span>
             </div>
             <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm ring-4 ring-white z-10">3</div>
                <span className="text-xs font-medium mt-2 text-gray-400">Confirm</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
            <div className="h-48 relative overflow-hidden group">
               <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
               <div className="absolute bottom-4 left-4 text-white">
                 <h2 className="text-xl font-bold">{selectedRoom.name}</h2>
                 <p className="text-sm text-gray-200 flex items-center gap-1"><Icons.MapPin className="h-3 w-3"/> {selectedRoom.location}</p>
               </div>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">Capacity</span>
                 <span className="font-semibold">{selectedRoom.capacity} People</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">Type</span>
                 <span className="font-semibold">{selectedRoom.type}</span>
               </div>
               <hr className="border-gray-100"/>
               <div className="space-y-2">
                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amenities</p>
                 <div className="flex flex-wrap gap-2">
                    {selectedRoom.amenities.map(a => (
                      <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                        {a}
                      </span>
                    ))}
                 </div>
               </div>
               <div className="pt-2">
                 <button onClick={onBack} className="w-full py-2 text-sm text-brand font-medium flex items-center justify-center gap-2 hover:bg-blue-50 rounded-lg transition-colors">
                   <Icons.Edit className="h-4 w-4"/> Change Room
                 </button>
               </div>
            </div>
          </div>
        </div>

        {/* Schedule Form */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Book Room</h3>
             <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input 
                                type="date" 
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                            <Icons.Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                        <input 
                            type="text" 
                            value={selectedRoom.name} 
                            disabled 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand appearance-none bg-white"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            >
                                <option value="">Select start time</option>
                                {timeSlots.map(time => (
                                    <option key={`start-${time}`} value={time}>{time}</option>
                                ))}
                            </select>
                            <Icons.Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Icons.ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand appearance-none bg-white"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                            >
                                <option value="">Select end time</option>
                                {timeSlots.map(time => (
                                    <option key={`end-${time}`} value={time}>{time}</option>
                                ))}
                            </select>
                            <Icons.Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Icons.ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div>
                   <div className="flex justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Reason for Booking <span className="text-red-500">*</span></label>
                      <span className="text-xs text-gray-400">{purpose.length}/500 characters</span>
                   </div>
                   <textarea 
                        rows={4} 
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand focus:ring-brand p-4 bg-white" 
                        placeholder="Describe the purpose..."
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        required
                        maxLength={500}
                   ></textarea>
                   <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                      <Icons.AlertCircle className="h-3 w-3"/> Faculty members have priority booking.
                   </p>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                    <button type="button" onClick={onBack} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="px-8 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-colors"
                    >
                        Submit Request <Icons.ArrowRight className="h-4 w-4"/>
                    </button>
                </div>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};
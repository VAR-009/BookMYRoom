import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { useLocks, Lock } from '../contexts/LocksContext';
import { useRooms } from '../contexts/RoomContext';

export const ManageLocks: React.FC = () => {
  const { locks, addLock, removeLock } = useLocks();
  const { rooms } = useRooms();
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  // Set initial room if rooms are loaded
  React.useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId]);

  const handleAddLock = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRoomId || !date || !startTime || !endTime || !reason) {
      setError('Please fill in all fields');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    const room = rooms.find(r => r.id === selectedRoomId);
    
    const newLock: Omit<Lock, 'id'> = {
      roomId: selectedRoomId,
      roomName: room ? room.name : 'Unknown Room',
      date,
      startTime,
      endTime,
      reason
    };

    addLock(newLock as Lock);
    
    // Reset form
    setDate('');
    setStartTime('');
    setEndTime('');
    setReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Room Locks</h1>
        <p className="mt-1 text-gray-500">Schedule maintenance or lock rooms for specific time slots.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Lock</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center">
                <Icons.AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleAddLock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-brand focus:border-brand sm:text-sm"
                >
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-brand focus:border-brand sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-brand focus:border-brand sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-brand focus:border-brand sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-brand focus:border-brand sm:text-sm"
                  placeholder="e.g., AC Repair, Cleaning..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
              >
                Lock Room
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Active Locks</h2>
              <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {locks.length} Active
              </span>
            </div>
            
            {locks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Icons.ShieldCheck className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p>No active locks found.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {locks.map((lock) => (
                  <li key={lock.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <Icons.LogOut className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{lock.roomName}</h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <Icons.Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {lock.date}
                            <span className="mx-2">•</span>
                            <Icons.Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {lock.startTime} - {lock.endTime}
                          </div>
                          <p className="mt-2 text-sm text-gray-600 bg-gray-100 inline-block px-2 py-1 rounded">
                            Reason: {lock.reason}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeLock(lock.id)}
                        className="ml-4 p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        title="Remove Lock"
                      >
                        <Icons.Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

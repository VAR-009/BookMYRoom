import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';
import { Room } from '../types';

interface RoomSearchProps {
  onNext: (room: Room) => void;
}

const getImageForType = (type: string) => {
  switch (type) {
    case 'Computer Lab': return 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    case 'Department Hall': return 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    case 'Institute Hall': return 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    default: return 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  }
};

export const RoomSearch: React.FC<RoomSearchProps> = ({ onNext }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/rooms', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          const mapped: Room[] = data.map((r: any) => ({
            id: String(r.id),
            name: r.name,
            type: r.type,
            capacity: r.capacity,
            location: r.location,
            amenities: r.amenities || [],
            status: r.status === 'AVAILABLE' ? 'Available' : 'Occupied',
            image: getImageForType(r.type)
          }));
          setRooms(mapped);
        }
      } catch (e) {
        console.error('Failed to fetch rooms', e);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(room.type);
    return matchesSearch && matchesType;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading rooms...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Stepper */}
      <div className="mb-10">
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-1 bg-brand rounded-full"></div>
          <div className="relative flex justify-between max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm ring-4 ring-white z-10">1</div>
              <span className="text-xs font-semibold mt-2 text-brand">Select Room</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm ring-4 ring-white z-10">2</div>
              <span className="text-xs font-medium mt-2 text-gray-400">Date & Time</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm ring-4 ring-white z-10">3</div>
              <span className="text-xs font-medium mt-2 text-gray-400">Confirm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Icons.Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 bg-white shadow-sm focus:ring-brand focus:border-brand"
              placeholder="Search by name or location..."
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button
                onClick={() => setSelectedTypes([])}
                className="text-sm text-brand hover:text-blue-700 font-medium"
              >
                Reset
              </button>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Room Type</h3>
              <div className="space-y-3">
                {['Computer Lab', 'Department Hall', 'Classroom', 'Institute Hall'].map(t => (
                  <label key={t} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(t)}
                      onChange={() => toggleType(t)}
                      className="h-4 w-4 text-brand border-gray-300 rounded focus:ring-brand"
                    />
                    <span className="ml-3 text-sm text-gray-600">{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Available Rooms</h1>
              <p className="text-sm text-gray-500 mt-1">
                Found <span className="font-medium text-gray-900">{filteredRooms.length}</span> spaces matching your criteria
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="py-2 pl-3 pr-8 text-sm border-gray-200 rounded-lg bg-white shadow-sm focus:ring-brand focus:border-brand cursor-pointer">
                <option>Recommended</option>
                <option>Capacity: Low to High</option>
              </select>
            </div>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="text-center py-20">
              <Icons.Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No rooms found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div key={room.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold text-gray-900 uppercase tracking-wide shadow-sm">
                      {room.type}
                    </div>
                    {room.status === 'Available' ? (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1 rounded-full shadow-sm" title="Available">
                        <Icons.Check className="h-3.5 w-3.5" />
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-red-500 text-white p-1 rounded-full shadow-sm" title="Occupied">
                        <Icons.X className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand transition-colors mb-2">{room.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">Located at {room.location}. Ideal for lectures and group work.</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
                        <Icons.Users className="h-3 w-3 text-brand" /> {room.capacity} Seats
                      </span>
                      {room.amenities.map(a => (
                        <span key={a} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
                          <Icons.Check className="h-3 w-3 text-brand" /> {a}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <button
                        onClick={() => onNext(room)}
                        disabled={room.status !== 'Available'}
                        className="w-full py-2.5 px-4 bg-white border border-brand text-brand hover:bg-brand hover:text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {room.status === 'Available' ? 'Book Room' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

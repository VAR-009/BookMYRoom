import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Icons } from '../components/Icons';
import { Modal } from '../components/Modal';
import { AddRoomModal } from '../components/AddRoomModal';
import { AddUserModal } from '../components/AddUserModal';
import { useBooking } from '../contexts/BookingContext';
import { Room, User } from '../types';

type AdminView = 'dashboard' | 'users' | 'inventory' | 'bookings';

const API_ROOMS = 'http://localhost:8080/api/rooms';
const getToken = () => localStorage.getItem('token');
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [isRoomModalOpen, setRoomModalOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | undefined>(undefined);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const { allBookings, refreshAllBookings, updateBookingStatus } = useBooking();

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Sarah Jenkins',
      email: 'sarah.j@uni.edu',
      role: 'Student',
      department: 'Computer Science',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      email: 'm.chen@uni.edu',
      role: 'Faculty',
      department: 'Engineering',
      status: 'Active',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random'
    }
  ]);

  // Fetch rooms from API
  const fetchRooms = async () => {
    setRoomsLoading(true);
    try {
      const res = await fetch(API_ROOMS, { headers: authHeaders() });
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
          image: r.image || 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        }));
        setRooms(mapped);
      }
    } catch (e) {
      console.error('Failed to fetch rooms', e);
    } finally {
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    refreshAllBookings();
  }, []);

  // ave room to API
  const handleSaveRoom = async (roomData: Partial<Room>) => {
  try {
    const payload = {
      name: roomData.name,
      location: roomData.location,
      type: roomData.type,
      capacity: roomData.capacity,
      amenities: roomData.amenities || [],
      status: 'AVAILABLE'
    };

    // editingRoom.id must exist AND be truthy
    if (editingRoom?.id) {
      await fetch(`http://localhost:8080/api/rooms/room-admin/update/${editingRoom.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
    } else {
      await fetch(`http://localhost:8080/api/rooms/room-admin/add`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
    }

    await fetchRooms();
  } catch (e) {
    console.error('Failed to save room', e);
  }
  setRoomModalOpen(false);
  setEditingRoom(undefined);
};

  const handleSaveUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || 'New User',
      email: userData.email || '',
      role: userData.role || 'Student',
      department: userData.department || 'General',
      status: 'Active',
      avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
      ...userData
    } as User;
    setUsers(prev => [...prev, newUser]);
    setUserModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      const newUsers = data.map((row: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: row.Name || row.name || 'Unknown',
        email: row.Email || row.email || '',
        role: row.Role || row.role || 'Student',
        department: row.Department || row.department || 'General',
        status: row.Status || row.status || 'Active',
        avatar: `https://ui-avatars.com/api/?name=${row.Name || row.name || 'User'}&background=random`
      })) as User[];
      setUsers(prev => [...prev, ...newUsers]);
    };
    reader.readAsBinaryString(file);
  };

  const Sidebar = () => (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-[calc(100vh-64px)] fixed">
      <div className="p-4 space-y-1 flex-1 overflow-y-auto">
        {([
          { view: 'dashboard', label: 'Dashboard', Icon: Icons.LayoutDashboard },
          { view: 'inventory', label: 'Room Inventory', Icon: Icons.DoorOpen },
          { view: 'bookings', label: 'All Bookings', Icon: Icons.Calendar },
          { view: 'users', label: 'User Management', Icon: Icons.Users },
        ] as const).map(({ view, label, Icon }) => (
          <button
            key={view}
            onClick={() => setCurrentView(view)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === view ? 'bg-brand/10 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Icon className="h-5 w-5" /> {label}
          </button>
        ))}
        <div className="pt-4 mt-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50">
            <Icons.Settings className="h-5 w-5" /> Configuration
          </button>
        </div>
      </div>
    </aside>
  );

  const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        { label: 'Total Users', value: users.length.toString(), change: '+12%', icon: Icons.Users, color: 'bg-blue-50 text-blue-600' },
        { label: 'Active Rooms', value: rooms.length.toString(), change: `${rooms.filter(r => r.status === 'Available').length} Available`, icon: Icons.DoorOpen, color: 'bg-purple-50 text-purple-600' },
        { label: 'Pending Approvals', value: allBookings.filter(b => b.status === 'PENDING').length.toString(), change: 'Requires Action', icon: Icons.Clock, color: 'bg-amber-50 text-amber-600' },
        { label: 'System Status', value: 'Online', change: 'All systems go', icon: Icons.ShieldCheck, color: 'bg-green-50 text-green-600' },
      ].map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-900">{stat.value}</h3>
              <span className="text-xs font-medium text-gray-500 mt-2 block">{stat.change}</span>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Real All Bookings Table
  const AllBookingsTable = () => {
    const statusColor: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-600',
    };

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">All Bookings</h2>
            <p className="text-sm text-gray-500">Manage and approve booking requests.</p>
          </div>
          <button onClick={refreshAllBookings} className="flex items-center gap-2 text-sm text-brand hover:underline font-medium">
            <Icons.Clock className="h-4 w-4" /> Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['User', 'Room', 'Date & Time', 'Purpose', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allBookings.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No bookings found.</td></tr>
              ) : (
                allBookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.userName}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-brand">{b.roomName}</p>
                      <p className="text-xs text-gray-400">{b.roomType}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{b.date}<br />{b.startTime} – {b.endTime}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{b.purpose}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor[b.status] || 'bg-gray-100 text-gray-600'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {b.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateBookingStatus(b.id, 'APPROVED')}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateBookingStatus(b.id, 'REJECTED')}
                            className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const UsersTable = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-bold">User Management</h2>
          <p className="text-sm text-gray-500">Manage student, faculty, and admin access.</p>
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            <Icons.FileSpreadsheet className="h-5 w-5" />
            <span>Import Excel</span>
            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
          </label>
          <button onClick={() => setUserModalOpen(true)} className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Icons.Plus className="h-5 w-5" /> Add New User
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['User', 'Role', 'Department', 'Status', 'Actions'].map(h => (
                <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                  <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{user.role}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.department}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{user.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-brand"><Icons.MoreVertical className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const InventoryTable = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-bold">Room Inventory</h2>
          <p className="text-sm text-gray-500">Manage physical spaces across campus.</p>
        </div>
        <button
          onClick={() => { setEditingRoom(undefined); setRoomModalOpen(true); }}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icons.Plus className="h-5 w-5" /> Add New Room
        </button>
      </div>
      {roomsLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Room Info', 'Type', 'Amenities', 'Status', 'Actions'].map(h => (
                  <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <img className="h-10 w-10 rounded-lg object-cover" src={room.image} alt="" />
                    <div>
                      <div className="text-sm font-semibold text-brand">{room.name}</div>
                      <div className="text-xs text-gray-500">{room.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">{room.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.map((a, i) => (
                        <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-200">{a}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      <span className="text-sm">{room.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => { setEditingRoom(room); setRoomModalOpen(true); }}
                      className="text-gray-400 hover:text-brand"
                    >
                      <Icons.Edit className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen pt-16">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {currentView === 'dashboard' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
              <p className="text-gray-500">Welcome back, Admin.</p>
            </div>
            <DashboardStats />
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {allBookings.slice(0, 5).map((b, i) => (
                  <div key={b.id} className="flex gap-3 items-start p-3 hover:bg-gray-50 rounded-lg">
                    <div className={`mt-1 h-2 w-2 rounded-full ${b.status === 'APPROVED' ? 'bg-green-500' : b.status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{b.status === 'APPROVED' ? 'Booking Approved' : b.status === 'PENDING' ? 'Booking Pending' : 'Booking Rejected'}</p>
                      <p className="text-xs text-gray-500">{b.userName} booked {b.roomName}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{b.date} · {b.startTime}–{b.endTime}</p>
                    </div>
                  </div>
                ))}
                {allBookings.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No recent activity.</p>}
              </div>
            </div>
          </>
        )}
        {currentView === 'users' && <UsersTable />}
        {currentView === 'inventory' && <InventoryTable />}
        {currentView === 'bookings' && <AllBookingsTable />}
      </main>

      <Modal isOpen={isRoomModalOpen} onClose={() => { setRoomModalOpen(false); setEditingRoom(undefined); }} title={editingRoom ? 'Edit Room' : 'Add New Room'}>
        <AddRoomModal
          initialData={editingRoom}
          onClose={() => { setRoomModalOpen(false); setEditingRoom(undefined); }}
          onSave={handleSaveRoom}
        />
      </Modal>

      <Modal isOpen={isUserModalOpen} onClose={() => setUserModalOpen(false)} title="Add New User">
        <AddUserModal onClose={() => setUserModalOpen(false)} onSave={handleSaveUser} />
      </Modal>
    </div>
  );
};

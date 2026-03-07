import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Icons } from '../components/Icons';
import { Modal } from '../components/Modal';
import { AddRoomModal } from '../components/AddRoomModal';
import { AddUserModal } from '../components/AddUserModal';
import { Room, User } from '../types';

type AdminView = 'dashboard' | 'users' | 'inventory' | 'bookings';

export const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [isRoomModalOpen, setRoomModalOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | undefined>(undefined);

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

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      name: 'SSL',
      type: 'Computer Lab',
      capacity: 60,
      amenities: ['High-spec PCs', 'Projector', 'AC'],
      status: 'Available',
      location: 'CSED Building',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      name: 'NSL',
      type: 'Computer Lab',
      capacity: 60,
      amenities: ['High-spec PCs', 'Projector', 'AC'],
      status: 'Available',
      location: 'CSED Building',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      name: 'BDL',
      type: 'Computer Lab',
      capacity: 60,
      amenities: ['High-spec PCs', 'Projector', 'AC'],
      status: 'Available',
      location: 'CSED Building',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '4',
      name: 'CSED Seminar Hall',
      type: 'Department Hall',
      capacity: 100,
      amenities: ['Audio System', 'Projector', 'AC'],
      status: 'Available',
      location: 'CSED Building',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '5',
      name: 'APJ Hall',
      type: 'Department Hall',
      capacity: 150,
      amenities: ['Audio System', 'Projector', 'AC', 'Stage'],
      status: 'Available',
      location: 'CSED Building',
      image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '6',
      name: 'Discussion Room',
      type: 'Department Hall',
      capacity: 20,
      amenities: ['Whiteboard', 'Round Table', 'AC'],
      status: 'Available',
      location: 'CSED Building',
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '7',
      name: 'ELHC 401',
      type: 'Classroom',
      capacity: 60,
      amenities: ['Projector', 'Blackboard'],
      status: 'Available',
      location: 'Lecture Hall Complex',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '8',
      name: 'ELHC 402',
      type: 'Classroom',
      capacity: 60,
      amenities: ['Projector', 'Blackboard'],
      status: 'Available',
      location: 'Lecture Hall Complex',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '9',
      name: 'ELHC 403',
      type: 'Classroom',
      capacity: 60,
      amenities: ['Projector', 'Blackboard'],
      status: 'Available',
      location: 'Lecture Hall Complex',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '10',
      name: 'ELHC 404',
      type: 'Classroom',
      capacity: 60,
      amenities: ['Projector', 'Blackboard'],
      status: 'Available',
      location: 'Lecture Hall Complex',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '11',
      name: 'Aryabhatta',
      type: 'Institute Hall',
      capacity: 500,
      amenities: ['Audio System', 'Projector', 'AC', 'Stage', 'Balcony'],
      status: 'Available',
      location: 'Main Building',
      image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '12',
      name: 'Chanakya',
      type: 'Institute Hall',
      capacity: 400,
      amenities: ['Audio System', 'Projector', 'AC', 'Stage'],
      status: 'Available',
      location: 'Main Building',
      image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '13',
      name: 'Bhaskara',
      type: 'Institute Hall',
      capacity: 400,
      amenities: ['Audio System', 'Projector', 'AC', 'Stage'],
      status: 'Available',
      location: 'Main Building',
      image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ]);

  const handleSaveRoom = (roomData: Partial<Room>) => {
    if (editingRoom && editingRoom.id) {
      // Edit existing room
      setRooms(prevRooms => prevRooms.map(room => 
        room.id === editingRoom.id ? { ...room, ...roomData } as Room : room
      ));
    } else {
      // Add new room
      const newRoom: Room = {
        id: Math.random().toString(36).substr(2, 9),
        name: roomData.name || 'New Room',
        location: roomData.location || 'Science Block A',
        type: roomData.type || 'Classroom',
        amenities: roomData.amenities || [],
        status: 'Available',
        capacity: roomData.capacity || 0,
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80', // Default image
        ...roomData
      } as Room;
      setRooms(prevRooms => [...prevRooms, newRoom]);
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
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
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
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
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

  // Sidebar Component
  const Sidebar = () => (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-[calc(100vh-64px)] fixed">
      <div className="p-4 space-y-1 flex-1 overflow-y-auto">
        <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-brand/10 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Icons.LayoutDashboard className="h-5 w-5" /> Dashboard
        </button>
        <button onClick={() => setCurrentView('inventory')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'inventory' ? 'bg-brand/10 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Icons.DoorOpen className="h-5 w-5" /> Room Inventory
        </button>
        <button onClick={() => setCurrentView('bookings')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'bookings' ? 'bg-brand/10 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Icons.Calendar className="h-5 w-5" /> All Bookings
        </button>
        <button onClick={() => setCurrentView('users')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'users' ? 'bg-brand/10 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Icons.Users className="h-5 w-5" /> User Management
        </button>
        <div className="pt-4 mt-4 border-t border-gray-100">
           <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50"><Icons.Settings className="h-5 w-5"/> Configuration</button>
        </div>
      </div>
    </aside>
  );

  const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        { label: 'Total Users', value: '12,450', change: '+12%', icon: Icons.Users, color: 'bg-blue-50 text-blue-600' },
        { label: 'Active Rooms', value: '342', change: '85% Occupancy', icon: Icons.DoorOpen, color: 'bg-purple-50 text-purple-600' },
        { label: 'Pending Approvals', value: '18', change: 'Requires Action', icon: Icons.Clock, color: 'bg-amber-50 text-amber-600' },
        { label: 'System Status', value: 'Online', change: 'All systems go', icon: Icons.ShieldCheck, color: 'bg-green-50 text-green-600' },
      ].map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-sm font-medium text-gray-500">{stat.label}</p>
               <h3 className="text-3xl font-bold mt-2 text-gray-900">{stat.value}</h3>
               <span className="inline-flex items-center text-xs font-medium text-gray-500 mt-2">{stat.change}</span>
             </div>
             <div className={`p-3 rounded-lg ${stat.color}`}>
               <stat.icon className="h-6 w-6" />
             </div>
           </div>
        </div>
      ))}
    </div>
  );

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
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                 {users.map((user) => (
                   <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                         {user.avatar.startsWith('http') ? (
                            <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                         ) : (
                            <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">{user.avatar}</div>
                         )}
                         <div><div className="text-sm font-medium text-gray-900">{user.name}</div><div className="text-xs text-gray-500">{user.email}</div></div>
                      </td>
                      <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{user.role}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.department}</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{user.status}</span></td>
                      <td className="px-6 py-4 text-right"><button className="text-gray-400 hover:text-brand"><Icons.MoreVertical className="h-5 w-5" /></button></td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
    </div>
  );

  const InventoryTable = () => {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200">
             <div>
                <h2 className="text-lg font-bold">Room Inventory</h2>
                <p className="text-sm text-gray-500">Manage physical spaces across campus.</p>
             </div>
             <button onClick={() => { setEditingRoom(undefined); setRoomModalOpen(true); }} className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Icons.Plus className="h-5 w-5" /> Add New Room
             </button>
          </div>
          <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                   <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amenities</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                   {rooms.map((room) => (
                     <tr key={room.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                           <img className="h-10 w-10 rounded-lg object-cover" src={room.image} alt=""/>
                           <div><div className="text-sm font-semibold text-brand">{room.name}</div><div className="text-xs text-gray-500">{room.location}</div></div>
                        </td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${room.type === 'Lecture Hall' ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'}`}>{room.type}</span></td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                           <div className="flex gap-1">
                              {room.amenities.map((amenity, i) => (
                                <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-200">{amenity}</span>
                              ))}
                           </div>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-green-500"></div> <span className="text-sm">{room.status}</span></td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
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
      </div>
    );
  };

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
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                 <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                 <div className="space-y-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex gap-3 items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className={`mt-1 h-2 w-2 rounded-full ${i===1 ? 'bg-green-500' : i===2 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{i===1 ? 'Booking Created' : i===2 ? 'Auth Success' : 'System Alert'}</p>
                          <p className="text-xs text-gray-500">User J.Doe performed action on Lab-304</p>
                          <p className="text-[10px] text-gray-400 mt-1">10:42 AM</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </>
        )}
        {currentView === 'users' && <UsersTable />}
        {currentView === 'inventory' && <InventoryTable />}
        {currentView === 'bookings' && <div className="text-center py-20 text-gray-500">Full Bookings Table Component Placeholder</div>}
      </main>

      <Modal isOpen={isRoomModalOpen} onClose={() => { setRoomModalOpen(false); setEditingRoom(undefined); }} title={editingRoom ? "Edit Room" : "Add New Room"}>
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
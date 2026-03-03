import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icons } from '../components/Icons';
import { useHistory } from '../contexts/HistoryContext';

export const History: React.FC = () => {
  const { history, deleteFromHistory } = useHistory();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
      setDropdownPosition(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleDropdown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (activeDropdown === id) {
      setActiveDropdown(null);
      setDropdownPosition(null);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const dropdownHeight = 100; // Approximate height
      const spaceBelow = window.innerHeight - rect.bottom;
      
      let top = rect.bottom + window.scrollY;
      if (spaceBelow < dropdownHeight) {
        top = rect.top + window.scrollY - dropdownHeight + 40; // Adjust to render above
        // Or better, just above the button:
        top = rect.top + window.scrollY - 50; // 50px for dropdown height (approx)
      }

      // Simple logic: if near bottom, show above
      const showAbove = spaceBelow < 150;
      
      setDropdownPosition({
        top: showAbove ? rect.top + window.scrollY - 60 : rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 192 // 192px is w-48
      });
      setActiveDropdown(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Booking History</h1>
        <p className="mt-1 text-gray-500">Track and manage your past and upcoming room reservations.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
         <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-grow relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Search className="h-5 w-5 text-gray-400" />
               </div>
               <input type="text" className="block w-full pl-10 pr-3 py-2.5 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-brand focus:border-brand sm:text-sm" placeholder="Search by room name..." />
            </div>
            <div className="w-full lg:w-48 relative">
               <select className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-200 bg-white focus:ring-brand focus:border-brand sm:text-sm rounded-lg">
                  <option>All Statuses</option>
                  <option>Approved</option>
                  <option>Rejected</option>
               </select>
            </div>
            <button className="flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">Reset</button>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Room Name</th>
                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Purpose</th>
                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                     <th className="px-6 py-4 relative"><span className="sr-only">Actions</span></th>
                  </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                  {history.length > 0 ? (
                    history.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                         <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                               <div className={`h-10 w-10 flex-shrink-0 rounded-lg flex items-center justify-center ${item.iconType === 'DoorOpen' ? 'bg-blue-50 text-brand' : 'bg-purple-50 text-purple-600'}`}>
                                  {item.iconType === 'DoorOpen' ? <Icons.DoorOpen className="h-6 w-6"/> : <Icons.Monitor className="h-6 w-6"/>}
                               </div>
                               <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{item.roomName}</div>
                                  <div className="text-xs text-gray-500">{item.location}</div>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">{item.date}</div>
                            <div className="text-xs text-gray-500">{item.time}</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.purpose}</td>
                         <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.status}
                            </span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                            <button 
                              onClick={(e) => toggleDropdown(e, item.id)}
                              className="text-gray-400 hover:text-brand"
                            >
                              <Icons.MoreVertical className="h-5 w-5"/>
                            </button>
                         </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No history available.</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
      {activeDropdown && dropdownPosition && createPortal(
        <div 
          className="absolute w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteFromHistory(activeDropdown);
                setActiveDropdown(null);
                setDropdownPosition(null);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              role="menuitem"
            >
              <Icons.Trash2 className="mr-3 h-4 w-4" />
              Delete History
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
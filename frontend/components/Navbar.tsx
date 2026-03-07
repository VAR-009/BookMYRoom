import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { UserRole } from '../types';

interface NavbarProps {
  role: UserRole;
  activeTab: string;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ role, activeTab, onLogout, onNavigate }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getLinkClass = (tabName: string) => {
    return activeTab === tabName
      ? "border-brand text-brand inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors"
      : "border-transparent text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors";
  };

  const getUserName = () => {
    switch (role) {
      case 'admin': return 'Dr. Admin User';
      case 'faculty': return 'Dr. Sarah Jenkins';
      case 'room_admin': return 'Staff. Mark Operations';
      case 'faculty_admin': return 'Prof. Alan Grant';
      default: return 'Alex Student';
    }
  };

  const getUserInitials = () => {
    switch (role) {
      case 'admin': return 'DA';
      case 'faculty': return 'SJ';
      case 'room_admin': return 'MO';
      case 'faculty_admin': return 'AG';
      default: return 'AS';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between h-full">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
              <div className="h-8 w-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-lg">B</div>
              <span className="font-bold text-xl tracking-tight text-gray-900">BookMyRoom</span>
            </div>
            {role !== 'admin' && (
              <div className="hidden md:ml-8 md:flex md:space-x-8 h-full">
                <button onClick={() => onNavigate('dashboard')} className={getLinkClass('dashboard')}>Dashboard</button>
                {role !== 'room_admin' && (
                  <button onClick={() => onNavigate('search')} className={getLinkClass('search')}>Browse Rooms</button>
                )}
                <button onClick={() => onNavigate('history')} className={getLinkClass('history')}>My History</button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
                title="Settings"
              >
                <Icons.Settings className="h-6 w-6" />
              </button>
              
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => {
                        setIsSettingsOpen(false);
                        onNavigate('change_password');
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <Icons.Lock className="mr-3 h-4 w-4 text-gray-400" />
                      Change Password
                    </button>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-not-allowed opacity-70"
                      role="menuitem"
                      title="Coming soon"
                    >
                      <Icons.Moon className="mr-3 h-4 w-4 text-gray-400" />
                      Dark Mode
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <Icons.Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                   {getUserName()}
                </p>
                <p className="text-xs text-gray-500 capitalize">{role.replace('_', ' ')}</p>
              </div>
              <button className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-transparent hover:ring-brand transition-all">
                <span className="font-bold text-gray-600 text-xs">
                  {getUserInitials()}
                </span>
              </button>
              <button onClick={onLogout} className="text-gray-400 hover:text-red-500 ml-2">
                <Icons.LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
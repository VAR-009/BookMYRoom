import React, { useState } from 'react';
import { ScreenView, UserRole, Room } from './types';
import { Auth } from './screens/Auth';
import { RoomSearch } from './screens/RoomSearch';
import { ScheduleSelect } from './screens/ScheduleSelect';
import { Confirmation } from './screens/Confirmation';
import { History } from './screens/History';
import { AdminDashboard } from './screens/AdminDashboard';
import { UserDashboard } from './screens/UserDashboard';
import { RoomAdminDashboard } from './screens/RoomAdminDashboard';
import { FacultyAdminDashboard } from './screens/FacultyAdminDashboard';
import { ManageLocks } from './screens/ManageLocks';
import { Navbar } from './components/Navbar';
import { HistoryProvider } from './contexts/HistoryContext';
import { LocksProvider } from './contexts/LocksContext';
import { BookingProvider } from './contexts/BookingContext';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>(ScreenView.AUTH_SIGNIN);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Handle Login Logic
  const handleLogin = (role: string) => {
    setUserRole(role as UserRole);
    if (role === 'admin') {
      setCurrentScreen(ScreenView.ADMIN_DASHBOARD);
    } else if (role === 'faculty') {
      setCurrentScreen(ScreenView.FACULTY_DASHBOARD);
    } else if (role === 'room_admin') {
      setCurrentScreen(ScreenView.ROOM_ADMIN_DASHBOARD);
    } else if (role === 'faculty_admin') {
      setCurrentScreen(ScreenView.FACULTY_ADMIN_DASHBOARD);
    } else {
      setCurrentScreen(ScreenView.STUDENT_DASHBOARD);
    }
  };

  const handleLogout = () => {
    setCurrentScreen(ScreenView.AUTH_SIGNIN);
  };

  const navigateTo = (view: string) => {
    switch(view) {
        case 'dashboard':
            if(userRole === 'admin') setCurrentScreen(ScreenView.ADMIN_DASHBOARD);
            else if(userRole === 'faculty') setCurrentScreen(ScreenView.FACULTY_DASHBOARD);
            else if(userRole === 'room_admin') setCurrentScreen(ScreenView.ROOM_ADMIN_DASHBOARD);
            else if(userRole === 'faculty_admin') setCurrentScreen(ScreenView.FACULTY_ADMIN_DASHBOARD);
            else setCurrentScreen(ScreenView.STUDENT_DASHBOARD);
            break;
        case 'search': setCurrentScreen(ScreenView.ROOM_SEARCH); break;
        case 'history': setCurrentScreen(ScreenView.HISTORY); break;
        case 'manage_locks': setCurrentScreen(ScreenView.MANAGE_LOCKS); break;
        default: break;
    }
  };

  const getActiveTab = () => {
    if (currentScreen === ScreenView.STUDENT_DASHBOARD || currentScreen === ScreenView.FACULTY_DASHBOARD || currentScreen === ScreenView.ADMIN_DASHBOARD || currentScreen === ScreenView.ROOM_ADMIN_DASHBOARD || currentScreen === ScreenView.FACULTY_ADMIN_DASHBOARD) return 'dashboard';
    if (currentScreen === ScreenView.ROOM_SEARCH || currentScreen === ScreenView.SCHEDULE_SELECT || currentScreen === ScreenView.CONFIRMATION) return 'search';
    if (currentScreen === ScreenView.HISTORY) return 'history';
    if (currentScreen === ScreenView.MANAGE_LOCKS) return 'manage_locks';
    return '';
  };

  const activeTab = getActiveTab();

  // Render Logic
  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenView.AUTH_SIGNIN:
        return <Auth mode="signin" onSwitch={() => setCurrentScreen(ScreenView.AUTH_SIGNUP)} onLogin={handleLogin} />;
      case ScreenView.AUTH_SIGNUP:
        return <Auth mode="signup" onSwitch={() => setCurrentScreen(ScreenView.AUTH_SIGNIN)} onLogin={handleLogin} />;
      
      // Admin Flows
      case ScreenView.ADMIN_DASHBOARD:
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar role="admin" activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} />
                <AdminDashboard />
            </div>
        );

      // User Flows (Student/Faculty)
      case ScreenView.STUDENT_DASHBOARD:
      case ScreenView.FACULTY_DASHBOARD:
         return (
             <div className="min-h-screen bg-gray-50">
                 <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} />
                 <UserDashboard role={userRole === 'faculty' ? 'faculty' : 'student'} onNavigate={navigateTo} />
             </div>
         );

      case ScreenView.ROOM_ADMIN_DASHBOARD:
          return (
              <div className="min-h-screen bg-gray-50">
                  <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} />
                  <RoomAdminDashboard onNavigate={navigateTo} />
              </div>
          );

      case ScreenView.FACULTY_ADMIN_DASHBOARD:
          return (
              <div className="min-h-screen bg-gray-50">
                  <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} />
                  <FacultyAdminDashboard onNavigate={navigateTo} />
              </div>
          );
      
      case ScreenView.ROOM_SEARCH:
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} />
                <RoomSearch onNext={(room) => {
                    setSelectedRoom(room);
                    setCurrentScreen(ScreenView.SCHEDULE_SELECT);
                }} />
            </div>
        );

      case ScreenView.SCHEDULE_SELECT:
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} />
                <ScheduleSelect 
                    selectedRoom={selectedRoom}
                    userRole={userRole}
                    onBack={() => setCurrentScreen(ScreenView.ROOM_SEARCH)} 
                    onNext={() => setCurrentScreen(ScreenView.CONFIRMATION)} 
                />
            </div>
        );
      
      case ScreenView.CONFIRMATION:
         return (
            <div className="min-h-screen bg-gray-50">
                <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} />
                <Confirmation 
                    selectedRoom={selectedRoom}
                    onDashboard={() => navigateTo('dashboard')} 
                />
            </div>
         );

      case ScreenView.HISTORY:
         return (
            <div className="min-h-screen bg-gray-50">
                <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} />
                <History />
            </div>
         );

      case ScreenView.MANAGE_LOCKS:
          return (
             <div className="min-h-screen bg-gray-50">
                 <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} />
                 <ManageLocks />
             </div>
          );
      
      default:
        return <div>Screen not found</div>;
    }
  };

  return (
    <HistoryProvider>
      <LocksProvider>
        <BookingProvider>
          {renderScreen()}
        </BookingProvider>
      </LocksProvider>
    </HistoryProvider>
  );
};

export default App;
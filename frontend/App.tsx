import React, { useState, useEffect } from 'react';
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
import { ChangePassword } from './screens/ChangePassword';
import { Navbar } from './components/Navbar';
import { LocksProvider } from './contexts/LocksContext';
import { BookingProvider } from './contexts/BookingContext';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>(ScreenView.AUTH_SIGNIN);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  // Store booking details for Confirmation screen
  const [lastBookingDate, setLastBookingDate] = useState('');
  const [lastBookingStart, setLastBookingStart] = useState('');
  const [lastBookingEnd, setLastBookingEnd] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');
    const forceReset = params.get('forcePasswordReset');
    const name = params.get('name');
    const email = params.get('email');

    if (token && role) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      if (name) { const n = decodeURIComponent(name); localStorage.setItem('userName', n); setUserName(n); }
      if (email) { const e = decodeURIComponent(email); localStorage.setItem('userEmail', e); setUserEmail(e); }
      window.history.replaceState({}, '', '/');
      if (forceReset === 'true') {
        setMustChangePassword(true);
        setUserRole(role as UserRole);
        setCurrentScreen(ScreenView.CHANGE_PASSWORD);
      } else {
        handleLoginDirect(role, token);
      }
    } else {
      const savedToken = localStorage.getItem('token');
      const savedRole = localStorage.getItem('role');
      const savedName = localStorage.getItem('userName');
      const savedEmail = localStorage.getItem('userEmail');
      if (savedToken && savedRole) {
        if (savedName) setUserName(savedName);
        if (savedEmail) setUserEmail(savedEmail);
        handleLoginDirect(savedRole, savedToken);
      }
    }
  }, []);

  const handleLoginDirect = (role: string, token?: string) => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
    }
    setUserRole(role as UserRole);
    if (role === 'admin') setCurrentScreen(ScreenView.ADMIN_DASHBOARD);
    else if (role === 'faculty') setCurrentScreen(ScreenView.FACULTY_DASHBOARD);
    else if (role === 'room_admin') setCurrentScreen(ScreenView.ROOM_ADMIN_DASHBOARD);
    else if (role === 'faculty_admin') setCurrentScreen(ScreenView.FACULTY_ADMIN_DASHBOARD);
    else setCurrentScreen(ScreenView.STUDENT_DASHBOARD);
  };

  const handleLogin = (role: string, token?: string) => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
    }
    setUserRole(role as UserRole);
    if (role === 'admin') setCurrentScreen(ScreenView.ADMIN_DASHBOARD);
    else if (role === 'faculty') setCurrentScreen(ScreenView.FACULTY_DASHBOARD);
    else if (role === 'room_admin') setCurrentScreen(ScreenView.ROOM_ADMIN_DASHBOARD);
    else if (role === 'faculty_admin') setCurrentScreen(ScreenView.FACULTY_ADMIN_DASHBOARD);
    else setCurrentScreen(ScreenView.STUDENT_DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserName('');
    setUserEmail('');
    setMustChangePassword(false);
    setCurrentScreen(ScreenView.AUTH_SIGNIN);
  };

  const handlePasswordChanged = () => {
    setMustChangePassword(false);
    const role = localStorage.getItem('role') || 'student';
    handleLoginDirect(role);
  };

  const navigateTo = (view: string) => {
    switch (view) {
      case 'dashboard':
        if (userRole === 'admin') setCurrentScreen(ScreenView.ADMIN_DASHBOARD);
        else if (userRole === 'faculty') setCurrentScreen(ScreenView.FACULTY_DASHBOARD);
        else if (userRole === 'room_admin') setCurrentScreen(ScreenView.ROOM_ADMIN_DASHBOARD);
        else if (userRole === 'faculty_admin') setCurrentScreen(ScreenView.FACULTY_ADMIN_DASHBOARD);
        else setCurrentScreen(ScreenView.STUDENT_DASHBOARD);
        break;
      case 'search': setCurrentScreen(ScreenView.ROOM_SEARCH); break;
      case 'history': setCurrentScreen(ScreenView.HISTORY); break;
      case 'manage_locks': setCurrentScreen(ScreenView.MANAGE_LOCKS); break;
      case 'change_password': setCurrentScreen(ScreenView.CHANGE_PASSWORD); break;
      default: break;
    }
  };

  const getActiveTab = () => {
    if ([ScreenView.STUDENT_DASHBOARD, ScreenView.FACULTY_DASHBOARD, ScreenView.ADMIN_DASHBOARD,
         ScreenView.ROOM_ADMIN_DASHBOARD, ScreenView.FACULTY_ADMIN_DASHBOARD].includes(currentScreen)) return 'dashboard';
    if ([ScreenView.ROOM_SEARCH, ScreenView.SCHEDULE_SELECT, ScreenView.CONFIRMATION].includes(currentScreen)) return 'search';
    if (currentScreen === ScreenView.HISTORY) return 'history';
    if (currentScreen === ScreenView.MANAGE_LOCKS) return 'manage_locks';
    return '';
  };

  const withNav = (children: React.ReactNode) => (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        role={userRole}
        userName={userName}
        userEmail={userEmail}
        activeTab={getActiveTab()}
        onLogout={handleLogout}
        onNavigate={navigateTo}
      />
      {children}
    </div>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenView.AUTH_SIGNIN:
        return <Auth mode="signin" onSwitch={() => setCurrentScreen(ScreenView.AUTH_SIGNUP)} onLogin={handleLogin} />;
      case ScreenView.AUTH_SIGNUP:
        return <Auth mode="signup" onSwitch={() => setCurrentScreen(ScreenView.AUTH_SIGNIN)} onLogin={handleLogin} />;
      case ScreenView.ADMIN_DASHBOARD:
        return withNav(<AdminDashboard />);
      case ScreenView.STUDENT_DASHBOARD:
      case ScreenView.FACULTY_DASHBOARD:
        return withNav(<UserDashboard role={userRole === 'faculty' ? 'faculty' : 'student'} onNavigate={navigateTo} />);
      case ScreenView.ROOM_ADMIN_DASHBOARD:
        return withNav(<RoomAdminDashboard onNavigate={navigateTo} />);
      case ScreenView.FACULTY_ADMIN_DASHBOARD:
        return withNav(<FacultyAdminDashboard onNavigate={navigateTo} />);
      case ScreenView.ROOM_SEARCH:
        return withNav(
          <RoomSearch onNext={(room) => {
            setSelectedRoom(room);
            setCurrentScreen(ScreenView.SCHEDULE_SELECT);
          }} />
        );
      case ScreenView.SCHEDULE_SELECT:
        return withNav(
          <ScheduleSelect
            selectedRoom={selectedRoom}
            userRole={userRole}
            onBack={() => setCurrentScreen(ScreenView.ROOM_SEARCH)}
            onNext={(date, startTime, endTime) => {
              setLastBookingDate(date);
              setLastBookingStart(startTime);
              setLastBookingEnd(endTime);
              setCurrentScreen(ScreenView.CONFIRMATION);
            }}
          />
        );
      case ScreenView.CONFIRMATION:
        return withNav(
          <Confirmation
            selectedRoom={selectedRoom}
            bookingDate={lastBookingDate}
            bookingStartTime={lastBookingStart}
            bookingEndTime={lastBookingEnd}
            onDashboard={() => navigateTo('dashboard')}
          />
        );
      case ScreenView.HISTORY:
        return withNav(<History />);
      case ScreenView.MANAGE_LOCKS:
        return withNav(<ManageLocks />);
      case ScreenView.CHANGE_PASSWORD:
        return withNav(
          <ChangePassword
            mustChangePassword={mustChangePassword}
            onSuccess={handlePasswordChanged}
            onCancel={() => mustChangePassword ? handleLogout() : navigateTo('dashboard')}
          />
        );
      default:
        return <div>Screen not found</div>;
    }
  };

  return (
    <LocksProvider>
      <BookingProvider>
        {renderScreen()}
      </BookingProvider>
    </LocksProvider>
  );
};

export default App;

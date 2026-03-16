import React, { useState, useEffect } from 'react';
import { ScreenView, UserRole, Room, User } from './types';
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
import { SetupPassword } from './screens/SetupPassword';
import { Navbar } from './components/Navbar';
import { HistoryProvider } from './contexts/HistoryContext';
import { LocksProvider } from './contexts/LocksContext';
import { BookingProvider } from './contexts/BookingContext';
import { RoomProvider } from './contexts/RoomContext';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>(ScreenView.AUTH_SIGNIN);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = firebaseUser.email === 'varun.yelchuri10@gmail.com';
        
        // Fetch or create user profile
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setCurrentUser(userData);
          setUserRole(userData.role);
          
          if (!userData.hasPasswordSet) {
            if (isAdmin) {
              try {
                // Auto-set admin password to temp@123
                await updatePassword(firebaseUser, 'temp@123');
                await updateDoc(userDocRef, { hasPasswordSet: true });
                setCurrentUser({ ...userData, hasPasswordSet: true });
                navigateToRoleDashboard(userData.role);
              } catch (err) {
                console.error('Failed to auto-set admin password:', err);
                setCurrentScreen(ScreenView.SETUP_PASSWORD);
              }
            } else {
              setCurrentScreen(ScreenView.SETUP_PASSWORD);
            }
          } else {
            navigateToRoleDashboard(userData.role);
          }
        } else {
          // Create new user profile
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            role: isAdmin ? 'admin' : 'student',
            department: isAdmin ? 'Administration' : 'General',
            status: 'Active',
            avatar: firebaseUser.photoURL || '',
            hasPasswordSet: false
          };
          
          if (isAdmin) {
            try {
              // Auto-set admin password to temp@123
              await updatePassword(firebaseUser, 'temp@123');
              newUser.hasPasswordSet = true;
            } catch (err) {
              console.error('Failed to auto-set admin password:', err);
            }
          }
          
          await setDoc(userDocRef, newUser);
          setCurrentUser(newUser);
          setUserRole(newUser.role);
          
          if (newUser.hasPasswordSet) {
            navigateToRoleDashboard(newUser.role);
          } else {
            setCurrentScreen(ScreenView.SETUP_PASSWORD);
          }
        }
      } else {
        setCurrentUser(null);
        setCurrentScreen(ScreenView.AUTH_SIGNIN);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const navigateToRoleDashboard = (role: UserRole) => {
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

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navigateTo = (view: string) => {
    switch(view) {
        case 'dashboard':
            navigateToRoleDashboard(userRole);
            break;
        case 'search': setCurrentScreen(ScreenView.ROOM_SEARCH); break;
        case 'history': setCurrentScreen(ScreenView.HISTORY); break;
        case 'manage_locks': setCurrentScreen(ScreenView.MANAGE_LOCKS); break;
        case 'change_password': setCurrentScreen(ScreenView.CHANGE_PASSWORD); break;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading BookMyRoom...</p>
        </div>
      </div>
    );
  }

  // Render Logic
  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenView.AUTH_SIGNIN:
        return <Auth onLogin={() => {}} />;
      
      case ScreenView.SETUP_PASSWORD:
        return <SetupPassword onComplete={() => navigateToRoleDashboard(userRole)} />;
      
      // Admin Flows
      case ScreenView.ADMIN_DASHBOARD:
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar role="admin" activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} user={currentUser} />
                <AdminDashboard />
            </div>
        );

      // User Flows (Student/Faculty)
      case ScreenView.STUDENT_DASHBOARD:
      case ScreenView.FACULTY_DASHBOARD:
         return (
             <div className="min-h-screen bg-gray-50">
                 <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} user={currentUser} />
                 <UserDashboard role={userRole === 'faculty' ? 'faculty' : 'student'} onNavigate={navigateTo} />
             </div>
         );

      case ScreenView.ROOM_ADMIN_DASHBOARD:
          return (
              <div className="min-h-screen bg-gray-50">
                  <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} user={currentUser} />
                  <RoomAdminDashboard onNavigate={navigateTo} />
              </div>
          );

      case ScreenView.FACULTY_ADMIN_DASHBOARD:
          return (
              <div className="min-h-screen bg-gray-50">
                  <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} user={currentUser} />
                  <FacultyAdminDashboard onNavigate={navigateTo} />
              </div>
          );
      
      case ScreenView.ROOM_SEARCH:
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} user={currentUser} />
                <RoomSearch onNext={(room) => {
                    setSelectedRoom(room);
                    setCurrentScreen(ScreenView.SCHEDULE_SELECT);
                }} />
            </div>
        );

      case ScreenView.SCHEDULE_SELECT:
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} user={currentUser} />
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
                <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} user={currentUser} />
                <Confirmation 
                    selectedRoom={selectedRoom}
                    onDashboard={() => navigateTo('dashboard')} 
                />
            </div>
         );

      case ScreenView.HISTORY:
         return (
            <div className="min-h-screen bg-gray-50">
                <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} user={currentUser} />
                <History />
            </div>
         );

      case ScreenView.MANAGE_LOCKS:
          return (
             <div className="min-h-screen bg-gray-50">
                 <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} user={currentUser} />
                 <ManageLocks />
             </div>
          );

      case ScreenView.CHANGE_PASSWORD:
          return (
             <div className="min-h-screen bg-gray-50">
                 <Navbar role={userRole} activeTab={activeTab} onLogout={handleLogout} onNavigate={navigateTo} user={currentUser} />
                 <ChangePassword onCancel={() => navigateTo('dashboard')} />
             </div>
          );
      
      default:
        return <div>Screen not found</div>;
    }
  };

  return (
    <RoomProvider>
      <HistoryProvider>
        <LocksProvider>
          <BookingProvider>
            {renderScreen()}
          </BookingProvider>
        </LocksProvider>
      </HistoryProvider>
    </RoomProvider>
  );
};

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import RoomList from "./pages/student/RoomList";
import BookRoom from "./pages/student/BookRoom";
import MyBookings from "./pages/student/MyBookings";
import BookingStatus from "./pages/student/BookingStatus";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRooms from "./pages/admin/ManageRooms";
import ApproveBookings from "./pages/admin/ApproveBookings";

// Faculty Pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";

// Room Admin Pages
import RoomAdminDashboard from "./pages/roomAdmin/RoomAdminDashboard";

// Temporary role (will come from backend after login)
const userRole = "ROOM_ADMIN";
// or "FACULTY"
// or "ROOM_ADMIN"


// Simple Protected Route (RBAC)
function ProtectedRoute({ allowedRole, children }) {
  if (userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Route */}
        <Route
          path="/"
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h1>Classroom, Lab & Hall Booking System</h1>
              <p>React frontend setup using Vite is successful.</p>
              <p>Student module loaded.</p>
            </div>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/rooms"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <RoomList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/book"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <BookRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/bookings"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/status"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <BookingStatus />
            </ProtectedRoute>
          }
        />
                {/* Faculty Routes */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRole="FACULTY">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ManageRooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/approve"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ApproveBookings />
            </ProtectedRoute>
          }
        />

        {/* Room Admin Routes */}
        <Route
          path="/room-admin"
          element={
            <ProtectedRoute allowedRole="ROOM_ADMIN">
              <RoomAdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

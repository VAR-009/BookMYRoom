import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

/* ================= LOGIN PAGES ================= */
import StudentLoginPage from "./pages/student/StudentLoginPage";
import FacultyLoginPage from "./pages/faculty/FacultyLoginPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import RoomAdminLoginPage from "./pages/roomAdmin/RoomAdminLoginPage";

/* ================= STUDENT PAGES ================= */
import StudentDashboard from "./pages/student/StudentDashboard";
import RoomList from "./pages/student/RoomList";
import BookRoom from "./pages/student/BookRoom";
import MyBookings from "./pages/student/MyBookings";
import BookingStatus from "./pages/student/BookingStatus";

/* ================= FACULTY PAGES ================= */
import FacultyDashboard from "./pages/faculty/FacultyDashboard";

/* ================= ADMIN PAGES ================= */
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRooms from "./pages/admin/ManageRooms";
import ApproveBookings from "./pages/admin/ApproveBookings";

/* ================= ROOM ADMIN PAGES ================= */
import RoomAdminDashboard from "./pages/roomAdmin/RoomAdminDashboard";

/* ===================================================
   TEMP: This will come from backend / AuthContext later
=================================================== */
const userRole = "ADMIN";
// "STUDENT" | "FACULTY" | "ADMIN" | "ROOM_ADMIN"

/* ================= RBAC PROTECTED ROUTE ================= */
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

        {/* ============== PUBLIC ROUTES ============== */}

        {/* Role Selection Page */}
        <Route path="/" element={<LoginPage />} />

        {/* Individual Login Pages */}
        <Route path="/student-login" element={<StudentLoginPage />} />
        <Route path="/faculty-login" element={<FacultyLoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/room-admin-login" element={<RoomAdminLoginPage />} />

        {/* ============== STUDENT ROUTES ============== */}
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

        {/* ============== FACULTY ROUTES ============== */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRole="FACULTY">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* ============== ADMIN ROUTES ============== */}
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

        {/* ============== ROOM ADMIN ROUTES ============== */}
        <Route
          path="/room-admin"
          element={
            <ProtectedRoute allowedRole="ROOM_ADMIN">
              <RoomAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ============== FALLBACK ROUTE ============== */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

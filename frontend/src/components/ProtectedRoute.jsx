import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ role, allowedRole, children }) {
  if (role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

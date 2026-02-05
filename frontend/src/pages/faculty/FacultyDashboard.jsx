export default function FacultyDashboard() {
  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: "#2563eb" }}>Faculty Dashboard</h1>
      <p>Manage your room booking requests</p>

      <div style={{
        background: "#fff",
        padding: "1.5rem",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        marginBottom: "1.5rem"
      }}>
        <h3>Request Booking</h3>
        <p>Book classrooms, labs, or halls for academic purposes.</p>
      </div>

      <div style={{
        background: "#fff",
        padding: "1.5rem",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
      }}>
        <h3>My Bookings</h3>
        <p>View and manage your existing bookings.</p>
      </div>
    </div>
  );
}

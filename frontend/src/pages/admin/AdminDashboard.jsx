export default function AdminDashboard() {
  const containerStyle = {
    padding: "2rem",
    maxWidth: "900px",
    margin: "0 auto",
  };

  const cardStyle = {
    background: "#ffffff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    marginBottom: "1.5rem",
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: "#2563eb" }}>Admin Dashboard</h1>
      <p>System-level administration and control</p>

      <div style={cardStyle}>
        <h3>Manage Rooms</h3>
        <p>Add, update, or remove classrooms, labs, and halls.</p>
      </div>

      <div style={cardStyle}>
        <h3>Approve / Reject Bookings</h3>
        <p>Review booking requests across all rooms.</p>
      </div>
    </div>
  );
}

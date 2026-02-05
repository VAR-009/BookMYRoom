export default function RoomAdminDashboard() {
  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: "#2563eb" }}>Room Admin Dashboard</h1>
      <p>Approve bookings for assigned rooms</p>

      <div style={{
        background: "#2e0dc1",
        padding: "1.5rem",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
      }}>
        <h3>Pending Requests</h3>
        <p>Approve or reject booking requests for your rooms.</p>
      </div>
    </div>
  );
}

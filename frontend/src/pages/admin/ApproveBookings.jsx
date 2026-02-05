export default function ApproveBookings() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ color: "#2563eb" }}>Approve / Reject Bookings</h2>
      <p>View all booking requests and take action.</p>

      <div style={{
        background: "#fff",
        padding: "1.5rem",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
      }}>
        <p>Pending booking requests will be shown here.</p>
      </div>
    </div>
  );
}

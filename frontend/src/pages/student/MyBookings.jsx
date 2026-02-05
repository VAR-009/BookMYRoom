import StudentLayout from "../../components/StudentLayout";

export default function MyBookings() {
  return (
    <StudentLayout title="My Bookings">
      <h3>Upcoming</h3>
      <Booking room="CSE-101" status="Approved" />
      <h3 style={{ marginTop: "1.5rem" }}>Past</h3>
      <Booking room="Main Hall" status="Completed" />
    </StudentLayout>
  );
}

function Booking({ room, status }) {
  return (
    <div style={booking}>
      <strong>{room}</strong>
      <span>{status}</span>
      <button style={cancel}>Cancel</button>
    </div>
  );
}

const booking = {
  display: "flex",
  justifyContent: "space-between",
  padding: "1rem",
  background: "#f8fafc",
  borderRadius: "6px",
  marginBottom: "0.5rem"
};

const cancel = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "4px"
};

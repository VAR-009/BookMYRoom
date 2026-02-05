import StudentLayout from "../../components/StudentLayout";

export default function BookingStatus() {
  return (
    <StudentLayout title="Booking Status">
      <div style={statusBox}>
        <h2>Status: Pending</h2>
        <p>Cooldown Time: 20 mins left</p>
        <button style={hold}>HOLD</button>
      </div>
    </StudentLayout>
  );
}

const statusBox = {
  textAlign: "center",
  padding: "2rem",
  background: "#fef3c7",
  borderRadius: "10px"
};

const hold = {
  marginTop: "1rem",
  padding: "10px 20px",
  background: "#f59e0b",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold"
};

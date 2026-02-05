import StudentLayout from "../../components/StudentLayout";

export default function BookRoom() {
  return (
    <StudentLayout title="Book a Room">
      <form style={form}>
        <input placeholder="Room Name" />
        <input type="date" />
        <input type="time" />
        <input type="time" />
        <textarea placeholder="Purpose (Hackathon / Class / Event)" />
        <button style={btn}>Submit Booking</button>
      </form>
    </StudentLayout>
  );
}

const form = {
  display: "grid",
  gap: "1rem"
};

const btn = {
  background: "#16a34a",
  color: "#fff",
  padding: "10px",
  border: "none",
  borderRadius: "6px"
};

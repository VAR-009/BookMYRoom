import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/StudentLayout";

export default function StudentDashboard() {
  const navigate = useNavigate();

  // Temporary student data (later from backend)
  const student = {
    name: "Asif Mohammed",
    roll: "B220397CS",
    branch: "Computer Science & Engineering",
  };


  return (
    <StudentLayout title="Student Dashboard" student={student}>
      <div style={grid}>

        <DashboardCard
          title="Available Rooms"
          desc="Browse classrooms, labs and halls"
          emoji="🏫"
          color="#2563eb"
          onClick={() => navigate("/student/rooms")}
        />

        <DashboardCard
          title="New Booking"
          desc="Request a room for class or event"
          emoji="📝"
          color="#16a34a"
          onClick={() => navigate("/student/book")}
        />

        <DashboardCard
          title="My Bookings"
          desc="View past and upcoming bookings"
          emoji="📅"
          color="#7c3aed"
          onClick={() => navigate("/student/bookings")}
        />

        <DashboardCard
          title="Booking Status"
          desc="Check approval and HOLD option"
          emoji="⏳"
          color="#ea580c"
          onClick={() => navigate("/student/status")}
        />

      </div>
    </StudentLayout>
  );
}

function DashboardCard({ title, desc, emoji, color, onClick }) {
  return (
    <div
      style={{ ...card, borderTop: `6px solid ${color}` }}
      onClick={onClick}
    >
      <div style={emojiStyle}>{emoji}</div>
      <h3 style={{ color }}>{title}</h3>
      <p>{desc}</p>
      <button style={{ ...btn, background: color }}>
        Open
      </button>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "2rem",
};

const card = {
  background: "#ffffff",
  padding: "2rem",
  borderRadius: "16px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  cursor: "pointer",
};

const emojiStyle = {
  fontSize: "2.5rem",
  marginBottom: "0.8rem",
};

const btn = {
  marginTop: "1.2rem",
  padding: "10px 22px",
  border: "none",
  borderRadius: "10px",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
};

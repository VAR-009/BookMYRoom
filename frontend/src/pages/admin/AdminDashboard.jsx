import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const containerStyle = {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    margin: 0,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  const contentStyle = {
    maxWidth: "900px",
    width: "100%",
  };

  const cardStyle = {
    background: "#571cb6",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    marginBottom: "1.5rem",
    color: "white",
  };

  // Button styling to match the cards
  const buttonCardStyle = {
    ...cardStyle,
    width: "100%",
    textAlign: "left",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "transform 0.2s ease, background 0.2s ease",
  };

  const headerStyle = {
    color: "white",
    marginBottom: "2rem",
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={headerStyle}>Admin Dashboard</h1>

        {/* UPDATED: Path now matches the "/admin/rooms" from your App.jsx */}
        <button 
          style={buttonCardStyle} 
          onClick={() => navigate("/admin/rooms")} 
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.background = "#6b22d6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background = "#571cb6";
          }}
        >
          <h3>Manage Rooms</h3>
          <p>Add, update, or remove classrooms, labs, and halls.</p>
        </button>

        <div style={cardStyle}>
          <h3>Approve / Reject Bookings</h3>
          <p>Review booking requests across all rooms.</p>
        </div>
      </div>
    </div>
  );
}
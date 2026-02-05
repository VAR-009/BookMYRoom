export default function StudentLayout({ title, student, children }) {
  return (
    <div style={styles.page}>
      {/* Top Navbar */}
      <header style={styles.navbar}>
        <h2 style={styles.logo}>NITC Room Booking</h2>
        <div style={styles.userBadge}>
          Student
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <h1 style={styles.title}>{title}</h1>

        {/* Student Info Card */}
        {student && (
          <div style={styles.profileCard}>
            <div>
              <strong>Name:</strong> {student.name}
            </div>
            <div>
              <strong>Roll No:</strong> {student.roll}
            </div>
            <div>
              <strong>Branch:</strong> {student.branch}
            </div>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",
    fontFamily: "Segoe UI, sans-serif",
  },
  navbar: {
    height: "64px",
    background: "#0f172a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2rem",
  },
  logo: {
    margin: 0,
  },
  userBadge: {
    background: "#2563eb",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "0.85rem",
  },
  main: {
    width: "100%",
    padding: "2.5rem",
  },
  title: {
    marginBottom: "1.2rem",
    color: "#020617",
  },
  profileCard: {
    display: "flex",
    gap: "3rem",
    background: "#ffffff",
    padding: "1.2rem 2rem",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    marginBottom: "2.5rem",
  },
};

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState(null);

  const loginAs = (role) => {
    if (role === "STUDENT") navigate("/student-login");
    if (role === "FACULTY") navigate("/faculty-login");
    if (role === "ADMIN") navigate("/admin-login");
    if (role === "ROOM_ADMIN") navigate("/room-admin-login");
  };

  const roles = [
    {
      id: "STUDENT",
      name: "Student",
      icon: "🎓",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      description: "Book rooms for classes & events",
      color: "#667eea",
    },
    {
      id: "FACULTY",
      name: "Faculty",
      icon: "👨‍🏫",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      description: "Manage class schedules",
      color: "#f093fb",
    },
    {
      id: "ADMIN",
      name: "Admin",
      icon: "👔",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      description: "System administration",
      color: "#4facfe",
    },
    {
      id: "ROOM_ADMIN",
      name: "Room Admin",
      icon: "🔧",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      description: "Room management & maintenance",
      color: "#43e97b",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div style={pageContainer}>
      <div style={bgCircle1}></div>
      <div style={bgCircle2}></div>
      <div style={bgCircle3}></div>

      <div style={contentWrapper}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={headerSection}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={loginCard}
        >
          <div style={cardHeader}>
            <h2 style={cardTitle}>BookMYRoom</h2>
            <p style={cardSubtitle}>Select your login</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={rolesGrid}
          >
            {roles.map((role) => (
              <motion.div
                key={role.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  ...roleCard,
                  background:
                    hoveredRole === role.id ? role.gradient : "#fff",
                  color:
                    hoveredRole === role.id ? "#fff" : "#1f2937",
                  boxShadow:
                    hoveredRole === role.id
                      ? `0 20px 40px ${role.color}40`
                      : "0 5px 15px rgba(0,0,0,0.08)",
                }}
                onClick={() => loginAs(role.id)}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
              >
                <motion.div
                  style={roleIconContainer}
                  animate={{
                    rotate:
                      hoveredRole === role.id
                        ? [0, -10, 10, -10, 0]
                        : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <span style={roleIcon}>{role.icon}</span>
                </motion.div>

                <div style={roleContent}>
                  <h3
                    style={{
                      ...roleName,
                      color:
                        hoveredRole === role.id ? "#fff" : "#1f2937",
                    }}
                  >
                    {role.name}
                  </h3>
                  <p
                    style={{
                      ...roleDescription,
                      color:
                        hoveredRole === role.id
                          ? "rgba(255,255,255,0.9)"
                          : "#6b7280",
                    }}
                  >
                    {role.description}
                  </p>
                </div>

                <motion.div
                  style={{
                    ...roleArrow,
                    opacity: hoveredRole === role.id ? 1 : 0,
                  }}
                  animate={{ x: hoveredRole === role.id ? 5 : 0 }}
                >
                  →
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={pageFooter}
        />
      </div>
    </div>
  );
}

/* ===================== Styles ===================== */

const pageContainer = {
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "2rem",
  overflow: "auto",
};

const bgCircle1 = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.1)",
  top: "-200px",
  right: "-200px",
  filter: "blur(60px)",
  animation: "float 6s ease-in-out infinite",
};

const bgCircle2 = {
  position: "absolute",
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.1)",
  bottom: "-150px",
  left: "-150px",
  filter: "blur(60px)",
  animation: "float 8s ease-in-out infinite reverse",
};

const bgCircle3 = {
  position: "absolute",
  width: "300px",
  height: "300px",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.05)",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  filter: "blur(40px)",
  animation: "pulse 4s ease-in-out infinite",
};

const contentWrapper = {
  width: "100%",
  maxWidth: "900px",
  zIndex: 1,
};

const headerSection = {
  textAlign: "center",
  marginBottom: "2.5rem",
};

const loginCard = {
  background: "#fff",
  borderRadius: "30px",
  padding: "3rem",
  boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
};

const cardHeader = {
  textAlign: "center",
  marginBottom: "2.5rem",
};

const cardTitle = {
  fontSize: "2rem",
  fontWeight: "700",
  color: "#1f2937",
};

const cardSubtitle = {
  color: "#6b7280",
};

const rolesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1.5rem",
};

const roleCard = {
  padding: "1.8rem",
  borderRadius: "20px",
  cursor: "pointer",
  border: "2px solid #f3f4f6",
  position: "relative",
};

const roleIconContainer = { marginBottom: "1rem" };
const roleIcon = { fontSize: "3rem" };
const roleContent = { marginBottom: "0.5rem" };
const roleName = { fontSize: "1.3rem", fontWeight: "700" };
const roleDescription = { fontSize: "0.875rem" };
const roleArrow = {
  position: "absolute",
  top: "1.5rem",
  right: "1.5rem",
  fontSize: "1.5rem",
  fontWeight: "700",
};

const pageFooter = { marginTop: "2rem" };

/* Animations */
const styles = `
@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
@keyframes pulse {
  0%,100% { transform: translate(-50%,-50%) scale(1); }
  50% { transform: translate(-50%,-50%) scale(1.1); }
}
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

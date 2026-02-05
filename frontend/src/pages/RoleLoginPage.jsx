import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

export default function RoleLoginPage({ role, roleConfig }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your authentication logic here
    console.log("Login attempt:", formData);
    
    // Navigate to respective dashboard after successful login
    if (role === "STUDENT") navigate("/student");
    if (role === "FACULTY") navigate("/faculty");
    if (role === "ADMIN") navigate("/admin");
    if (role === "ROOM_ADMIN") navigate("/room-admin");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{...pageContainer, background: roleConfig.gradient}}>
      <div style={bgCircle1}></div>
      <div style={bgCircle2}></div>
      <div style={bgCircle3}></div>

      <div style={contentWrapper}>
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={backButton}
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </motion.button>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={loginCard}
        >
          {/* Header */}
          <div style={cardHeader}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              style={{...iconCircle, background: roleConfig.gradient}}
            >
              <span style={icon}>{roleConfig.icon}</span>
            </motion.div>
            <h2 style={title}>{roleConfig.name} Login</h2>
            <p style={subtitle}>{roleConfig.description}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={form}>
            <div style={inputGroup}>
              <label style={label}>Email Address</label>
              <div style={inputWrapper}>
                <span style={inputIcon}>📧</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  style={input}
                  required
                />
              </div>
            </div>

            <div style={inputGroup}>
              <label style={label}>Password</label>
              <div style={inputWrapper}>
                <span style={inputIcon}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={input}
                  required
                />
                <button
                  type="button"
                  style={eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div style={rememberForgot}>
              <label style={checkboxLabel}>
                <input type="checkbox" style={checkbox} />
                <span>Remember me</span>
              </label>
              <a href="#" style={forgotLink}>Forgot password?</a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{...submitButton, background: roleConfig.gradient}}
            >
              Sign In as {roleConfig.name}
            </motion.button>
          </form>

          
        </motion.div>
      </div>
    </div>
  );
}

// Styles
const pageContainer = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

const bgCircle1 = {
  position: 'absolute',
  width: '500px',
  height: '500px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  top: '-200px',
  right: '-200px',
  filter: 'blur(60px)',
};

const bgCircle2 = {
  position: 'absolute',
  width: '400px',
  height: '400px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  bottom: '-150px',
  left: '-150px',
  filter: 'blur(60px)',
};

const bgCircle3 = {
  position: 'absolute',
  width: '300px',
  height: '300px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.05)',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  filter: 'blur(40px)',
};

const contentWrapper = {
  width: '100%',
  maxWidth: '480px',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const backButton = {
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  color: '#fff',
  padding: '0.75rem 1.5rem',
  borderRadius: '12px',
  fontSize: '0.95rem',
  fontWeight: '600',
  cursor: 'pointer',
  marginBottom: '1.5rem',
  transition: 'all 0.3s ease',
  alignSelf: 'flex-start',
};

const loginCard = {
  background: '#fff',
  borderRadius: '24px',
  padding: '3rem',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  width: '100%',
};

const cardHeader = {
  textAlign: 'center',
  marginBottom: '2.5rem',
};

const iconCircle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.5rem',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
};

const icon = {
  fontSize: '2.5rem',
};

const title = {
  fontSize: '1.8rem',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 0.5rem 0',
};

const subtitle = {
  color: '#6b7280',
  fontSize: '0.95rem',
  margin: 0,
};

const form = {
  marginBottom: '1.5rem',
};

const inputGroup = {
  marginBottom: '1.5rem',
};

const label = {
  display: 'block',
  color: '#374151',
  fontSize: '0.9rem',
  fontWeight: '600',
  marginBottom: '0.5rem',
};

const inputWrapper = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const inputIcon = {
  position: 'absolute',
  left: '1rem',
  fontSize: '1.2rem',
  pointerEvents: 'none',
};

const input = {
  width: '100%',
  padding: '0.9rem 1rem 0.9rem 3rem',
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const eyeButton = {
  position: 'absolute',
  right: '1rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.2rem',
  padding: '0.25rem',
};

const rememberForgot = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
};

const checkboxLabel = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: '#6b7280',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

const checkbox = {
  width: '16px',
  height: '16px',
  cursor: 'pointer',
};

const forgotLink = {
  color: '#667eea',
  fontSize: '0.9rem',
  fontWeight: '600',
  textDecoration: 'none',
};

const submitButton = {
  width: '100%',
  padding: '1rem',
  border: 'none',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '1rem',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
};

const cardFooter = {
  marginTop: '2rem',
};

const divider = {
  height: '1px',
  background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)',
  marginBottom: '1.5rem',
};

const footerText = {
  textAlign: 'center',
  color: '#6b7280',
  fontSize: '0.9rem',
  margin: 0,
};

const footerLink = {
  fontWeight: '600',
  textDecoration: 'none',
};
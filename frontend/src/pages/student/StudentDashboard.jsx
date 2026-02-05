import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/StudentLayout";
import { useState, useEffect } from "react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const student = {
    name: "Asif Mohammed",
    roll: "B220397CS",
    branch: "Computer Science & Engineering",
    avatar: "AM",
    semester: "8th Semester",
    year: "4th Year"
  };

  const cards = [
    {
      title: "Available Rooms",
      desc: "Browse classrooms, labs and halls",
      emoji: "🏫",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      path: "/student/rooms",
      stats: "45 rooms",
    },
    {
      title: "New Booking",
      desc: "Request a room for class or event",
      emoji: "📝",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      path: "/student/book",
      stats: "",
    },
    {
      title: "My Bookings",
      desc: "View past and upcoming bookings",
      emoji: "📅",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      path: "/student/bookings",
      stats: "3 active",
    },
    {
      title: "Booking Status",
      desc: "Check approval and HOLD option",
      emoji: "⏳",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      path: "/student/status",
      stats: "1 pending",

    }
  ];

  const recentActivity = [
    { action: "Room A101 booked", time: "2 hours ago", status: "approved", icon: "✅" },
    { action: "Lab B203 requested", time: "5 hours ago", status: "pending", icon: "⏳" },
    { action: "Seminar Hall booking", time: "Yesterday", status: "approved", icon: "✅" },
  ];

  const upcomingBookings = [
    { room: "Lab A101", date: "Today", time: "2:00 PM - 4:00 PM", type: "Lab Session" },
    { room: "Room B305", date: "Tomorrow", time: "10:00 AM - 12:00 PM", type: "Class" },
  ];

  return (
    <StudentLayout title="Student Dashboard" student={student}>
      <div style={container}>
        {/* Hero Section with Profile */}
        <div style={heroSection}>
          <div style={heroLeft}>
            <div style={avatarContainer}>
              <div style={avatar}>{student.avatar}</div>
              <div style={statusDot}></div>
            </div>
            <div>
              <h1 style={heroTitle}>Welcome back, {student.name}! 👋</h1>
              <p style={heroSubtitle}>
                {student.roll} • {student.branch}
              </p>
              <div style={badgeContainer}>
                <span style={badge}>{student.semester}</span>
                <span style={{...badge, background: 'rgba(67, 233, 123, 0.15)', color: '#43e97b'}}>
                  {student.year}
                </span>
              </div>
            </div>
          </div>
          <div style={heroRight}>
            <div style={timeCard}>
              <div style={timeIcon}>🕐</div>
              <div>
                <div style={timeText}>{currentTime.toLocaleTimeString()}</div>
                <div style={dateText}>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={tabContainer}>
          <button 
            style={{...tab, ...(activeTab === 'overview' ? activeTabStyle : {})}}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            style={{...tab, ...(activeTab === 'activity' ? activeTabStyle : {})}}
            onClick={() => setActiveTab('activity')}
          >
            🔔 Activity
          </button>
          <button 
            style={{...tab, ...(activeTab === 'upcoming' ? activeTabStyle : {})}}
            onClick={() => setActiveTab('upcoming')}
          >
            📅 Upcoming
          </button>
        </div>

        {/* Stats Grid with Enhanced Design */}
        <div style={statsGrid}>
          <EnhancedStatCard 
            label="Total Bookings" 
            value="12" 
            icon="📊" 
            color="#667eea"
            change="+3"
            changeType="positive"
          />
          <EnhancedStatCard 
            label="Approved" 
            value="9" 
            icon="✅" 
            color="#43e97b"
            change="+2"
            changeType="positive"
          />
          <EnhancedStatCard 
            label="Pending" 
            value="1" 
            icon="⏳" 
            color="#f5576c"
            change="-1"
            changeType="neutral"
          />
          <EnhancedStatCard 
            label="This Week" 
            value="2" 
            icon="📅" 
            color="#4facfe"
            change="+1"
            changeType="positive"
          />
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Actions Banner */}
            <div style={quickActionBanner}>
              <div style={bannerContent}>
                <div style={bannerIcon}>⚡</div>
                <div>
                  <h3 style={bannerTitle}>Quick Actions</h3>
                  <p style={bannerDesc}>Access your most used features instantly</p>
                </div>
              </div>
              <button style={bannerButton} onClick={() => navigate('/student/book')}>
                Book Now →
              </button>
            </div>

            {/* Main Cards Grid */}
            <div style={grid}>
              {cards.map((card, index) => (
                <EnhancedDashboardCard key={index} {...card} onClick={() => navigate(card.path)} />
              ))}
            </div>
          </>
        )}

        {activeTab === 'activity' && (
          <div style={activityContainer}>
            <h2 style={sectionTitle}>Recent Activity</h2>
            {recentActivity.map((activity, index) => (
              <ActivityCard key={index} {...activity} />
            ))}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div style={upcomingContainer}>
            <h2 style={sectionTitle}>Upcoming Bookings</h2>
            {upcomingBookings.map((booking, index) => (
              <UpcomingCard key={index} {...booking} />
            ))}
          </div>
        )}

        {/* Footer Section */}
        
      </div>
    </StudentLayout>
  );
}

function EnhancedDashboardCard({ title, desc, emoji, gradient, stats, trend, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...card,
        transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered 
          ? '0 25px 50px rgba(0,0,0,0.2)' 
          : '0 10px 30px rgba(0,0,0,0.08)',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ ...cardHeader, background: gradient }}>
        <div style={cardEmoji}>{emoji}</div>
        {/* <div style={trendBadge}>{trend}</div> */}
      </div>
      
      <div style={cardBody}>
        <h3 style={cardTitle}>{title}</h3>
        <p style={cardDesc}>{desc}</p>
        
        <div style={cardFooter}>
          <span style={cardStats}>{stats}</span>
          <button style={{
            ...btn,
            background: isHovered ? gradient : 'transparent',
            color: isHovered ? '#fff' : '#667eea',
            border: isHovered ? 'none' : '2px solid #667eea',
            transform: isHovered ? 'translateX(5px)' : 'translateX(0)'
          }}>
            {isHovered ? 'Open →' : 'View'}
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div style={{...decorCircle, background: gradient, opacity: 0.1}}></div>
      <div style={{...decorCircle2, background: gradient, opacity: 0.05}}></div>
    </div>
  );
}

function EnhancedStatCard({ label, value, icon, color, change, changeType }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        ...statCard,
        transform: isHovered ? 'translateY(-5px) scale(1.03)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? '0 15px 30px rgba(0,0,0,0.12)' : '0 5px 15px rgba(0,0,0,0.06)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ ...statIcon, background: `${color}15`, color }}>
        {icon}
      </div>
      <div style={{flex: 1}}>
        <div style={statValue}>{value}</div>
        <div style={statLabel}>{label}</div>
      </div>
      <div style={{
        ...changeIndicator,
        color: changeType === 'positive' ? '#43e97b' : '#6b7280'
      }}>
        {change}
      </div>
    </div>
  );
}

function ActivityCard({ action, time, status, icon }) {
  return (
    <div style={activityCard}>
      <div style={activityIcon}>{icon}</div>
      <div style={{flex: 1}}>
        <div style={activityAction}>{action}</div>
        <div style={activityTime}>{time}</div>
      </div>
      <span style={{
        ...activityStatus,
        background: status === 'approved' ? '#43e97b15' : '#f5576c15',
        color: status === 'approved' ? '#43e97b' : '#f5576c'
      }}>
        {status}
      </span>
    </div>
  );
}

function UpcomingCard({ room, date, time, type }) {
  return (
    <div style={upcomingCard}>
      <div style={upcomingLeft}>
        <div style={upcomingIcon}>🏫</div>
        <div>
          <div style={upcomingRoom}>{room}</div>
          <div style={upcomingType}>{type}</div>
        </div>
      </div>
      <div style={upcomingRight}>
        <div style={upcomingDate}>{date}</div>
        <div style={upcomingTime}>{time}</div>
      </div>
    </div>
  );
}

// Styles
const container = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '2rem',
  background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
  minHeight: '100vh'
};

const heroSection = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '2.5rem',
  borderRadius: '24px',
  marginBottom: '2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
  position: 'relative',
  overflow: 'hidden',
};

const heroLeft = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
  flex: 1,
  zIndex: 1
};

const avatarContainer = {
  position: 'relative',
};

const avatar = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.25)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.8rem',
  fontWeight: '700',
  color: '#fff',
  border: '3px solid rgba(255,255,255,0.3)',
};

const statusDot = {
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  background: '#43e97b',
  border: '3px solid #667eea',
  position: 'absolute',
  bottom: '5px',
  right: '5px',
};

const heroTitle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#fff',
  margin: '0 0 0.5rem 0',
};

const heroSubtitle = {
  fontSize: '1rem',
  color: 'rgba(255,255,255,0.9)',
  margin: '0 0 0.8rem 0',
};

const badgeContainer = {
  display: 'flex',
  gap: '0.5rem',
};

const badge = {
  background: 'rgba(255,255,255,0.2)',
  padding: '0.4rem 0.9rem',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: '600',
  color: '#fff',
  backdropFilter: 'blur(10px)',
};

const heroRight = {
  zIndex: 1
};

const timeCard = {
  background: 'rgba(255,255,255,0.2)',
  backdropFilter: 'blur(20px)',
  padding: '1.5rem',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  border: '1px solid rgba(255,255,255,0.3)',
};

const timeIcon = {
  fontSize: '2rem',
};

const timeText = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: '#fff',
};

const dateText = {
  fontSize: '0.85rem',
  color: 'rgba(255,255,255,0.8)',
  marginTop: '0.2rem',
};

const tabContainer = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  background: '#fff',
  padding: '0.5rem',
  borderRadius: '16px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.06)',
};

const tab = {
  flex: 1,
  padding: '1rem',
  background: 'transparent',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.95rem',
  color: '#6b7280',
  transition: 'all 0.3s ease',
};

const activeTabStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
};

const quickActionBanner = {
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  padding: '2rem',
  borderRadius: '20px',
  marginBottom: '2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 10px 30px rgba(245, 87, 108, 0.3)',
};

const bannerContent = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const bannerIcon = {
  fontSize: '2.5rem',
};

const bannerTitle = {
  fontSize: '1.3rem',
  fontWeight: '700',
  color: '#fff',
  margin: '0 0 0.3rem 0',
};

const bannerDesc = {
  color: 'rgba(255,255,255,0.9)',
  margin: 0,
};

const bannerButton = {
  background: 'rgba(255,255,255,0.25)',
  backdropFilter: 'blur(10px)',
  color: '#fff',
  padding: '0.8rem 1.8rem',
  border: '2px solid rgba(255,255,255,0.3)',
  borderRadius: '12px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1.5rem',
  marginBottom: '2.5rem',
};

const statCard = {
  background: '#fff',
  padding: '1.8rem',
  borderRadius: '18px',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  boxShadow: '0 5px 15px rgba(0,0,0,0.06)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
};

const statIcon = {
  width: '55px',
  height: '55px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.6rem',
};

const statValue = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#1f2937',
};

const statLabel = {
  fontSize: '0.875rem',
  color: '#6b7280',
  marginTop: '0.25rem',
};

const changeIndicator = {
  fontSize: '0.9rem',
  fontWeight: '600',
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '2rem',
  marginBottom: '2rem',
};

const card = {
  background: '#ffffff',
  borderRadius: '24px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
};

const cardHeader = {
  padding: '2.5rem 2rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  position: 'relative',
};

const cardEmoji = {
  fontSize: '3.5rem',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
};

const trendBadge = {
  background: 'rgba(255,255,255,0.3)',
  backdropFilter: 'blur(10px)',
  color: '#fff',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: '600',
  border: '1px solid rgba(255,255,255,0.2)',
};

const cardBody = {
  padding: '0 2rem 2rem',
};

const cardTitle = {
  fontSize: '1.6rem',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 0.5rem 0',
};

const cardDesc = {
  fontSize: '0.95rem',
  color: '#6b7280',
  lineHeight: '1.6',
  margin: '0 0 1.5rem 0',
};

const cardFooter = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
};

const cardStats = {
  fontSize: '1.1rem',
  fontWeight: '600',
  color: '#1f2937',
};

const btn = {
  padding: '0.7rem 1.5rem',
  borderRadius: '12px',
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '2px solid #667eea',
};

const decorCircle = {
  position: 'absolute',
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  top: '-50px',
  right: '-50px',
  pointerEvents: 'none',
};

const decorCircle2 = {
  position: 'absolute',
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  bottom: '-100px',
  left: '-70px',
  pointerEvents: 'none',
};

const activityContainer = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
};

const sectionTitle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: '#1f2937',
  marginBottom: '1.5rem',
};

const activityCard = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1.2rem',
  background: '#f8f9fa',
  borderRadius: '12px',
  marginBottom: '1rem',
  transition: 'all 0.3s ease',
};

const activityIcon = {
  fontSize: '1.5rem',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  borderRadius: '10px',
};

const activityAction = {
  fontWeight: '600',
  color: '#1f2937',
  marginBottom: '0.2rem',
};

const activityTime = {
  fontSize: '0.85rem',
  color: '#6b7280',
};

const activityStatus = {
  padding: '0.4rem 0.9rem',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: '600',
  textTransform: 'capitalize',
};

const upcomingContainer = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
};

const upcomingCard = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.5rem',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  borderRadius: '16px',
  marginBottom: '1rem',
  border: '2px solid #e9ecef',
  transition: 'all 0.3s ease',
};

const upcomingLeft = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const upcomingIcon = {
  fontSize: '2rem',
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  borderRadius: '12px',
};

const upcomingRoom = {
  fontSize: '1.1rem',
  fontWeight: '700',
  color: '#1f2937',
};

const upcomingType = {
  fontSize: '0.85rem',
  color: '#6b7280',
  marginTop: '0.2rem',
};

const upcomingRight = {
  textAlign: 'right',
};

const upcomingDate = {
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#667eea',
};

const upcomingTime = {
  fontSize: '0.85rem',
  color: '#6b7280',
  marginTop: '0.2rem',
};

const footerSection = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem',
  marginTop: '2rem',
};

const footerCard = {
  background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  padding: '1.5rem',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  boxShadow: '0 5px 15px rgba(252, 182, 159, 0.3)',
};

const footerIcon = {
  fontSize: '2rem',
};
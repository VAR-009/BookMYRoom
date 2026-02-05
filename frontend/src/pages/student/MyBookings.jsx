import StudentLayout from "../../components/StudentLayout";
import { useState } from "react";

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filterStatus, setFilterStatus] = useState("All");
  const [hoveredBooking, setHoveredBooking] = useState(null);

  const bookings = [
    {
      id: 1,
      room: "ELHC-401",
      type: "Classroom",
      date: "19-02-2026",
      time: "05:00 PM - 07:00 PM",
      status: "Approved",
      purpose: "GDSC Club Meeting",
      capacity: 60,
      floor: "4th Floor",
      bookedOn: "05-02-2026",
      approvedBy: "Room Admin",
      icon: "🏫",
      color: "#43e97b"
    },
    {
      id: 2,
      room: "SSL",
      type: "Laboratory",
      date: "15-02-2026",
      time: "5:00 PM - 9:00 PM",
      status: "Pending",
      purpose: "Robotics Workshop",
      capacity: 40,
      floor: "2nd Floor ITLAB COMPLEX",
      bookedOn: "07-02-2026",
      approvedBy: "Pending Review",
      icon: "🖥️",
      color: "#ffa500"
    },
    {
      id: 3,
      room: "Aryabhatta Hall",
      type: "Hall",
      date: "20-02-2026",
      time: "9:00 AM - 1:00 PM",
      status: "Approved",
      purpose: "Conference on ML",
      capacity: 150,
      floor: "",
      bookedOn: "10-02-2026",
      approvedBy: "Admin",
      icon: "🏛️",
      color: "#43e97b"
    },
    {
      id: 4,
      room: "CSED APJ HALL",
      type: "Hall",
      date: "13-01-2026",
      time: "03:00 PM - 04:00 PM",
      status: "Completed",
      purpose: "Final Year Project Presentation",
      capacity: 5,
      floor: "2nd Floor",
      bookedOn: "08-01-2026",
      approvedBy: "Room Admin",
      icon: "🏛️",
      color: "#6b7280"
    },
    {
      id: 5,
      room: "NLHC - 101",
      type: "Classroom",
      date: "10-01-2026",
      time: "2:00 PM - 4:00 PM",
      status: "Completed",
      purpose: "Workshop on IoT",
      capacity: 55,
      floor: "1st Floor",
      bookedOn: "08-01-2026",
      approvedBy: "Admin",
      icon: "🏫",
      color: "#6b7280"
    },
    {
      id: 6,
      room: "CSE-Lab-2",
      type: "Laboratory",
      date: "2024-02-08",
      time: "11:00 AM - 1:00 PM",
      status: "Cancelled",
      purpose: "Cloud Computing Lab",
      capacity: 45,
      floor: "3rd Floor",
      bookedOn: "2024-02-01",
      approvedBy: "N/A",
      icon: "🔬",
      color: "#f5576c"
    }
  ];

  const upcomingBookings = bookings.filter(b => 
    b.status === "Approved" || b.status === "Pending"
  );

  const pastBookings = bookings.filter(b => 
    b.status === "Completed" || b.status === "Cancelled"
  );

  const currentBookings = activeTab === "upcoming" ? upcomingBookings : pastBookings;

  const filteredBookings = filterStatus === "All" 
    ? currentBookings 
    : currentBookings.filter(b => b.status === filterStatus);

  const stats = {
    total: bookings.length,
    approved: bookings.filter(b => b.status === "Approved").length,
    pending: bookings.filter(b => b.status === "Pending").length,
    completed: bookings.filter(b => b.status === "Completed").length,
    cancelled: bookings.filter(b => b.status === "Cancelled").length
  };

  const statusFilters = activeTab === "upcoming" 
    ? ["All", "Approved", "Pending"]
    : ["All", "Completed", "Cancelled"];

  return (
    <StudentLayout title="My Bookings">
      <div style={container}>
        {/* Header Section */}
        <div style={headerSection}>
          <div>
            <h1 style={pageTitle}>My Bookings</h1>
            <p style={pageSubtitle}>Manage and track all your room reservations</p>
          </div>
          <button style={newBookingButton}>
            + New Booking
          </button>
        </div>

        {/* Stats Overview */}
        <div style={statsGrid}>
          <StatCard label="Total Bookings" value={stats.total} icon="📊" color="#667eea" />
          <StatCard label="Approved" value={stats.approved} icon="✅" color="#43e97b" />
          <StatCard label="Pending" value={stats.pending} icon="⏳" color="#ffa500" />
          <StatCard label="Completed" value={stats.completed} icon="🎯" color="#4facfe" />
        </div>

        {/* Tab Navigation */}
        <div style={tabContainer}>
          <button
            style={{
              ...tab,
              ...(activeTab === "upcoming" ? activeTabStyle : {})
            }}
            onClick={() => {
              setActiveTab("upcoming");
              setFilterStatus("All");
            }}
          >
            <span style={tabIcon}>📅</span>
            Upcoming
            <span style={tabBadge}>{upcomingBookings.length}</span>
          </button>
          <button
            style={{
              ...tab,
              ...(activeTab === "past" ? activeTabStyle : {})
            }}
            onClick={() => {
              setActiveTab("past");
              setFilterStatus("All");
            }}
          >
            <span style={tabIcon}>📜</span>
            Past
            <span style={tabBadge}>{pastBookings.length}</span>
          </button>
        </div>

        {/* Status Filter */}
        <div style={filterSection}>
          <span style={filterLabel}>Filter by Status:</span>
          <div style={filterButtons}>
            {statusFilters.map(status => (
              <button
                key={status}
                style={{
                  ...filterButton,
                  ...(filterStatus === status ? activeFilterButton : {})
                }}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div style={emptyState}>
            <div style={emptyIcon}>📭</div>
            <h3 style={emptyTitle}>No bookings found</h3>
            <p style={emptyText}>
              {activeTab === "upcoming" 
                ? "You don't have any upcoming bookings. Start by booking a room!"
                : "You don't have any past bookings yet."}
            </p>
            {activeTab === "upcoming" && (
              <button style={emptyButton}>Book a Room</button>
            )}
          </div>
        ) : (
          <div style={bookingsGrid}>
            {filteredBookings.map((booking, index) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                index={index}
                isHovered={hoveredBooking === booking.id}
                onHover={() => setHoveredBooking(booking.id)}
                onLeave={() => setHoveredBooking(null)}
                isUpcoming={activeTab === "upcoming"}
              />
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

function BookingCard({ booking, index, isHovered, onHover, onLeave, isUpcoming }) {
  const [showActions, setShowActions] = useState(false);

  const statusConfig = {
    Approved: { color: "#43e97b", bg: "#43e97b15", icon: "✅" },
    Pending: { color: "#ffa500", bg: "#ffa50015", icon: "⏳" },
    Completed: { color: "#4facfe", bg: "#4facfe15", icon: "🎯" },
    Cancelled: { color: "#f5576c", bg: "#f5576c15", icon: "❌" }
  };

  const status = statusConfig[booking.status];

  return (
    <div
      style={{
        ...bookingCard,
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0,0,0,0.12)' 
          : '0 5px 15px rgba(0,0,0,0.08)'
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Card Header */}
      <div style={cardHeader}>
        <div style={headerLeft}>
          <div style={roomIcon}>{booking.icon}</div>
          <div>
            <h3 style={roomTitle}>{booking.room}</h3>
            <p style={roomType}>{booking.type} • {booking.floor}</p>
          </div>
        </div>
        <div
          style={{
            ...statusBadge,
            background: status.bg,
            color: status.color
          }}
        >
          <span>{status.icon}</span>
          {booking.status}
        </div>
      </div>

      {/* Card Body */}
      <div style={cardBody}>
        {/* Date & Time */}
        <div style={infoRow}>
          <span style={infoIcon}>📅</span>
          <div style={infoContent}>
            <div style={infoLabel}>Date & Time</div>
            <div style={infoValue}>{booking.date}</div>
            <div style={infoSubValue}>{booking.time}</div>
          </div>
        </div>

        {/* Purpose */}
        <div style={infoRow}>
          <span style={infoIcon}>📝</span>
          <div style={infoContent}>
            <div style={infoLabel}>Purpose</div>
            <div style={infoValue}>{booking.purpose}</div>
          </div>
        </div>

        {/* Capacity */}
        <div style={infoRow}>
          <span style={infoIcon}>👥</span>
          <div style={infoContent}>
            <div style={infoLabel}>Capacity</div>
            <div style={infoValue}>{booking.capacity} people</div>
          </div>
        </div>

        {/* Booking Info */}
        <div style={metaInfo}>
          <div style={metaItem}>
            <span style={metaLabel}>Booked on:</span>
            <span style={metaValue}>{booking.bookedOn}</span>
          </div>
          <div style={metaItem}>
            <span style={metaLabel}>Approved by:</span>
            <span style={metaValue}>{booking.approvedBy}</span>
          </div>
        </div>
      </div>

      {/* Card Footer - Actions */}
      <div style={cardFooter}>
        {isUpcoming ? (
          <>
            <button style={viewDetailsButton}>
              View Details
            </button>
            {booking.status === "Approved" && (
              <button
                style={cancelButton}
                onClick={() => setShowActions(!showActions)}
              >
                Cancel Booking
              </button>
            )}
            {booking.status === "Pending" && (
              <button style={editButton}>
                Edit Request
              </button>
            )}
          </>
        ) : (
          <>
            <button style={viewDetailsButton}>
              View Details
            </button>
            {booking.status === "Completed" && (
              <button style={rebookButton}>
                Book Again
              </button>
            )}
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showActions && (
        <div style={confirmDialog}>
          <p style={confirmText}>Are you sure you want to cancel this booking?</p>
          <div style={confirmActions}>
            <button style={confirmButton}>Yes, Cancel</button>
            <button 
              style={cancelConfirmButton}
              onClick={() => setShowActions(false)}
            >
              No, Keep It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...statCard,
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ ...statIcon, color }}>
        {icon}
      </div>
      <div>
        <div style={{ ...statValue, color }}>{value}</div>
        <div style={statLabel}>{label}</div>
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

const headerSection = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  flexWrap: 'wrap',
  gap: '1rem'
};

const pageTitle = {
  fontSize: '2.5rem',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 0.5rem 0'
};

const pageSubtitle = {
  fontSize: '1rem',
  color: '#6b7280',
  margin: 0
};

const newBookingButton = {
  padding: '0.9rem 2rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)'
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.5rem',
  marginBottom: '2rem'
};

const statCard = {
  background: '#fff',
  padding: '1.8rem',
  borderRadius: '18px',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  boxShadow: '0 5px 15px rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
};

const statIcon = {
  fontSize: '2.5rem'
};

const statValue = {
  fontSize: '2rem',
  fontWeight: '700'
};

const statLabel = {
  fontSize: '0.875rem',
  color: '#6b7280',
  marginTop: '0.2rem'
};

const tabContainer = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  background: '#fff',
  padding: '0.5rem',
  borderRadius: '16px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.06)'
};

const tab = {
  flex: 1,
  padding: '1rem 1.5rem',
  background: 'transparent',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '1rem',
  color: '#6b7280',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem'
};

const activeTabStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)'
};

const tabIcon = {
  fontSize: '1.2rem'
};

const tabBadge = {
  background: 'rgba(255,255,255,0.3)',
  padding: '0.2rem 0.6rem',
  borderRadius: '10px',
  fontSize: '0.85rem',
  fontWeight: '700'
};

const filterSection = {
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '16px',
  marginBottom: '2rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
  boxShadow: '0 5px 15px rgba(0,0,0,0.06)'
};

const filterLabel = {
  fontSize: '0.95rem',
  fontWeight: '600',
  color: '#4b5563'
};

const filterButtons = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap'
};

const filterButton = {
  padding: '0.6rem 1.2rem',
  background: '#f3f4f6',
  border: 'none',
  borderRadius: '10px',
  color: '#6b7280',
  fontWeight: '600',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const activeFilterButton = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff'
};

const bookingsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '2rem'
};

const bookingCard = {
  background: '#fff',
  borderRadius: '20px',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative'
};

const cardHeader = {
  padding: '1.5rem',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  borderBottom: '2px solid #f3f4f6'
};

const headerLeft = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

const roomIcon = {
  fontSize: '3rem',
  width: '60px',
  height: '60px',
  background: '#fff',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
};

const roomTitle = {
  fontSize: '1.4rem',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 0.3rem 0'
};

const roomType = {
  fontSize: '0.9rem',
  color: '#6b7280',
  margin: 0
};

const statusBadge = {
  padding: '0.6rem 1.2rem',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  border: '2px solid currentColor'
};

const cardBody = {
  padding: '1.5rem'
};

const infoRow = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '1.2rem',
  paddingBottom: '1.2rem',
  borderBottom: '1px solid #f3f4f6'
};

const infoIcon = {
  fontSize: '1.5rem',
  width: '35px',
  flexShrink: 0
};

const infoContent = {
  flex: 1
};

const infoLabel = {
  fontSize: '0.8rem',
  color: '#6b7280',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '0.4rem'
};

const infoValue = {
  fontSize: '1rem',
  color: '#1f2937',
  fontWeight: '600',
  marginBottom: '0.2rem'
};

const infoSubValue = {
  fontSize: '0.9rem',
  color: '#4b5563'
};

const metaInfo = {
  background: '#f8f9fa',
  padding: '1rem',
  borderRadius: '12px',
  marginTop: '1rem'
};

const metaItem = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.85rem',
  marginBottom: '0.5rem'
};

const metaLabel = {
  color: '#6b7280',
  fontWeight: '500'
};

const metaValue = {
  color: '#1f2937',
  fontWeight: '600'
};

const cardFooter = {
  padding: '1.5rem',
  background: '#f8f9fa',
  display: 'flex',
  gap: '0.8rem',
  borderTop: '2px solid #e9ecef'
};

const viewDetailsButton = {
  flex: 1,
  padding: '0.8rem',
  background: '#fff',
  border: '2px solid #e5e7eb',
  borderRadius: '10px',
  color: '#4b5563',
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const cancelButton = {
  flex: 1,
  padding: '0.8rem',
  background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
  border: 'none',
  borderRadius: '10px',
  color: '#fff',
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const editButton = {
  flex: 1,
  padding: '0.8rem',
  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  border: 'none',
  borderRadius: '10px',
  color: '#fff',
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const rebookButton = {
  flex: 1,
  padding: '0.8rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  border: 'none',
  borderRadius: '10px',
  color: '#fff',
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const confirmDialog = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(255,255,255,0.98)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  borderRadius: '20px',
  zIndex: 10
};

const confirmText = {
  fontSize: '1.1rem',
  color: '#1f2937',
  fontWeight: '600',
  textAlign: 'center',
  marginBottom: '1.5rem'
};

const confirmActions = {
  display: 'flex',
  gap: '1rem',
  width: '100%'
};

const confirmButton = {
  flex: 1,
  padding: '0.9rem',
  background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
  border: 'none',
  borderRadius: '12px',
  color: '#fff',
  fontWeight: '600',
  cursor: 'pointer'
};

const cancelConfirmButton = {
  flex: 1,
  padding: '0.9rem',
  background: '#e5e7eb',
  border: 'none',
  borderRadius: '12px',
  color: '#4b5563',
  fontWeight: '600',
  cursor: 'pointer'
};

const emptyState = {
  textAlign: 'center',
  padding: '4rem 2rem',
  background: '#fff',
  borderRadius: '20px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.06)'
};

const emptyIcon = {
  fontSize: '5rem',
  marginBottom: '1.5rem'
};

const emptyTitle = {
  fontSize: '1.8rem',
  fontWeight: '700',
  color: '#1f2937',
  marginBottom: '0.8rem'
};

const emptyText = {
  fontSize: '1.05rem',
  color: '#6b7280',
  marginBottom: '2rem',
  lineHeight: '1.6'
};

const emptyButton = {
  padding: '1rem 2.5rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer'
};
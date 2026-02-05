import StudentLayout from "../../components/StudentLayout";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoomList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [hoveredRoom, setHoveredRoom] = useState(null);

  const rooms = [
    { id: 1, room: "CSE-101", type: "Classroom", branch: "CSE", capacity: 60, status: "Available", floor: "1st Floor", amenities: ["Projector", "AC", "Whiteboard"], image: "🏫" },
    { id: 2, room: "CSE-102", type: "Classroom", branch: "CSE", capacity: 50, status: "Available", floor: "1st Floor", amenities: ["Projector", "Whiteboard"], image: "🏫" },
    { id: 3, room: "Lab-3", type: "Laboratory", branch: "ECE", capacity: 40, status: "Occupied", floor: "2nd Floor", amenities: ["Computers", "AC", "Projector"], image: "🔬" },
    { id: 4, room: "Lab-5", type: "Laboratory", branch: "CSE", capacity: 45, status: "Available", floor: "3rd Floor", amenities: ["Computers", "AC"], image: "🔬" },
    { id: 5, room: "Main Hall", type: "Hall", branch: "General", capacity: 300, status: "Available", floor: "Ground Floor", amenities: ["Sound System", "AC", "Stage"], image: "🎭" },
    { id: 6, room: "Seminar Hall A", type: "Hall", branch: "General", capacity: 150, status: "Available", floor: "2nd Floor", amenities: ["Projector", "AC", "Sound System"], image: "🎭" },
    { id: 7, room: "ECE-201", type: "Classroom", branch: "ECE", capacity: 55, status: "Available", floor: "2nd Floor", amenities: ["Projector", "AC"], image: "🏫" },
    { id: 8, room: "Mech-Lab-1", type: "Laboratory", branch: "MECH", capacity: 35, status: "Maintenance", floor: "1st Floor", amenities: ["Equipment", "Tools"], image: "🔬" },
  ];

  const types = ["All", "Classroom", "Laboratory", "Hall"];
  const branches = ["All", "CSE", "ECE", "MECH", "General"];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || room.type === selectedType;
    const matchesBranch = selectedBranch === "All" || room.branch === selectedBranch;
    return matchesSearch && matchesType && matchesBranch;
  });

  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === "Available").length,
    occupied: rooms.filter(r => r.status === "Occupied").length,
    maintenance: rooms.filter(r => r.status === "Maintenance").length,
  };

  return (
    <StudentLayout title="Available Rooms">
      <div style={container}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={headerSection}
        >
          <div>
            <h1 style={pageTitle}>Browse Rooms</h1>
            <p style={pageSubtitle}>Find and book the perfect space for your needs</p>
          </div>
          <div style={headerStats}>
            <div style={statBadge}>
              <span style={statIcon}>🏫</span>
              <div>
                <div style={statValue}>{stats.total}</div>
                <div style={statLabel}>Total Rooms</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={quickStats}
        >
          <StatCard label="Available" value={stats.available} color="#43e97b" icon="✅" />
          <StatCard label="Occupied" value={stats.occupied} color="#f5576c" icon="🔒" />
          <StatCard label="Maintenance" value={stats.maintenance} color="#ffa500" icon="🔧" />
          <StatCard label="Showing" value={filteredRooms.length} color="#4facfe" icon="👁️" />
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={filterSection}
        >
          {/* Search Bar */}
          <div style={searchContainer}>
            <span style={searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search rooms, branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInput}
            />
            {searchTerm && (
              <button style={clearButton} onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div style={filterTabs}>
            <div style={tabGroup}>
              <span style={tabLabel}>Type:</span>
              {types.map(type => (
                <button
                  key={type}
                  style={{
                    ...filterTab,
                    ...(selectedType === type ? activeFilterTab : {})
                  }}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div style={tabGroup}>
              <span style={tabLabel}>Branch:</span>
              {branches.map(branch => (
                <button
                  key={branch}
                  style={{
                    ...filterTab,
                    ...(selectedBranch === branch ? activeFilterTab : {})
                  }}
                  onClick={() => setSelectedBranch(branch)}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>

          {/* View Toggle */}
          <div style={viewToggle}>
            <button
              style={{
                ...viewButton,
                ...(viewMode === "grid" ? activeViewButton : {})
              }}
              onClick={() => setViewMode("grid")}
            >
              ⊞ Grid
            </button>
            <button
              style={{
                ...viewButton,
                ...(viewMode === "list" ? activeViewButton : {})
              }}
              onClick={() => setViewMode("list")}
            >
              ☰ List
            </button>
          </div>
        </motion.div>

        {/* Rooms Display */}
        <AnimatePresence mode="wait">
          {filteredRooms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={emptyState}
            >
              <div style={emptyIcon}>🔍</div>
              <h3 style={emptyTitle}>No rooms found</h3>
              <p style={emptyText}>Try adjusting your filters or search terms</p>
              <button
                style={resetButton}
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("All");
                  setSelectedBranch("All");
                }}
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={viewMode === "grid" ? roomsGrid : roomsList}
            >
              {filteredRooms.map((room, index) => (
                viewMode === "grid" ? (
                  <RoomCard
                    key={room.id}
                    room={room}
                    index={index}
                    isHovered={hoveredRoom === room.id}
                    onHover={() => setHoveredRoom(room.id)}
                    onLeave={() => setHoveredRoom(null)}
                  />
                ) : (
                  <RoomListItem
                    key={room.id}
                    room={room}
                    index={index}
                  />
                )
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StudentLayout>
  );
}

function RoomCard({ room, index, isHovered, onHover, onLeave }) {
  const statusColors = {
    Available: "#43e97b",
    Occupied: "#f5576c",
    Maintenance: "#ffa500"
  };

  const typeGradients = {
    Classroom: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    Laboratory: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    Hall: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        ...roomCard,
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(0,0,0,0.15)'
          : '0 5px 15px rgba(0,0,0,0.08)'
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Card Header with Gradient */}
      <div style={{ ...cardHeader, background: typeGradients[room.type] }}>
        <div style={cardIcon}>{room.image}</div>
        <div style={{
          ...statusBadge,
          background: `${statusColors[room.status]}20`,
          color: statusColors[room.status],
          border: `2px solid ${statusColors[room.status]}`
        }}>
          {room.status}
        </div>
      </div>

      {/* Card Body */}
      <div style={cardBody}>
        <h3 style={roomName}>{room.room}</h3>
        
        <div style={roomDetails}>
          <div style={detailRow}>
            <span style={detailIcon}>🏢</span>
            <span style={detailText}>{room.type}</span>
          </div>
          <div style={detailRow}>
            <span style={detailIcon}>📚</span>
            <span style={detailText}>{room.branch}</span>
          </div>
          <div style={detailRow}>
            <span style={detailIcon}>👥</span>
            <span style={detailText}>{room.capacity} people</span>
          </div>
          <div style={detailRow}>
            <span style={detailIcon}>📍</span>
            <span style={detailText}>{room.floor}</span>
          </div>
        </div>

        {/* Amenities */}
        <div style={amenitiesSection}>
          <div style={amenitiesLabel}>Amenities:</div>
          <div style={amenitiesList}>
            {room.amenities.map((amenity, i) => (
              <span key={i} style={amenityTag}>{amenity}</span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          style={{
            ...bookButton,
            opacity: room.status === "Available" ? 1 : 0.5,
            cursor: room.status === "Available" ? "pointer" : "not-allowed"
          }}
          disabled={room.status !== "Available"}
        >
          {room.status === "Available" ? "Book Now →" : "Not Available"}
        </button>
      </div>
    </motion.div>
  );
}

function RoomListItem({ room, index }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusColors = {
    Available: "#43e97b",
    Occupied: "#f5576c",
    Maintenance: "#ffa500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      style={{
        ...listItem,
        background: isHovered ? '#f8f9fa' : '#fff'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={listIcon}>{room.image}</div>
      
      <div style={listContent}>
        <div style={listMain}>
          <h4 style={listRoomName}>{room.room}</h4>
          <div style={listDetails}>
            <span style={listDetail}>{room.type}</span>
            <span style={listSeparator}>•</span>
            <span style={listDetail}>{room.branch}</span>
            <span style={listSeparator}>•</span>
            <span style={listDetail}>{room.capacity} seats</span>
            <span style={listSeparator}>•</span>
            <span style={listDetail}>{room.floor}</span>
          </div>
        </div>
        
        <div style={listAmenities}>
          {room.amenities.map((amenity, i) => (
            <span key={i} style={listAmenityTag}>{amenity}</span>
          ))}
        </div>
      </div>

      <div style={listActions}>
        <div style={{
          ...listStatus,
          background: `${statusColors[room.status]}20`,
          color: statusColors[room.status]
        }}>
          {room.status}
        </div>
        <button
          style={{
            ...listBookButton,
            opacity: room.status === "Available" ? 1 : 0.5
          }}
          disabled={room.status !== "Available"}
        >
          {room.status === "Available" ? "Book" : "N/A"}
        </button>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div style={statCard}>
      <div style={{ ...statCardIcon, color }}>
        {icon}
      </div>
      <div>
        <div style={{ ...statCardValue, color }}>{value}</div>
        <div style={statCardLabel}>{label}</div>
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

const headerStats = {
  display: 'flex',
  gap: '1rem'
};

const statBadge = {
  background: '#fff',
  padding: '1rem 1.5rem',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
};

const statIcon = {
  fontSize: '2rem'
};

const statValue = {
  fontSize: '1.75rem',
  fontWeight: '700',
  color: '#1f2937'
};

const statLabel = {
  fontSize: '0.875rem',
  color: '#6b7280'
};

const quickStats = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '1rem',
  marginBottom: '2rem'
};

const statCard = {
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  boxShadow: '0 5px 15px rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease'
};

const statCardIcon = {
  fontSize: '2rem'
};

const statCardValue = {
  fontSize: '1.75rem',
  fontWeight: '700'
};

const statCardLabel = {
  fontSize: '0.875rem',
  color: '#6b7280',
  marginTop: '0.2rem'
};

const filterSection = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '20px',
  marginBottom: '2rem',
  boxShadow: '0 5px 15px rgba(0,0,0,0.06)'
};

const searchContainer = {
  position: 'relative',
  marginBottom: '1.5rem'
};

const searchIcon = {
  position: 'absolute',
  left: '1.2rem',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '1.2rem',
  color: '#6b7280'
};

const searchInput = {
  width: '100%',
  padding: '1rem 3rem 1rem 3.5rem',
  borderRadius: '12px',
  border: '2px solid #e5e7eb',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  outline: 'none'
};

const clearButton = {
  position: 'absolute',
  right: '1rem',
  top: '50%',
  transform: 'translateY(-50%)',
  background: '#f3f4f6',
  border: 'none',
  borderRadius: '50%',
  width: '28px',
  height: '28px',
  cursor: 'pointer',
  fontSize: '1rem',
  color: '#6b7280',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const filterTabs = {
  display: 'flex',
  gap: '2rem',
  marginBottom: '1.5rem',
  flexWrap: 'wrap'
};

const tabGroup = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexWrap: 'wrap'
};

const tabLabel = {
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#6b7280'
};

const filterTab = {
  padding: '0.6rem 1.2rem',
  borderRadius: '10px',
  border: '2px solid #e5e7eb',
  background: 'transparent',
  color: '#6b7280',
  fontWeight: '600',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const activeFilterTab = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  border: '2px solid #667eea'
};

const viewToggle = {
  display: 'flex',
  gap: '0.5rem',
  background: '#f3f4f6',
  padding: '0.5rem',
  borderRadius: '12px',
  width: 'fit-content'
};

const viewButton = {
  padding: '0.7rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  background: 'transparent',
  color: '#6b7280',
  fontWeight: '600',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const activeViewButton = {
  background: '#fff',
  color: '#667eea',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const roomsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '2rem'
};

const roomsList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const roomCard = {
  background: '#fff',
  borderRadius: '20px',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer'
};

const cardHeader = {
  padding: '2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const cardIcon = {
  fontSize: '4rem'
};

const statusBadge = {
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const cardBody = {
  padding: '1.5rem 2rem 2rem'
};

const roomName = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 1.5rem 0'
};

const roomDetails = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
  marginBottom: '1.5rem'
};

const detailRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem'
};

const detailIcon = {
  fontSize: '1.2rem',
  width: '24px'
};

const detailText = {
  color: '#4b5563',
  fontSize: '0.95rem'
};

const amenitiesSection = {
  marginBottom: '1.5rem'
};

const amenitiesLabel = {
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#6b7280',
  marginBottom: '0.8rem'
};

const amenitiesList = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem'
};

const amenityTag = {
  padding: '0.4rem 0.8rem',
  background: '#f3f4f6',
  borderRadius: '8px',
  fontSize: '0.8rem',
  color: '#4b5563',
  fontWeight: '500'
};

const bookButton = {
  width: '100%',
  padding: '0.9rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const listItem = {
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease'
};

const listIcon = {
  fontSize: '3rem',
  width: '70px',
  height: '70px',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const listContent = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem'
};

const listMain = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem'
};

const listRoomName = {
  fontSize: '1.3rem',
  fontWeight: '700',
  color: '#1f2937',
  margin: 0
};

const listDetails = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexWrap: 'wrap'
};

const listDetail = {
  fontSize: '0.9rem',
  color: '#6b7280'
};

const listSeparator = {
  color: '#d1d5db'
};

const listAmenities = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap'
};

const listAmenityTag = {
  padding: '0.3rem 0.7rem',
  background: '#f3f4f6',
  borderRadius: '6px',
  fontSize: '0.75rem',
  color: '#4b5563',
  fontWeight: '500'
};

const listActions = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '1rem'
};

const listStatus = {
  padding: '0.5rem 1rem',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: '700',
  textTransform: 'uppercase'
};

const listBookButton = {
  padding: '0.7rem 2rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap'
};

const emptyState = {
  textAlign: 'center',
  padding: '4rem 2rem',
  background: '#fff',
  borderRadius: '20px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.06)'
};

const emptyIcon = {
  fontSize: '4rem',
  marginBottom: '1rem'
};

const emptyTitle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: '#1f2937',
  marginBottom: '0.5rem'
};

const emptyText = {
  color: '#6b7280',
  marginBottom: '2rem'
};

const resetButton = {
  padding: '0.8rem 2rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontWeight: '600',
  cursor: 'pointer'
};
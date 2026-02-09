import { useState } from "react";

export default function ManageRooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const rooms = [
    { id: 1, room: "CSE-101", type: "Classroom", branch: "CSE", capacity: 60, status: "Active", floor: "1st Floor", amenities: ["Projector", "AC", "Whiteboard"], icon: "🏫" },
    { id: 2, room: "CSE-102", type: "Classroom", branch: "CSE", capacity: 50, status: "Active", floor: "1st Floor", amenities: ["Projector", "Whiteboard"], icon: "🏫" },
    { id: 3, room: "NSL", type: "Laboratory", branch: "CSE", capacity: 40, status: "Maintenance", floor: "2nd Floor", amenities: ["Computers", "AC", "Projector"], icon: "🔬" },
    { id: 4, room: "Lab-5", type: "Laboratory", branch: "CSE", capacity: 45, status: "Active", floor: "3rd Floor", amenities: ["Computers", "AC"], icon: "🔬" },
    { id: 5, room: "Main Hall", type: "Hall", branch: "General", capacity: 300, status: "Active", floor: "Ground Floor", amenities: ["Sound System", "AC", "Stage"], icon: "🎭" },
    { id: 6, room: "Seminar Hall A", type: "Hall", branch: "General", capacity: 150, status: "Active", floor: "2nd Floor", amenities: ["Projector", "AC", "Sound System"], icon: "🎭" },
    { id: 7, room: "ECE-201", type: "Classroom", branch: "ECE", capacity: 55, status: "Inactive", floor: "2nd Floor", amenities: ["Projector", "AC"], icon: "🏫" },
    { id: 8, room: "SSL", type: "Laboratory", branch: "CSE", capacity: 35, status: "Maintenance", floor: "2nd Floor", amenities: ["Equipment", "Tools"], icon: "🔬" },
  ];

  const types = ["All", "Classroom", "Laboratory", "Hall"];
  const statuses = ["All", "Active", "Inactive", "Maintenance"];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.room.toLowerCase().includes(searchTerm.toLowerCase()) || room.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || room.type === selectedType;
    const matchesStatus = selectedStatus === "All" || room.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: rooms.length,
    active: rooms.filter(r => r.status === "Active").length,
    inactive: rooms.filter(r => r.status === "Inactive").length,
    maintenance: rooms.filter(r => r.status === "Maintenance").length,
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setShowEditModal(true);
  };

  const handleDelete = (room) => {
    if (window.confirm(`Are you sure you want to delete ${room.room}?`)) {
      console.log("Deleting room:", room);
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={container}>
        {/* Header Section */}
        <div style={headerSection}>
          <div>
            <h1 style={pageTitle}>Manage Rooms</h1>
            <p style={pageSubtitle}>Add, edit, and manage all room resources</p>
          </div>
          <button style={addButton} onClick={() => setShowAddModal(true)}>
            + Add New Room
          </button>
        </div>

        {/* Quick Stats */}
        <div style={statsGrid}>
          <StatCard label="Total Rooms" value={stats.total} color="#667eea" icon="🏫" />
          <StatCard label="Active" value={stats.active} color="#43e97b" icon="✅" />
          <StatCard label="Inactive" value={stats.inactive} color="#f5576c" icon="🔒" />
          <StatCard label="Maintenance" value={stats.maintenance} color="#ffa500" icon="🔧" />
        </div>

        {/* Search and Filter Section */}
        <div style={filterSection}>
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
              <button style={clearButton} onClick={() => setSearchTerm("")}>✕</button>
            )}
          </div>

          {/* Filter Tabs */}
          <div style={filterTabs}>
            <div style={tabGroup}>
              <span style={tabLabel}>Type:</span>
              {types.map(type => (
                <button
                  key={type}
                  style={{...filterTab, ...(selectedType === type ? activeFilterTab : {})}}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div style={tabGroup}>
              <span style={tabLabel}>Status:</span>
              {statuses.map(status => (
                <button
                  key={status}
                  style={{...filterTab, ...(selectedStatus === status ? activeFilterTab : {})}}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* View Toggle */}
          <div style={viewToggle}>
            <button
              style={{...viewButton, ...(viewMode === "grid" ? activeViewButton : {})}}
              onClick={() => setViewMode("grid")}
            >
              ⊞ Grid
            </button>
            <button
              style={{...viewButton, ...(viewMode === "list" ? activeViewButton : {})}}
              onClick={() => setViewMode("list")}
            >
              ☰ List
            </button>
          </div>
        </div>

        {/* Rooms Display */}
        {filteredRooms.length === 0 ? (
          <div style={emptyState}>
            <div style={emptyIcon}>🔍</div>
            <h3 style={emptyTitle}>No rooms found</h3>
            <p style={emptyText}>Try adjusting your filters or add a new room</p>
            <button style={resetButton} onClick={() => { setSearchTerm(""); setSelectedType("All"); setSelectedStatus("All"); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={viewMode === "grid" ? roomsGrid : roomsList}>
            {filteredRooms.map((room, index) => (
              viewMode === "grid" ? (
                <RoomCard key={room.id} room={room} onEdit={handleEdit} onDelete={handleDelete} />
              ) : (
                <RoomListItem key={room.id} room={room} onEdit={handleEdit} onDelete={handleDelete} />
              )
            ))}
          </div>
        )}

        {/* Add Room Modal */}
        {showAddModal && (
          <AddEditModal
            title="Add New Room"
            onClose={() => setShowAddModal(false)}
            onSave={(data) => {
              console.log("Adding room:", data);
              setShowAddModal(false);
            }}
          />
        )}

        {/* Edit Room Modal */}
        {showEditModal && selectedRoom && (
          <AddEditModal
            title="Edit Room"
            room={selectedRoom}
            onClose={() => { setShowEditModal(false); setSelectedRoom(null); }}
            onSave={(data) => {
              console.log("Updating room:", data);
              setShowEditModal(false);
              setSelectedRoom(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function RoomCard({ room, onEdit, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    Active: "#43e97b",
    Inactive: "#f5576c",
    Maintenance: "#ffa500"
  };

  const typeGradients = {
    Classroom: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    Laboratory: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    Hall: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  };

  return (
    <div
      style={{
        ...roomCard,
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.15)' : '0 5px 15px rgba(0,0,0,0.08)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header */}
      <div style={{ ...cardHeader, background: typeGradients[room.type] }}>
        <div style={cardIcon}>{room.icon}</div>
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

        {/* Action Buttons */}
        <div style={actionButtons}>
          <button style={editButton} onClick={() => onEdit(room)}>
            ✏️ Edit
          </button>
          <button style={deleteButton} onClick={() => onDelete(room)}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function RoomListItem({ room, onEdit, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);
   
  const statusColors = {
    Active: "#43e97b",
    Inactive: "#f5576c",
    Maintenance: "#ffa500"
  };

  return (
    <div
      style={{...listItem, background: isHovered ? '#f8f9fa' : '#fff'}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={listIcon}>{room.icon}</div>
       
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
        <div style={listButtonGroup}>
          <button style={listEditButton} onClick={() => onEdit(room)}>Edit</button>
          <button style={listDeleteButton} onClick={() => onDelete(room)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div style={statCard}>
      <div style={{ ...statCardIcon, color }}>{icon}</div>
      <div>
        <div style={{ ...statCardValue, color }}>{value}</div>
        <div style={statCardLabel}>{label}</div>
      </div>
    </div>
  );
}

function AddEditModal({ title, room, onClose, onSave }) {
  const [formData, setFormData] = useState({
    room: room?.room || "",
    type: room?.type || "Classroom",
    branch: room?.branch || "",
    capacity: room?.capacity || "",
    floor: room?.floor || "",
    status: room?.status || "Active",
    amenities: room?.amenities || []
  });

  const amenitiesList = ["Projector", "AC", "Whiteboard", "Computers", "Sound System", "Stage", "Equipment", "Tools"];

  const toggleAmenity = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    }
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeader}>
          <h2 style={modalTitle}>{title}</h2>
          <button style={closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={modalBody}>
          <div style={formGrid}>
            <div style={formGroup}>
              <label style={label}>Room Name</label>
              <input
                style={input}
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g., CSE-101"
              />
            </div>

            <div style={formGroup}>
              <label style={label}>Type</label>
              <select
                style={input}
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option>Classroom</option>
                <option>Laboratory</option>
                <option>Hall</option>
              </select>
            </div>

            <div style={formGroup}>
              <label style={label}>Branch</label>
              <input
                style={input}
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                placeholder="e.g., CSE, ECE"
              />
            </div>

            <div style={formGroup}>
              <label style={label}>Capacity</label>
              <input
                type="number"
                style={input}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="Number of people"
              />
            </div>

            <div style={formGroup}>
              <label style={label}>Floor</label>
              <input
                style={input}
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                placeholder="e.g., 1st Floor"
              />
            </div>

            <div style={formGroup}>
              <label style={label}>Status</label>
              <select
                style={input}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Maintenance</option>
              </select>
            </div>
          </div>

          <div style={formGroupFull}>
            <label style={label}>Amenities</label>
            <div style={amenitiesGrid}>
              {amenitiesList.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  style={{
                    ...amenityButton,
                    ...(formData.amenities.includes(amenity) ? selectedAmenityButton : {})
                  }}
                  onClick={() => toggleAmenity(amenity)}
                >
                  {formData.amenities.includes(amenity) && "✓ "}
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={modalFooter}>
          <button style={cancelButton} onClick={onClose}>Cancel</button>
          <button style={saveButton} onClick={() => onSave(formData)}>
            {room ? "Update Room" : "Add Room"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// KEY FIXES START HERE (UPDATED STYLES)
// ============================================

const pageWrapper = {
  position: 'absolute',    // Forces it to ignore parent container margins
  top: 0,
  left: 0,
  width: '100vw',          // Forces full viewport width
  minHeight: '100vh',      // Forces full viewport height
  background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
  display: 'flex',
  justifyContent: 'center',// Centers the container horizontally
  padding: '2rem 0',
  boxSizing: 'border-box'  // Ensures padding doesn't cause overflow
};

const container = {
  width: '100%',
  maxWidth: '1600px',
  padding: '0 2rem',
  boxSizing: 'border-box', // Ensures padding stays inside the width
  margin: '0 auto'         // Double safety for centering
};

// ... Rest of styles remain mostly same, just ensuring box-sizing is safe

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

const addButton = {
  padding: '1rem 2rem',
  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(67, 233, 123, 0.3)',
  transition: 'all 0.3s ease'
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
  transition: 'all 0.3s ease'
};

const statCardIcon = {
  fontSize: '2.5rem'
};

const statCardValue = {
  fontSize: '2rem',
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
  color: '#6b7280',
  pointerEvents: 'none'
};

const searchInput = {
  width: '100%',
  padding: '1rem 3rem 1rem 3.5rem',
  borderRadius: '12px',
  border: '2px solid #e5e7eb',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box'
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
  color: '#6b7280'
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

const actionButtons = {
  display: 'flex',
  gap: '0.8rem'
};

const editButton = {
  flex: 1,
  padding: '0.9rem',
  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const deleteButton = {
  flex: 1,
  padding: '0.9rem',
  background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
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
  justifyContent: 'center',
  flexShrink: 0
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
  gap: '1rem',
  flexShrink: 0
};

const listStatus = {
  padding: '0.5rem 1rem',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: '700',
  textTransform: 'uppercase'
};

const listButtonGroup = {
  display: 'flex',
  gap: '0.5rem'
};

const listEditButton = {
  padding: '0.6rem 1.2rem',
  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.85rem',
  cursor: 'pointer'
};

const listDeleteButton = {
  padding: '0.6rem 1.2rem',
  background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.85rem',
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

const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '2rem'
};

const modalContent = {
  background: '#fff',
  borderRadius: '24px',
  width: '100%',
  maxWidth: '700px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
};

const modalHeader = {
  padding: '2rem',
  borderBottom: '2px solid #f3f4f6',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const modalTitle = {
  fontSize: '1.8rem',
  fontWeight: '700',
  color: '#1f2937',
  margin: 0
};

const closeBtn = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: '#f3f4f6',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.5rem',
  color: '#6b7280'
};

const modalBody = {
  padding: '2rem'
};

const formGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1.5rem',
  marginBottom: '1.5rem'
};

const formGroup = {
  display: 'flex',
  flexDirection: 'column'
};

const formGroupFull = {
  display: 'flex',
  flexDirection: 'column'
};

const label = {
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '0.5rem'
};

const input = {
  padding: '0.9rem',
  borderRadius: '10px',
  border: '2px solid #e5e7eb',
  fontSize: '1rem',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box'
};

const amenitiesGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: '0.8rem'
};

const amenityButton = {
  padding: '0.7rem 1rem',
  background: '#f3f4f6',
  border: '2px solid #e5e7eb',
  borderRadius: '10px',
  color: '#6b7280',
  fontWeight: '600',
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const selectedAmenityButton = {
  background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
  border: '2px solid #667eea',
  color: '#667eea'
};

const modalFooter = {
  padding: '2rem',
  borderTop: '2px solid #f3f4f6',
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-end'
};

const cancelButton = {
  padding: '0.9rem 2rem',
  background: '#f3f4f6',
  border: 'none',
  borderRadius: '12px',
  color: '#4b5563',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer'
};

const saveButton = {
  padding: '0.9rem 2rem',
  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  border: 'none',
  borderRadius: '12px',
  color: '#fff',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(67, 233, 123, 0.3)'
};
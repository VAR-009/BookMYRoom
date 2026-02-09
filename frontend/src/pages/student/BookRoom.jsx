import StudentLayout from "../../components/StudentLayout";
import { useState } from "react";

export default function BookRoom() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    roomType: "",
    room: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
    amenities: []
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [errors, setErrors] = useState({});

  const rooms = [
    { id: 1, name: "CSE-101", type: "Classroom", capacity: 60, floor: "1st Floor", amenities: ["Projector", "AC", "Whiteboard"], icon: "🏫", available: true },
    { id: 2, name: "CSE-102", type: "Classroom", capacity: 50, floor: "1st Floor", amenities: ["Projector", "Whiteboard"], icon: "🏫", available: true },
    { id: 3, name: "Lab-3", type: "Laboratory", capacity: 40, floor: "2nd Floor", amenities: ["Computers", "AC", "Projector"], icon: "🔬", available: false },
    { id: 4, name: "Lab-5", type: "Laboratory", capacity: 45, floor: "3rd Floor", amenities: ["Computers", "AC"], icon: "🔬", available: true },
    { id: 5, name: "Main Hall", type: "Hall", capacity: 300, floor: "Ground Floor", amenities: ["Sound System", "AC", "Stage"], icon: "🎭", available: true },
    { id: 6, name: "Seminar Hall A", type: "Hall", capacity: 150, floor: "2nd Floor", amenities: ["Projector", "AC", "Sound System"], icon: "🎭", available: true },
  ];

  const roomTypes = ["All", "Classroom", "Laboratory", "Hall"];
  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];
  const amenitiesList = ["Projector", "AC", "Whiteboard", "Computers", "Sound System", "Stage"];

  const filteredRooms = formData.roomType === "" || formData.roomType === "All"
    ? rooms
    : rooms.filter(r => r.type === formData.roomType);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleRoomSelect = (room) => {
    if (room.available) {
      setSelectedRoom(room);
      setFormData({ ...formData, room: room.name });
    }
  };

  const toggleAmenity = (amenity) => {
    const current = formData.amenities;
    if (current.includes(amenity)) {
      setFormData({ ...formData, amenities: current.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...current, amenity] });
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.room) newErrors.room = "Please select a room";
    }
    
    if (step === 2) {
      if (!formData.date) newErrors.date = "Please select a date";
      if (!formData.startTime) newErrors.startTime = "Please select start time";
      if (!formData.endTime) newErrors.endTime = "Please select end time";
      if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
        newErrors.endTime = "End time must be after start time";
      }
    }
    
    if (step === 3) {
      if (!formData.purpose) newErrors.purpose = "Please enter the purpose";
      if (!formData.attendees) newErrors.attendees = "Please enter number of attendees";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log("Form submitted:", formData);
      // Handle form submission
    }
  };

  return (
    <StudentLayout title="Book a Room">
      <div style={container}>
        {/* Header */}
        <div style={header}>
          <h1 style={pageTitle}>Book a Room</h1>
          <p style={pageSubtitle}>Reserve the perfect space for your needs in 3 easy steps</p>
        </div>

        {/* Progress Indicator */}
        <div style={progressContainer}>
          <div style={progressBar}>
            <div style={{ ...progressFill, width: `${(step / 3) * 100}%` }}></div>
          </div>
          <div style={stepsIndicator}>
            {[1, 2, 3].map(num => (
              <div key={num} style={stepWrapper}>
                <div style={{
                  ...stepCircle,
                  ...(step >= num ? activeStepCircle : {}),
                  ...(step > num ? completedStepCircle : {})
                }}>
                  {step > num ? "✓" : num}
                </div>
                <div style={stepLabel}>
                  {num === 1 ? "Select Room" : num === 2 ? "Date & Time" : "Details"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div style={formCard}>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Room Selection */}
            {step === 1 && (
              <div style={stepContent}>
                <h2 style={stepTitle}>
                  <span style={stepIcon}>🏫</span>
                  Select a Room
                </h2>
                <p style={stepDescription}>Choose from available rooms that match your requirements</p>

                {/* Room Type Filter */}
                <div style={filterSection}>
                  <label style={label}>Filter by Type:</label>
                  <div style={typeButtons}>
                    {roomTypes.map(type => (
                      <button
                        key={type}
                        type="button"
                        style={{
                          ...typeButton,
                          ...(formData.roomType === type ? activeTypeButton : {})
                        }}
                        onClick={() => handleInputChange("roomType", type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rooms Grid */}
                <div style={roomsGrid}>
                  {filteredRooms.map(room => (
                    <div
                      key={room.id}
                      style={{
                        ...roomCard,
                        ...(selectedRoom?.id === room.id ? selectedRoomCard : {}),
                        ...((!room.available) ? disabledRoomCard : {})
                      }}
                      onClick={() => handleRoomSelect(room)}
                    >
                      {!room.available && <div style={unavailableBadge}>Unavailable</div>}
                      
                      <div style={roomCardHeader}>
                        <div style={roomCardIcon}>{room.icon}</div>
                        <div style={roomCardInfo}>
                          <h3 style={roomCardName}>{room.name}</h3>
                          <p style={roomCardType}>{room.type}</p>
                        </div>
                        {selectedRoom?.id === room.id && (
                          <div style={selectedCheck}>✓</div>
                        )}
                      </div>

                      <div style={roomCardBody}>
                        <div style={roomDetail}>
                          <span style={detailIcon}>👥</span>
                          <span>{room.capacity} capacity</span>
                        </div>
                        <div style={roomDetail}>
                          <span style={detailIcon}>📍</span>
                          <span>{room.floor}</span>
                        </div>
                        <div style={amenitiesPreview}>
                          {room.amenities.slice(0, 2).map((amenity, i) => (
                            <span key={i} style={amenityChip}>{amenity}</span>
                          ))}
                          {room.amenities.length > 2 && (
                            <span style={amenityChip}>+{room.amenities.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.room && <div style={errorText}>{errors.room}</div>}
              </div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <div style={stepContent}>
                <h2 style={stepTitle}>
                  <span style={stepIcon}>📅</span>
                  Select Date & Time
                </h2>
                <p style={stepDescription}>Choose when you need the room</p>

                {/* Selected Room Summary */}
                {selectedRoom && (
                  <div style={selectedRoomSummary}>
                    <div style={summaryIcon}>{selectedRoom.icon}</div>
                    <div>
                      <div style={summaryName}>{selectedRoom.name}</div>
                      <div style={summaryDetails}>{selectedRoom.type} • {selectedRoom.floor}</div>
                    </div>
                  </div>
                )}

                <div style={formGrid}>
                  {/* Date Input */}
                  <div style={formGroup}>
                    <label style={label}>
                      <span style={labelIcon}>📅</span>
                      Date
                    </label>
                    <input
                      type="date"
                      style={{...input, ...(errors.date ? errorInput : {})}}
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.date && <div style={errorText}>{errors.date}</div>}
                  </div>

                  {/* Start Time */}
                  <div style={formGroup}>
                    <label style={label}>
                      <span style={labelIcon}>🕐</span>
                      Start Time
                    </label>
                    <select
                      style={{...input, ...(errors.startTime ? errorInput : {})}}
                      value={formData.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                    >
                      <option value="">Select start time</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    {errors.startTime && <div style={errorText}>{errors.startTime}</div>}
                  </div>

                  {/* End Time */}
                  <div style={formGroup}>
                    <label style={label}>
                      <span style={labelIcon}>🕐</span>
                      End Time
                    </label>
                    <select
                      style={{...input, ...(errors.endTime ? errorInput : {})}}
                      value={formData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                    >
                      <option value="">Select end time</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    {errors.endTime && <div style={errorText}>{errors.endTime}</div>}
                  </div>
                </div>

                {/* Duration Display */}
                {formData.startTime && formData.endTime && formData.startTime < formData.endTime && (
                  <div style={durationBadge}>
                    <span style={durationIcon}>⏱️</span>
                    Duration: {calculateDuration(formData.startTime, formData.endTime)}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
              <div style={stepContent}>
                <h2 style={stepTitle}>
                  <span style={stepIcon}>📝</span>
                  Booking Details
                </h2>
                <p style={stepDescription}>Provide additional information about your booking</p>

                <div style={formGrid}>
                  {/* Purpose */}
                  <div style={formGroupFull}>
                    <label style={label}>
                      <span style={labelIcon}>📝</span>
                      Purpose of Booking
                    </label>
                    <textarea
                      style={{...textarea, ...(errors.purpose ? errorInput : {})}}
                      placeholder="e.g., Machine Learning Workshop, Team Meeting, Annual Day Event..."
                      value={formData.purpose}
                      onChange={(e) => handleInputChange("purpose", e.target.value)}
                      rows="4"
                    />
                    {errors.purpose && <div style={errorText}>{errors.purpose}</div>}
                  </div>

                  {/* Number of Attendees */}
                  <div style={formGroup}>
                    <label style={label}>
                      <span style={labelIcon}>👥</span>
                      Expected Attendees
                    </label>
                    <input
                      type="number"
                      style={{...input, ...(errors.attendees ? errorInput : {})}}
                      placeholder="Number of people"
                      value={formData.attendees}
                      onChange={(e) => handleInputChange("attendees", e.target.value)}
                      min="1"
                      max={selectedRoom?.capacity}
                    />
                    {selectedRoom && (
                      <div style={capacityHint}>
                        Maximum capacity: {selectedRoom.capacity} people
                      </div>
                    )}
                    {errors.attendees && <div style={errorText}>{errors.attendees}</div>}
                  </div>

                  {/* Required Amenities */}
                  <div style={formGroupFull}>
                    <label style={label}>
                      <span style={labelIcon}>⚙️</span>
                      Required Amenities (Optional)
                    </label>
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

                {/* Booking Summary */}
                <div style={bookingSummary}>
                  <h3 style={summaryTitle}>Booking Summary</h3>
                  <div style={summaryGrid}>
                    <div style={summaryItem}>
                      <span style={summaryItemLabel}>Room:</span>
                      <span style={summaryItemValue}>{selectedRoom?.name}</span>
                    </div>
                    <div style={summaryItem}>
                      <span style={summaryItemLabel}>Date:</span>
                      <span style={summaryItemValue}>{formData.date || "Not selected"}</span>
                    </div>
                    <div style={summaryItem}>
                      <span style={summaryItemLabel}>Time:</span>
                      <span style={summaryItemValue}>
                        {formData.startTime && formData.endTime 
                          ? `${formData.startTime} - ${formData.endTime}`
                          : "Not selected"}
                      </span>
                    </div>
                    <div style={summaryItem}>
                      <span style={summaryItemLabel}>Attendees:</span>
                      <span style={summaryItemValue}>{formData.attendees || "Not specified"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={buttonGroup}>
              {step > 1 && (
                <button type="button" style={backButton} onClick={handleBack}>
                  ← Back
                </button>
              )}
              {step < 3 ? (
                <button type="button" style={nextButton} onClick={handleNext}>
                  Next →
                </button>
              ) : (
                <button type="submit" style={submitButton}>
                  Submit Booking 🎉
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div style={helpSection}>
          <div style={helpCard}>
            <span style={helpIcon}>💡</span>
            <div>
              <strong style={helpTitle}>Pro Tip:</strong>
              <p style={helpText}>Book at least 24 hours in advance for better approval chances</p>
            </div>
          </div>
          <div style={helpCard}>
            <span style={helpIcon}>📞</span>
            <div>
              <strong style={helpTitle}>Need Help?</strong>
              <p style={helpText}>Contact support at booking@college.edu</p>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

function calculateDuration(start, end) {
  const startHour = parseInt(start.split(':')[0]);
  const endHour = parseInt(end.split(':')[0]);
  const startPeriod = start.includes('PM') ? 12 : 0;
  const endPeriod = end.includes('PM') ? 12 : 0;
  
  const startTime = (startHour === 12 ? 0 : startHour) + startPeriod;
  const endTime = (endHour === 12 ? 0 : endHour) + endPeriod;
  
  const duration = endTime - startTime;
  return `${duration} hour${duration > 1 ? 's' : ''}`;
}

// Styles
const container = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem',
  background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
  minHeight: '100vh'
};

const header = {
  textAlign: 'center',
  marginBottom: '3rem'
};

const pageTitle = {
  fontSize: '2.5rem',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 0.5rem 0'
};

const pageSubtitle = {
  fontSize: '1.1rem',
  color: '#6b7280',
  margin: 0
};

const progressContainer = {
  marginBottom: '3rem'
};

const progressBar = {
  height: '8px',
  background: '#e5e7eb',
  borderRadius: '10px',
  overflow: 'hidden',
  marginBottom: '2rem'
};

const progressFill = {
  height: '100%',
  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  transition: 'width 0.3s ease',
  borderRadius: '10px'
};

const stepsIndicator = {
  display: 'flex',
  justifyContent: 'space-between',
  maxWidth: '600px',
  margin: '0 auto'
};

const stepWrapper = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem'
};

const stepCircle = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  background: '#e5e7eb',
  color: '#9ca3af',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '700',
  fontSize: '1.1rem',
  transition: 'all 0.3s ease'
};

const activeStepCircle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)'
};

const completedStepCircle = {
  background: '#43e97b',
  color: '#fff'
};

const stepLabel = {
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#6b7280',
  textAlign: 'center'
};

const formCard = {
  background: '#fff',
  borderRadius: '24px',
  padding: '3rem',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  marginBottom: '2rem'
};

const stepContent = {
  minHeight: '400px'
};

const stepTitle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 0.5rem 0',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem'
};

const stepIcon = {
  fontSize: '2.5rem'
};

const stepDescription = {
  fontSize: '1rem',
  color: '#6b7280',
  marginBottom: '2.5rem'
};

const filterSection = {
  marginBottom: '2rem'
};

const label = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.95rem',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '0.8rem'
};

const labelIcon = {
  fontSize: '1.2rem'
};

const typeButtons = {
  display: 'flex',
  gap: '0.8rem',
  flexWrap: 'wrap'
};

const typeButton = {
  padding: '0.7rem 1.5rem',
  background: '#f3f4f6',
  border: 'none',
  borderRadius: '12px',
  color: '#6b7280',
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const activeTypeButton = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)'
};

const roomsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '1.5rem'
};

const roomCard = {
  background: '#fff',
  border: '2px solid #e5e7eb',
  borderRadius: '16px',
  padding: '1.5rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative'
};

const selectedRoomCard = {
  border: '2px solid #667eea',
  boxShadow: '0 10px 25px rgba(102, 126, 234, 0.2)',
  transform: 'scale(1.02)'
};

const disabledRoomCard = {
  opacity: 0.5,
  cursor: 'not-allowed'
};

const unavailableBadge = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: '#f5576c',
  color: '#fff',
  padding: '0.3rem 0.8rem',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: '700'
};

const roomCardHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
  position: 'relative'
};

const roomCardIcon = {
  fontSize: '3rem'
};

const roomCardInfo = {
  flex: 1
};

const roomCardName = {
  fontSize: '1.3rem',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 0.3rem 0'
};

const roomCardType = {
  fontSize: '0.85rem',
  color: '#6b7280',
  margin: 0
};

const selectedCheck = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '700',
  fontSize: '1.2rem'
};

const roomCardBody = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem'
};

const roomDetail = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.9rem',
  color: '#4b5563'
};

const detailIcon = {
  fontSize: '1.1rem'
};

const amenitiesPreview = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap'
};

const amenityChip = {
  padding: '0.3rem 0.7rem',
  background: '#f3f4f6',
  borderRadius: '8px',
  fontSize: '0.75rem',
  color: '#4b5563',
  fontWeight: '500'
};

const selectedRoomSummary = {
  background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
  padding: '1.5rem',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '2rem',
  border: '2px solid #667eea30'
};

const summaryIcon = {
  fontSize: '3rem'
};

const summaryName = {
  fontSize: '1.3rem',
  fontWeight: '700',
  color: '#1f2937'
};

const summaryDetails = {
  fontSize: '0.9rem',
  color: '#6b7280',
  marginTop: '0.3rem'
};

const formGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.5rem'
};

const formGroup = {
  display: 'flex',
  flexDirection: 'column'
};

const formGroupFull = {
  gridColumn: '1 / -1'
};

const input = {
  padding: '1rem',
  borderRadius: '12px',
  border: '2px solid #e5e7eb',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  outline: 'none',
  fontFamily: 'inherit'
};

const textarea = {
  padding: '1rem',
  borderRadius: '12px',
  border: '2px solid #e5e7eb',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  outline: 'none',
  fontFamily: 'inherit',
  resize: 'vertical'
};

const errorInput = {
  border: '2px solid #f5576c'
};

const errorText = {
  color: '#f5576c',
  fontSize: '0.875rem',
  marginTop: '0.5rem',
  fontWeight: '500'
};

const capacityHint = {
  fontSize: '0.85rem',
  color: '#6b7280',
  marginTop: '0.5rem'
};

const durationBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: '#43e97b15',
  color: '#43e97b',
  padding: '0.8rem 1.5rem',
  borderRadius: '12px',
  fontSize: '1rem',
  fontWeight: '600',
  marginTop: '1rem'
};

const durationIcon = {
  fontSize: '1.3rem'
};

const amenitiesGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '0.8rem'
};

const amenityButton = {
  padding: '0.8rem 1.2rem',
  background: '#f3f4f6',
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  color: '#6b7280',
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const selectedAmenityButton = {
  background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
  border: '2px solid #667eea',
  color: '#667eea'
};

const bookingSummary = {
  background: '#f8f9fa',
  padding: '2rem',
  borderRadius: '16px',
  marginTop: '2rem'
};

const summaryTitle = {
  fontSize: '1.3rem',
  fontWeight: '700',
  color: '#1f2937',
  marginBottom: '1.5rem'
};

const summaryGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem'
};

const summaryItem = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem'
};

const summaryItemLabel = {
  fontSize: '0.85rem',
  color: '#6b7280',
  fontWeight: '600'
};

const summaryItemValue = {
  fontSize: '1rem',
  color: '#1f2937',
  fontWeight: '600'
};

const buttonGroup = {
  display: 'flex',
  gap: '1rem',
  marginTop: '2.5rem',
  justifyContent: 'flex-end'
};

const backButton = {
  padding: '1rem 2rem',
  background: '#f3f4f6',
  border: 'none',
  borderRadius: '12px',
  color: '#4b5563',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const nextButton = {
  padding: '1rem 2.5rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  border: 'none',
  borderRadius: '12px',
  color: '#fff',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)'
};

const submitButton = {
  padding: '1rem 2.5rem',
  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  border: 'none',
  borderRadius: '12px',
  color: '#fff',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 5px 15px rgba(67, 233, 123, 0.3)'
};

const helpSection = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem'
};

const helpCard = {
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
  boxShadow: '0 5px 15px rgba(0,0,0,0.06)'
};

const helpIcon = {
  fontSize: '2rem'
};

const helpTitle = {
  fontSize: '1rem',
  color: '#1f2937',
  display: 'block',
  marginBottom: '0.3rem'
};

const helpText = {
  fontSize: '0.9rem',
  color: '#6b7280',
  margin: 0,
  lineHeight: '1.5'
};
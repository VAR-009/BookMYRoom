import RoleLoginPage from '../RoleLoginPage.jsx';

export default function RoomAdminLoginPage() {
  return (
    <RoleLoginPage 
      role="ROOM_ADMIN"
      roleConfig={{
        name: "Room Admin",
        icon: "🔧",
        gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        description: "Room management & maintenance",
        color: "#43e97b"
      }}
    />
  );
}
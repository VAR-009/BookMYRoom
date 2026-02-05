import RoleLoginPage from '../RoleLoginPage.jsx';

export default function AdminLoginPage() {
  return (
    <RoleLoginPage 
      role="ADMIN"
      roleConfig={{
        name: "Admin",
        icon: "👔",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        description: "System administration",
        color: "#4facfe"
      }}
    />
  );
}
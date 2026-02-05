import RoleLoginPage from '../RoleLoginPage.jsx';

export default function FacultyLoginPage() {
  return (
    <RoleLoginPage 
      role="FACULTY"
      roleConfig={{
        name: "Faculty",
        icon: "👨‍🏫",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        description: "Manage class schedules",
        color: "#f093fb"
      }}
    />
  );
}
import RoleLoginPage from '../RoleLoginPage.jsx';

export default function StudentLoginPage() {
  return (
    <RoleLoginPage 
      role="STUDENT"
      roleConfig={{
        name: "Student",
        icon: "🎓",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        description: "Book rooms for classes & events",
        color: "#667eea"
      }}
    />
  );
}
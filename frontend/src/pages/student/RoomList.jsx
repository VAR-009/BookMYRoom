import StudentLayout from "../../components/StudentLayout";

export default function RoomList() {
  return (
    <StudentLayout title="Available Rooms">
      <table style={table}>
        <thead>
          <tr>
            <th>Room</th>
            <th>Type</th>
            <th>Branch</th>
            <th>Capacity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <Row room="CSE-101" type="Classroom" branch="CSE" cap="60" />
          <Row room="Lab-3" type="Laboratory" branch="ECE" cap="40" />
          <Row room="Main Hall" type="Hall" branch="General" cap="300" />
        </tbody>
      </table>
    </StudentLayout>
  );
}

function Row({ room, type, branch, cap }) {
  return (
    <tr>
      <td>{room}</td>
      <td>{type}</td>
      <td>{branch}</td>
      <td>{cap}</td>
      <td>Available</td>
    </tr>
  );
}

const table = {
  width: "100%",
  borderCollapse: "collapse"
};

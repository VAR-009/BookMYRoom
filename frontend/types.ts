export type UserRole = 'student' | 'faculty' | 'admin';

export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  amenities: string[];
  image: string;
  status: 'Available' | 'Maintenance' | 'Occupied';
  roomAdminUid: string; // faculty responsible for approvals
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  roomType: string;
  date: string;
  time: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Cancelled' | 'Completed';
  purpose: string;
  userRole: UserRole;
  userName: string;
  userUid: string;
  roomAdminUid: string;
  approvedBy?: string; // faculty who approved
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  avatar: string;
  hasPasswordSet?: boolean;
}

export enum ScreenView {
  AUTH_SIGNIN,
  AUTH_SIGNUP,
  SETUP_PASSWORD,

  STUDENT_DASHBOARD,
  ROOM_SEARCH,
  SCHEDULE_SELECT,
  CONFIRMATION,
  HISTORY,

  FACULTY_DASHBOARD,

  ADMIN_DASHBOARD,
  ADMIN_USERS,
  ADMIN_ROOMS,

  ROOM_ADMIN_DASHBOARD,
  FACULTY_ADMIN_DASHBOARD,

  MANAGE_LOCKS,
  CHANGE_PASSWORD,
}
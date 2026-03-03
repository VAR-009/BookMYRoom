export type UserRole = 'student' | 'faculty' | 'admin' | 'room_admin' | 'faculty_admin';

export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  amenities: string[];
  image: string;
  status: 'Available' | 'Maintenance' | 'Occupied';
}

export interface Booking {
  id: string;
  roomName: string;
  roomType: string;
  date: string;
  time: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Cancelled' | 'Completed';
  purpose: string;
  userRole: UserRole;
  userName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  avatar: string;
}

export enum ScreenView {
  AUTH_SIGNIN,
  AUTH_SIGNUP,
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
}
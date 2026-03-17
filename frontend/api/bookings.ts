import api from './axios';

export const createBooking = async (roomId: number, date: string, startTime: string, endTime: string, purpose: string) => {
  const response = await api.post('/bookings/create', { roomId: roomId.toString(), date, startTime, endTime, purpose });
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/bookings/my');
  return response.data;
};

export const getAllBookings = async () => {
  const response = await api.get('/bookings/all');
  return response.data;
};

export const updateBookingStatus = async (id: number, status: string) => {
  const response = await api.put(`/bookings/status/${id}`, { status });
  return response.data;
};

export const cancelBooking = async (id: number) => {
  const response = await api.put(`/bookings/cancel/${id}`);
  return response.data;
};

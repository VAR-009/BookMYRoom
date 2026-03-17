import api from './axios';

export const getAllRooms = async () => {
  const response = await api.get('/rooms');
  return response.data;
};

export const getRoomById = async (id: number) => {
  const response = await api.get(`/rooms/${id}`);
  return response.data;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';
import { db } from '../firebase';
import { Room } from '../types';

interface RoomContextType {
  rooms: Room[];
  loading: boolean;
  addRoom: (room: Omit<Room, 'id'>) => Promise<void>;
  updateRoom: (id: string, room: Partial<Room>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  seedRooms: () => Promise<void>;
  cleanupDuplicates: () => Promise<void>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const getInitialRooms = (): Omit<Room, 'id'>[] => [

    {
      name: 'SSL Lab',
      type: 'Computer Lab',
      capacity: 60,
      amenities: ['High-spec PCs', 'Projector', 'AC', 'LAN'],
      status: 'Available',
      location: 'CSED Building',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
      adminUid: ""
    },

    {
      name: 'NSL Lab',
      type: 'Computer Lab',
      capacity: 60,
      amenities: ['High-spec PCs', 'Projector', 'AC', 'LAN'],
      status: 'Available',
      location: 'CSED Building',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
      adminUid: ""
    },

    {
      name: 'ELHC 401',
      type: 'Classroom',
      capacity: 80,
      amenities: ['Projector', 'Whiteboard', 'AC'],
      status: 'Available',
      location: 'ELHC Building',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
      adminUid: ""
    },

    {
      name: 'Aryabhatta Hall',
      type: 'Institute Hall',
      capacity: 500,
      amenities: ['Audio System', 'Projector', 'AC', 'Stage', 'Balcony'],
      status: 'Available',
      location: 'Main Building',
      image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744',
      adminUid: ""
    },

    {
      name: 'APJ Hall',
      type: 'Institute Hall',
      capacity: 300,
      amenities: ['Audio System', 'Projector', 'AC', 'Stage'],
      status: 'Available',
      location: 'Main Building',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
      adminUid: ""
    }

  ];

  useEffect(() => {

    const q = query(collection(db, 'rooms'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {

      const roomsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Room[];

      if (snapshot.empty) {

        const initialRooms = getInitialRooms();

        for (const room of initialRooms) {
          await addDoc(collection(db, 'rooms'), room);
        }

        return;
      }

      setRooms(roomsData);
      setLoading(false);

    }, (error) => {

      console.error("Error fetching rooms:", error);
      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  const seedRooms = async () => {

    const initialRooms = getInitialRooms();

    for (const room of initialRooms) {

      const exists = rooms.some(r => r.name === room.name);

      if (!exists) {
        await addDoc(collection(db, 'rooms'), room);
      }

    }

  };

  const cleanupDuplicates = async () => {

    const seen = new Set<string>();

    for (const room of rooms) {

      if (seen.has(room.name)) {
        await deleteDoc(doc(db, 'rooms', room.id));
      }

      else {
        seen.add(room.name);
      }

    }

  };

  const addRoom = async (roomData: Omit<Room, 'id'>) => {

    await addDoc(collection(db, 'rooms'), roomData);

  };

  const updateRoom = async (id: string, roomData: Partial<Room>) => {

    const roomRef = doc(db, 'rooms', id);

    await updateDoc(roomRef, roomData);

  };

  const deleteRoom = async (id: string) => {

    const roomRef = doc(db, 'rooms', id);

    await deleteDoc(roomRef);

  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        loading,
        addRoom,
        updateRoom,
        deleteRoom,
        seedRooms,
        cleanupDuplicates
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRooms = () => {

  const context = useContext(RoomContext);

  if (!context) {
    throw new Error('useRooms must be used within a RoomProvider');
  }

  return context;
};
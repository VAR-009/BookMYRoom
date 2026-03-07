import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Room } from '../types';

interface AddRoomModalProps {
  initialData?: Partial<Room>;
  onClose?: () => void;
  onSave?: (data: Partial<Room>) => void;
}

export const AddRoomModal: React.FC<AddRoomModalProps> = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    location: 'Science Block A',
    type: 'Classroom',
    capacity: 40,
    amenities: [],
    status: 'Available',
    ...initialData
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (field: keyof Room, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity: string) => {
    const currentAmenities = formData.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    handleChange('amenities', newAmenities);
  };

  const handleSubmit = () => {
    if (onSave) {
      onSave(formData);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Room Name/Number <span className="text-red-500">*</span></label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.DoorOpen className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border bg-white" 
              placeholder="e.g. 101-B or Einstein Hall" 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Building / Wing <span className="text-red-500">*</span></label>
          <select 
            value={formData.location || 'CSED Building'}
            onChange={(e) => handleChange('location', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm rounded-lg border bg-white"
          >
            <option>CSED Building</option>
            <option>Lecture Hall Complex</option>
            <option>Main Building</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Room Type <span className="text-red-500">*</span></label>
          <select 
            value={formData.type || 'Classroom'}
            onChange={(e) => handleChange('type', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm rounded-lg border bg-white"
          >
            <option>Classroom</option>
            <option>Computer Lab</option>
            <option>Department Hall</option>
            <option>Institute Hall</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Capacity <span className="text-red-500">*</span></label>
          <div className="mt-1 relative rounded-md shadow-sm">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Users className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="number" 
              value={formData.capacity || 0}
              onChange={(e) => handleChange('capacity', parseInt(e.target.value))}
              className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border bg-white" 
              placeholder="e.g. 40" 
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Available Amenities</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="relative flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.amenities?.includes('Projector')}
              onChange={() => handleAmenityChange('Projector')}
              className="h-4 w-4 text-brand border-gray-300 rounded focus:ring-brand" 
            />
            <span className="ml-3 flex items-center text-sm font-medium text-gray-900"><Icons.Video className="h-4 w-4 mr-2 text-gray-400"/> Projector / Screen</span>
          </label>
           <label className="relative flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.amenities?.includes('AC')}
              onChange={() => handleAmenityChange('AC')}
              className="h-4 w-4 text-brand border-gray-300 rounded focus:ring-brand" 
            />
            <span className="ml-3 flex items-center text-sm font-medium text-gray-900"><Icons.Sun className="h-4 w-4 mr-2 text-gray-400"/> Air Conditioning</span>
          </label>
           <label className="relative flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.amenities?.includes('Whiteboard')}
              onChange={() => handleAmenityChange('Whiteboard')}
              className="h-4 w-4 text-brand border-gray-300 rounded focus:ring-brand" 
            />
            <span className="ml-3 flex items-center text-sm font-medium text-gray-900"><Icons.Edit className="h-4 w-4 mr-2 text-gray-400"/> Whiteboard</span>
          </label>
           <label className="relative flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.amenities?.includes('Ethernet')}
              onChange={() => handleAmenityChange('Ethernet')}
              className="h-4 w-4 text-brand border-gray-300 rounded focus:ring-brand" 
            />
            <span className="ml-3 flex items-center text-sm font-medium text-gray-900"><Icons.Wifi className="h-4 w-4 mr-2 text-gray-400"/> Ethernet Ports</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          {initialData && initialData.id ? 'Save Changes' : 'Add Room'}
        </button>
      </div>
    </div>
  );
};
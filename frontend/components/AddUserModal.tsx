import React, { useState } from 'react';
import { Icons } from './Icons';
import { User } from '../types';

interface AddUserModalProps {
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Student');
  const [department, setDepartment] = useState('Engineering');

  const handleSubmit = () => {
    onSave({
      name,
      email,
      role,
      department,
      status: 'Active',
      avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
    });
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.User className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border bg-white" 
              placeholder="e.g. Dr. Jane Smith" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
           <div>
            <label className="block text-sm font-medium text-gray-700">University Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 focus:ring-brand focus:border-brand block w-full sm:text-sm border-gray-300 rounded-lg p-2.5 border bg-white" 
              placeholder="user@university.edu" 
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Employee / Student ID</label>
            <input type="text" className="mt-1 focus:ring-brand focus:border-brand block w-full sm:text-sm border-gray-300 rounded-lg p-2.5 border bg-white" placeholder="e.g. 98210344" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
           <div>
            <label className="block text-sm font-medium text-gray-700">System Role</label>
             <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm rounded-lg border bg-white"
             >
                <option>Student</option>
                <option>Faculty</option>
                <option>Admin</option>
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select 
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm rounded-lg border bg-white"
            >
                <option>Engineering</option>
                <option>Arts</option>
                <option>Science</option>
                <option>Business</option>
            </select>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-start gap-3">
          <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 text-brand border-gray-300 rounded focus:ring-brand" />
          <div>
            <label className="text-sm font-medium text-gray-900">Send Invitation Email</label>
            <p className="text-xs text-gray-500">The user will receive an email with a link to set their password.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-blue-700">Create User</button>
      </div>
    </div>
  );
};
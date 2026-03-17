import React, { useState } from 'react';
import { Icons } from '../components/Icons';

interface ChangePasswordProps {
  onCancel: () => void;
  onSuccess: () => void;
  mustChangePassword?: boolean;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({ onCancel, onSuccess, mustChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) { setError('New passwords do not match'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters long'); return; }
    if (!/\d/.test(newPassword)) { setError('Password must include at least one number'); return; }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) { setError('Password must include at least one special character'); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: mustChangePassword ? null : currentPassword,
          newPassword
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to change password');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {mustChangePassword ? '🔐 Set Your Password' : 'Change Password'}
            </h2>
            {mustChangePassword && (
              <p className="text-sm text-gray-500 mt-1">Please set a password for your account to continue</p>
            )}
          </div>
          {!mustChangePassword && (
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
              <Icons.X className="h-5 w-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="flex">
                <Icons.AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {!mustChangePassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="focus:ring-brand focus:border-brand block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                  placeholder="Enter current password"
                  required
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showCurrent ? <Icons.EyeOff className="h-5 w-5" /> : <Icons.Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="focus:ring-brand focus:border-brand block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                placeholder="Enter new password"
                required
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                {showNew ? <Icons.EyeOff className="h-5 w-5" /> : <Icons.Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Min 8 characters, include a number and a special character.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="focus:ring-brand focus:border-brand block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                placeholder="Confirm new password"
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                {showConfirm ? <Icons.EyeOff className="h-5 w-5" /> : <Icons.Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            {!mustChangePassword && (
              <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
            )}
            <button type="submit" disabled={loading} className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-blue-700 disabled:opacity-50">
              <Icons.Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

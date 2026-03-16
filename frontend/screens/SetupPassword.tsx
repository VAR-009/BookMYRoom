import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { auth, db } from '../firebase';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

interface SetupPasswordProps {
  onComplete: () => void;
}

export const SetupPassword: React.FC<SetupPasswordProps> = ({ onComplete }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      // Update password in Firebase Auth
      await updatePassword(user, password);

      // Update Firestore profile
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        hasPasswordSet: true
      });

      onComplete();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
          <div className="p-2 bg-brand rounded-lg text-white"><Icons.ShieldCheck className="h-8 w-8" /></div>
          <h1 className="text-3xl font-bold text-gray-900">Security Setup</h1>
        </div>
        <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
          Set your login password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Since this is your first login, please set a password for future access using your email.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50"
            >
              {loading ? 'Setting password...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

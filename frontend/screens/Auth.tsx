import React from 'react';
import { Icons } from '../components/Icons';

interface AuthProps {
  mode: 'signin' | 'signup';
  onSwitch: () => void;
  onLogin: (role: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ mode, onSwitch, onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
           <div className="p-2 bg-brand rounded-lg text-white"><Icons.User className="h-8 w-8" /></div>
           <h1 className="text-3xl font-bold text-gray-900">BookMyRoom</h1>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {mode === 'signin' ? 'Access room bookings, schedules, and more' : 'Join the BookMyRoom community'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin('student'); }}>
             {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.User className="h-5 w-5 text-gray-400"/></div>
                    <input type="text" className="pl-10 block w-full border-gray-300 rounded-md focus:ring-brand focus:border-brand sm:text-sm p-2.5 border bg-white" placeholder="e.g. Alex Student" />
                  </div>
                </div>
             )}

            <div>
              <label className="block text-sm font-medium text-gray-700">University Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Monitor className="h-5 w-5 text-gray-400"/></div>
                <input type="email" className="pl-10 block w-full border-gray-300 rounded-md focus:ring-brand focus:border-brand sm:text-sm p-2.5 border bg-white" placeholder="student@university.edu" />
              </div>
            </div>

            {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Number</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Briefcase className="h-5 w-5 text-gray-400"/></div>
                    <input type="text" className="pl-10 block w-full border-gray-300 rounded-md focus:ring-brand focus:border-brand sm:text-sm p-2.5 border bg-white" placeholder="e.g. 2023001234" />
                  </div>
                </div>
             )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.ShieldCheck className="h-5 w-5 text-gray-400"/></div>
                <input type="password" className="pl-10 block w-full border-gray-300 rounded-md focus:ring-brand focus:border-brand sm:text-sm p-2.5 border bg-white" placeholder="••••••••" />
              </div>
            </div>

            {mode === 'signin' && (
               <div className="flex items-center justify-between">
                  <div className="flex items-center">
                     <input type="checkbox" className="h-4 w-4 text-brand border-gray-300 rounded" />
                     <label className="ml-2 block text-sm text-gray-900">Remember me</label>
                  </div>
                  <div className="text-sm">
                     <a href="#" className="font-medium text-brand hover:text-blue-500">Forgot password?</a>
                  </div>
               </div>
            )}

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-colors">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Demo Login Buttons for convenience */}
          {mode === 'signin' && (
             <div className="mt-6">
                <div className="relative">
                   <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                   <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Demo Login As</span></div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2">
                   <button onClick={() => onLogin('student')} className="w-full inline-flex justify-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50">Student</button>
                   <button onClick={() => onLogin('faculty')} className="w-full inline-flex justify-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50">Faculty</button>
                   <button onClick={() => onLogin('admin')} className="w-full inline-flex justify-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50">Admin</button>
                   <button onClick={() => onLogin('room_admin')} className="w-full inline-flex justify-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50">Room Admin</button>
                   <button onClick={() => onLogin('faculty_admin')} className="col-span-2 w-full inline-flex justify-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50">Faculty Room Admin</button>
                </div>
             </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {mode === 'signin' ? 'Need an account?' : 'Already have an account?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button onClick={onSwitch} className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                 {mode === 'signin' ? 'Create a Student Account' : 'Sign in instead'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-gray-500">© 2023 BookMyRoom. All rights reserved.</p>
    </div>
  );
};
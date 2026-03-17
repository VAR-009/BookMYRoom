import React, { useState } from 'react';
import { Icons } from '../components/Icons';

interface AuthProps {
  mode: 'signin' | 'signup';
  onSwitch: () => void;
  onLogin: (role: string, token: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ mode, onSwitch, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url = mode === 'signin'
        ? 'http://localhost:8080/api/auth/login'
        : 'http://localhost:8080/api/auth/register';
      const body = mode === 'signin'
        ? { email, password }
        : { name, email, password, role: 'STUDENT' };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      onLogin(data.role?.toLowerCase(), data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.User className="h-5 w-5 text-gray-400" /></div>
                  <input value={name} onChange={e => setName(e.target.value)} type="text" className="pl-10 block w-full border-gray-300 rounded-md focus:ring-brand focus:border-brand sm:text-sm p-2.5 border bg-white" placeholder="e.g. Alex Student" required />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">University Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Monitor className="h-5 w-5 text-gray-400" /></div>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="pl-10 block w-full border-gray-300 rounded-md focus:ring-brand focus:border-brand sm:text-sm p-2.5 border bg-white" placeholder="student@university.edu" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.ShieldCheck className="h-5 w-5 text-gray-400" /></div>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="pl-10 block w-full border-gray-300 rounded-md focus:ring-brand focus:border-brand sm:text-sm p-2.5 border bg-white" placeholder="••••••••" required />
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
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-blue-700 focus:outline-none transition-colors disabled:opacity-50">
                {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            {mode === 'signin' && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              </div>
            )}
          </form>

          {mode === 'signup' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Already have an account?</span></div>
              </div>
              <div className="mt-6">
                <button onClick={onSwitch} className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  Sign in instead
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-gray-500">© 2026 BookMyRoom. All rights reserved.</p>
    </div>
  );
};

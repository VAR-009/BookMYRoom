import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface AuthProps {
  onLogin: (role: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;
      const isAdminEmail = userEmail === 'varun.yelchuri10@gmail.com';
      
      if (!userEmail?.endsWith('@nitc.ac.in') && !isAdminEmail) {
        await signOut(auth);
        setError('Access restricted to @nitc.ac.in domain only.');
        setLoading(false);
        return;
      }
      
      // Role will be handled in App.tsx after profile fetch
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const normalizedEmail = email.toLowerCase().trim();
    const isAdminEmail = normalizedEmail === 'varun.yelchuri10@gmail.com';
    const isMasterPassword = password === 'temp@123';

    try {
      if (!normalizedEmail.endsWith('@nitc.ac.in') && !isAdminEmail) {
        setError('Access restricted to @nitc.ac.in domain only.');
        setLoading(false);
        return;
      }

      try {
        // Try standard sign in first
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
      } catch (signInErr: any) {
        console.log('Sign in failed, checking for bootstrap:', signInErr.code);
        
        // If admin login fails with the master password, try to create the account
        if (isAdminEmail && isMasterPassword) {
          try {
            await createUserWithEmailAndPassword(auth, normalizedEmail, password);
          } catch (createErr: any) {
            console.log('Bootstrap failed:', createErr.code);
            // If it already exists, it means the password in Firebase is different.
            // We'll show a more helpful message for the admin.
            if (createErr.code === 'auth/email-already-in-use') {
              setError('Admin account exists but password differs. Please login with Google once to sync.');
            } else if (createErr.code === 'auth/operation-not-allowed') {
              setError(
                'Email/Password login is disabled. Please enable it in the Firebase Console: ' +
                'https://console.firebase.google.com/project/gen-lang-client-0601856779/authentication/providers'
              );
            } else {
              setError(`Admin Setup Error: ${createErr.message}`);
            }
            setLoading(false);
            return;
          }
        } else {
          throw signInErr;
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setError(
          'Email/Password login is disabled. Please enable it in the Firebase Console: ' +
          'https://console.firebase.google.com/project/gen-lang-client-0601856779/authentication/providers'
        );
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
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
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access room bookings, schedules, and more
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Icons.ShieldCheck className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {error.includes('http') ? (
                        <>
                          {error.split('https://')[0]}
                          <a 
                            href={`https://${error.split('https://')[1]}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline font-bold"
                          >
                            Firebase Console
                          </a>
                        </>
                      ) : error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {showEmailLogin ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">NITC Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand sm:text-sm"
                    placeholder="name@nitc.ac.in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowEmailLogin(false)}
                    className="text-sm text-brand hover:underline"
                  >
                    Back to Google Login
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-gray-300 border-t-brand rounded-full animate-spin mr-2"></div>
                    ) : (
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    )}
                    {loading ? 'Signing in...' : 'Sign in with NITC Google Account'}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setShowEmailLogin(true)}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
                  >
                    <Icons.Mail className="h-5 w-5 mr-2 text-gray-400" />
                    Email & Password
                  </button>
                </div>
              </>
            )}
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Only @nitc.ac.in email addresses are allowed to access this system.
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-gray-500">© 2023 BookMyRoom. All rights reserved.</p>
    </div>
  );
};

'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'create'>('login');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.endsWith('@admin.com')) {
      setError('Only @admin.com emails are allowed');
      return;
    }

    try {
      console.log('Starting authentication process:', { mode, email });
      let userCredential;
      
      if (mode === 'login') {
        console.log('Attempting login...');
        try {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log('Login successful:', userCredential.user.uid);
        } catch (loginError) {
          console.error('Login error:', loginError);
          if ((loginError as AuthError)?.code === 'auth/invalid-credential') {
            setError('Invalid email or password. Please try again.');
          } else {
            throw loginError;
          }
          return;
        }
      } else {
        console.log('Starting admin account creation...');
        // First validate the email domain
        const response = await fetch('/api/admin/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to validate email domain');
        }

        console.log('Email domain validated, creating Firebase user...');
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Firebase user created successfully');
      }

      // Get the token and store it in a cookie
      console.log('Getting ID token...');
      const token = await userCredential.user.getIdToken();
      console.log('Token received, setting cookie...');
      
      Cookies.set('token', token, { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        domain: window.location.hostname
      });
      console.log('Token stored in cookie');

      // Force a router refresh to update the authentication state
      router.refresh();

      // Redirect to vehicle management
      console.log('Redirecting to vehicle management...');
      router.push('/admin/vehicles');
    } catch (error) {
      console.error('Auth error:', error);
      if ((error as AuthError)?.code === 'auth/configuration-not-found') {
        setError('Firebase configuration error. Please check the console for more details.');
      } else if ((error as AuthError)?.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please try logging in instead.');
      } else if ((error as AuthError)?.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else if ((error as AuthError)?.code === 'auth/user-not-found') {
        setError('No account found with this email. Please create an account first.');
      } else if ((error as AuthError)?.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(error instanceof Error ? error.message : 'Authentication failed');
      }
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address (@admin.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'create' : 'login')}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          {mode === 'login' ? 'Create new admin account' : 'Back to login'}
        </button>
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {mode === 'login' ? 'Sign in' : 'Create Account'}
        </button>
      </div>
    </form>
  );
} 
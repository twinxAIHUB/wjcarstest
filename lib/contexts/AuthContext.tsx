'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for ID token changes and update the cookie
    const tokenListener = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        Cookies.set('token', token, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
      } else {
        Cookies.remove('token');
      }
    });

    return () => {
      unsubscribe();
      tokenListener();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 
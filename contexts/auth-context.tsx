import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signInWithGoogle: () => void;
  signOutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      
      if (firebaseUser) {
        try {
          // Get the Firebase ID token and set it as a cookie
          const idToken = await firebaseUser.getIdToken();
          // Set cookie with appropriate security settings for development and production
          const isSecure = window.location.protocol === 'https:';
          const cookieValue = `firebaseAuthToken=${idToken}; path=/; ${isSecure ? 'secure;' : ''} samesite=strict; max-age=${60 * 60 * 24 * 7}`; // 7 days
          document.cookie = cookieValue;
        } catch (error) {
          setError(error instanceof Error ? error : new Error('Unknown error'));
        }
      } else {
        // Remove the cookie when user signs out
        document.cookie = 'firebaseAuthToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
    }, (error) => {
      setError(error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).catch((error) => setError(error));
  };

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        // Cookie will be removed in the onAuthStateChanged callback
      })
      .catch((error) => setError(error));
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};


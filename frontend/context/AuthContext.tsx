'use client';

// this file gives context to other frontend files about what user is logged in and their information
// really important file

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  redirectIfAuthenticated: (redirectTo?: string) => Promise<void>;
  isAuthenticated: boolean;
}
interface JwtPayload {
  // exp is how we identify when the token expires
  exp: number;
  iat: number;
  id: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // this part just ensures that the user's token hasn't expired
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      return;
    }
    try {
      const decoded: JwtPayload = jwtDecode(storedToken);
      const now = Date.now() / 1000;

      // if token is expired, log out
      if (decoded.exp < now) {
        logout();
      } else {
        setToken(storedToken);

        // automatically logout exactly when the token expires
        const timeout = (decoded.exp - now) * 1000;
        setTimeout(() => logout(), timeout);
      }
    } catch (err) {
      console.error('Invalid token', err);
      logout();
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);

    // decode jwt payload to set auto logout
    try {
      const decoded: JwtPayload = jwtDecode(newToken);
      const now = Date.now() / 1000;
      const timeout = (decoded.exp - now) * 1000;
      setTimeout(() => logout(), timeout);
    } catch (err) {
      console.error('Invalid token on login', err);
    }
  };

  const logout = () => {
    // setLoggingOut is just to make sure navbar disappears at same time as redirect

    setLoggingOut(true);
    localStorage.removeItem('token');
    router.push('/login');
    setToken(null);
  };

  //user can not exist in user table but his token may be valid so still can get in dashboard
  const redirectIfAuthenticated = async (redirectTo: string = '/dashboard') => {
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/api/dashboard/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        router.push(redirectTo);
      } else {
        const data = await res.json();
        // specifically handle token expiration
        if (data.error === 'Token expired') {
          logout();
        } else {
          // fallback for other errors
          logout();
        }
      }
    } catch (err) {
      console.error(err);
      logout();
    }
  };

  const value = {
    token,
    login,
    logout,
    redirectIfAuthenticated,
    isAuthenticated: !!token || loggingOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // make sure its used in the right context
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

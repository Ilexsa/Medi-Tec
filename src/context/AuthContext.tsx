import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthUser = Record<string, any> | null;

interface AuthContextValue {
  user: AuthUser;
  isLoading: boolean;
  accessToken: string | null;
  login: (userData: Record<string, any>, token: string, rememberMe: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredToken(): string | null {
  return (
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token') ||
    null
  );
}

function getStoredUser(): AuthUser {
  const raw = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(getStoredUser());
  const [accessToken, setAccessToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateSession = async () => {
    const token = getStoredToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        logout();
        return;
      }

      const data = await res.json();
      const nextUser = data?.user ?? data?.data?.user ?? data?.data ?? data;
      const isSubActive = data?.suscripcion_activa ?? data?.data?.suscripcion_activa ?? true; // Default true si no viene o es SuperAdmin (se maneja abajo)

      // VALIDATE SUBSCRIPTION
      if (nextUser?.rol && nextUser?.rol !== 'SuperAdmin' && nextUser?.inquilino_id) {
        if (!isSubActive) {
          alert('No posee una suscripción activa. Comuníquese con administración.');
          logout();
          return;
        }
      }

      setUser(nextUser);
      setAccessToken(token);
    } catch (e) {
      console.error('Error al validar sesión:', e);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: Record<string, any>, token: string, rememberMe: boolean) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem('access_token', token);
    storage.setItem('user_data', JSON.stringify(userData));

    const other = rememberMe ? sessionStorage : localStorage;
    other.removeItem('access_token');
    other.removeItem('user_data');

    setAccessToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('user_data');
    setAccessToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, accessToken, login, logout }),
    [user, isLoading, accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, ReqLogin, ReqRegistro, RespuestaLogin } from '../services/auth.service';
import { setAccessToken, setRefreshToken } from '../services/api';

interface UsuarioMin {
  id?: string;
  email?: string;
  nombreCompleto?: string;
  [key: string]: any;
}

interface AuthContextValue {
  usuario: UsuarioMin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (datos: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioMin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estado de autenticación (no logs en producción)

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { usuario, accessToken, refreshToken } = await authService.iniciarSesion(email, password);
      setUsuario(usuario);
      setIsAuthenticated(true);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (datos: any) => {
    setIsLoading(true);
    try {
      // Registro inicial (solo email + password)
      const { usuario, accessToken, refreshToken } = await authService.registrarUsuarioInicial(datos);
      setUsuario(usuario);
      setIsAuthenticated(true);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const checkAuth = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUsuario(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    try {
      const usuario = await authService.obtenerPerfilConToken(token);
      setUsuario(usuario);
      setIsAuthenticated(true);
    } catch {
      setUsuario(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated, isLoading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;


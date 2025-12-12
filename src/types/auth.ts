import { User } from './user';
import { Department } from './department';

// Contexto de autenticación
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Respuesta del login/refresh
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  name: string;
  lastname: string;
  email: string;
  avatar: string;
  roles: string[];
  department?: Department;
}

// Request de login
export interface LoginRequest {
  email: string;
  password: string;
}

// Request de cambio de contraseña
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

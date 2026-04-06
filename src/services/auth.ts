import { apiFetch } from './apiClient';

export interface AuthLogin {
  email: string;
  password?: string;
  identificacion?: string; 
}

export interface AuthRegister {
  email: string;
  password?: string;
  nombres: string;
  apellidos: string;
  identificacion: string;
}

export interface UserMe {
  id: number;
  email: string;
  nombres: string;
  apellidos: string;
  rol: string;
  inquilino_id: number;
  especialidad_id?: number;
  estado: string;
}

type AuthResponse = {
  success: boolean;
  data: {
    token: string;
    usuario: UserMe;
  };
  message?: string;
  error?: string;
};

type MeResponse = {
  success: boolean;
  data: UserMe;
  message?: string;
  error?: string;
};

type MessageResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function login(payload: AuthLogin): Promise<AuthResponse['data']> {
  const res = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false
  });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error en login');
  return res.data;
}

export async function register(payload: AuthRegister): Promise<AuthResponse['data']> {
  const res = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false
  });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error en registro');
  return res.data;
}

export async function getMe(): Promise<UserMe> {
  const res = await apiFetch<MeResponse>('/auth/me', {
    method: 'GET'
  });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener sesión');
  return res.data;
}

export async function logout(): Promise<void> {
  const res = await apiFetch<MessageResponse>('/auth/logout', {
    method: 'POST'
  });
  if (!res?.success && res) throw new Error(res?.error || res?.message || 'Error al desloguearse');
}

import { apiFetch } from './apiClient';

export interface DoctorApi {
  id: number;
  usuario_id: number | null;
  inquilino_id: number;
  especialidad_id: number;

  numero_licencia: string | null;
  titulo_profesional: string | null;
  anios_experiencia: number | null;
  biografia: string | null;
  url_foto: string | null;

  acepta_nuevos_pacientes: boolean;
  activo: boolean;

  fecha_creacion?: string | null;
  fecha_actualizacion?: string | null;

  // Campos “joined”
  nombres?: string | null;
  apellidos?: string | null;
  identificacion?: string | null;
  email?: string | null;
  telefono?: string | null;
  nombre_especialidad?: string | null;
}

type ListResponse = {
  success: boolean;
  data: {
    data: DoctorApi[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
  message?: string;
  error?: string;
};

type CreateResponse = {
  success: boolean;
  data: DoctorApi;
  message?: string;
  error?: string;
};

type MessageResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export interface DoctorCreateApi {
  nombres: string;
  apellidos: string;
  identificacion: string;
  email?: string | null;
  telefono?: string | null;

  especialidad_id: number;

  numero_licencia?: string | null;
  titulo_profesional?: string | null;
  anios_experiencia?: number | null;
  biografia?: string | null;
  url_foto?: string | null;

  // create user link
  crear_usuario: boolean;
  usuario_id?: number | null;
  usuario_email?: string | null;
  usuario_password?: string | null;

  // opcionales (por si los mandas)
  acepta_nuevos_pacientes?: boolean;
  activo?: boolean;
}

export interface DoctorUpdateApi {
  nombres?: string;
  apellidos?: string;
  identificacion?: string;
  email?: string | null;
  telefono?: string | null;

  especialidad_id?: number;

  numero_licencia?: string | null;
  titulo_profesional?: string | null;
  anios_experiencia?: number | null;
  biografia?: string | null;
  url_foto?: string | null;

  acepta_nuevos_pacientes?: boolean;
  activo?: boolean;

  usuario_id?: number | null;
}

export async function getDoctors(params?: { page?: number; limit?: number }): Promise<ListResponse['data']> {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  const suffix = q.toString() ? `?${q.toString()}` : '';

  const res = await apiFetch<ListResponse>(`/medicos${suffix}`);
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener médicos');
  return res.data;
}

export async function createDoctor(payload: DoctorCreateApi): Promise<DoctorApi> {
  const res = await apiFetch<CreateResponse>('/medicos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al crear médico');
  return res.data;
}

export async function updateDoctor(id: number, payload: DoctorUpdateApi): Promise<void> {
  const res = await apiFetch<MessageResponse>(`/medicos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al actualizar médico');
}

export async function deleteDoctor(id: number): Promise<void> {
  const res = await apiFetch<MessageResponse>(`/medicos/${id}`, { method: 'DELETE' });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al eliminar médico');
}
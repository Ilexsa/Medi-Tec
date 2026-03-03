import { apiFetch } from './apiClient';

export interface SpecialtyApi {
  id: number;
  inquilino_id?: number;
  nombre: string;
  codigo?: string | null;
  descripcion?: string | null;
  duracion_por_defecto?: number | null;
  color?: string | null; // HEX
  icono?: string | null; // string (emoji o lo que uses)
  activo?: boolean;
  fecha_creacion?: string | null;
}

type ListResponse = {
  success: boolean;
  data: SpecialtyApi[];
  message?: string;
};

type CreateResponse = {
  success: boolean;
  data: SpecialtyApi;
  message?: string;
};

type MessageResponse = {
  success: boolean;
  message?: string;
  data?: any;
};

export interface SpecialtyCreateApi {
  nombre: string;
  codigo?: string | null;
  descripcion?: string | null;
  duracion_por_defecto?: number | null;
  color?: string | null;
  icono?: string | null;
}

export async function getSpecialties(): Promise<SpecialtyApi[]> {
  const res = await apiFetch<ListResponse>('/especialidades');
  if (!res?.success) throw new Error(res?.message || 'Error al obtener especialidades');
  return res.data ?? [];
}

export async function createSpecialty(payload: SpecialtyCreateApi): Promise<SpecialtyApi> {
  const res = await apiFetch<CreateResponse>('/especialidades', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res?.success) throw new Error(res?.message || 'Error al crear especialidad');
  return res.data;
}

// Asumido REST típico:
export async function updateSpecialty(id: number, payload: Partial<SpecialtyCreateApi>): Promise<void> {
  const res = await apiFetch<MessageResponse>(`/especialidades/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res?.success) throw new Error(res?.message || 'Error al actualizar especialidad');
}

export async function deleteSpecialty(id: number): Promise<void> {
  const res = await apiFetch<MessageResponse>(`/especialidades/${id}`, { method: 'DELETE' });
  if (!res?.success) throw new Error(res?.message || 'Error al eliminar especialidad');
}
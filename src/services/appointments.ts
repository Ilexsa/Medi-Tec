import { apiFetch } from './apiClient';

export interface CitaApi {
  id: number;
  inquilino_id: number;
  paciente_id: number;
  medico_id: number;
  fecha_hora: string;
  motivo?: string | null;
  estado: string; // "Programada", "Completada", "Cancelada", etc
  notas?: string | null;
  fecha_creacion?: string;
  fecha_actualizacion?: string;

  // Joined fields
  paciente_nombres?: string;
  paciente_apellidos?: string;
  medico_nombres?: string;
  medico_apellidos?: string;
}

type ListResponse = {
  success: boolean;
  data: {
    data: CitaApi[];
    pagination: { page: number; limit: number; total: number; total_pages: number };
  };
  message?: string;
  error?: string;
};

type SingleResponse = {
  success: boolean;
  data: CitaApi;
  message?: string;
  error?: string;
};

type MessageResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function listAppointments(params?: { page?: number; limit?: number; paciente_id?: number; medico_id?: number; estado?: string }): Promise<ListResponse['data']> {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.paciente_id) q.set('paciente_id', String(params.paciente_id));
  if (params?.medico_id) q.set('medico_id', String(params.medico_id));
  if (params?.estado) q.set('estado', params.estado);

  const suffix = q.toString() ? `?${q.toString()}` : '';
  const res = await apiFetch<ListResponse>(`/citas${suffix}`);
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al listar citas');
  return res.data;
}

export async function getAvailability(medico_id: number, fecha: string): Promise<any> {
    const res = await apiFetch<any>(`/citas/disponibilidad?medico_id=${medico_id}&fecha=${fecha}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al consultar disponibilidad');
    return res.data;
}

export async function getAppointment(id: number): Promise<CitaApi> {
  const res = await apiFetch<SingleResponse>(`/citas/${id}`);
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener cita');
  return res.data;
}

export async function createAppointment(payload: Partial<CitaApi>): Promise<CitaApi> {
  const res = await apiFetch<SingleResponse>('/citas', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al crear cita');
  return res.data;
}

export async function updateAppointment(id: number, payload: Partial<CitaApi>): Promise<void> {
  const res = await apiFetch<MessageResponse>(`/citas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al actualizar cita');
}

export async function checkInAppointment(id: number): Promise<void> {
  const res = await apiFetch<MessageResponse>(`/citas/${id}/check-in`, {
    method: 'PUT'
  });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al hacer check-in');
}

export async function cancelAppointment(id: number, motivo?: string): Promise<void> {
  const res = await apiFetch<MessageResponse>(`/citas/${id}/cancelar`, {
    method: 'PUT',
    body: JSON.stringify({ motivo_cancelacion: motivo })
  });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al cancelar cita');
}
